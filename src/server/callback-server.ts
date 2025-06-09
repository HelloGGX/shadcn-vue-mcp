import { createServer, Server, IncomingMessage, ServerResponse } from "http";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
import fs from "fs";
import { parse as parseUrl } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CallbackResponse {
  data?: any;
}

export interface CallbackServerConfig {
  initialData?: any;
  timeout?: number;
}

export class CallbackServer {
  private server: Server | null = null;
  private port: number;
  private sessionId = Math.random().toString(36).substring(7);
  private timeoutId?: NodeJS.Timeout;
  private mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
  };

  constructor(port = 3333) {
    this.port = port;
  }

  private parseBodyJson(req: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const data = body ? JSON.parse(body) : {};
          resolve(data);
        } catch {
          resolve({});
        }
      });
    });
  }

  private getRouteParams(
    url: string,
    pattern: string
  ): Record<string, string> | null {
    const urlParts = url.split("/").filter(Boolean);
    const patternParts = pattern.split("/").filter(Boolean);

    if (urlParts.length !== patternParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        const paramName = patternParts[i].substring(1);
        params[paramName] = urlParts[i];
      } else if (patternParts[i] !== urlParts[i]) {
        return null;
      }
    }

    return params;
  }

  private async serveStatic(res: ServerResponse, filepath: string) {
    try {
      const stat = await fs.promises.stat(filepath);

      if (stat.isDirectory()) {
        filepath = path.join(filepath, "index.html");
      }

      const ext = path.extname(filepath);
      const contentType = this.mimeTypes[ext] || "application/octet-stream";

      const content = await fs.promises.readFile(filepath);

      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        const previewerPath = path.join(__dirname, "./previewer");
        const indexPath = path.join(previewerPath, "index.html");

        if (filepath !== indexPath) {
          await this.serveStatic(res, indexPath);
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
      } else {
        res.writeHead(500);
        res.end("Internal server error");
      }
    }
  }

  private handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const urlInfo = parseUrl(req.url || "/");
    const pathname = urlInfo.pathname || "/";

    // Handle callback route
    if (req.method === "GET" && pathname.startsWith("/callback/")) {
      const params = this.getRouteParams(pathname, "/callback/:id");
      if (params && params.id === this.sessionId) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ status: "success", data: this.config?.initialData })
        );
        return;
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ status: "error", message: "Session not found" })
        );
        return;
      }
    }

    // Handle callback post
    if (req.method === "POST" && pathname.startsWith("/callback/")) {
      const params = this.getRouteParams(pathname, "/callback/:id");
      if (params && params.id === this.sessionId && this.promiseResolve) {
        if (this.timeoutId) clearTimeout(this.timeoutId);

        const body = await this.parseBodyJson(req);
        this.promiseResolve({ data: body || {} });
        this.shutdown();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success" }));
        return;
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ status: "error", message: "Session not found" })
        );
        return;
      }
    }

    // Serve static files or send index.html
    const previewerPath = path.join(__dirname, "./previewer");
    const filePath = path.join(
      previewerPath,
      pathname === "/" ? "index.html" : pathname
    );
    await this.serveStatic(res, filePath);
  };

  private async shutdown(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const tester = net
        .createServer()
        .once("error", () => resolve(false))
        .once("listening", () => {
          tester.close();
          resolve(true);
        })
        .listen(port, "127.0.0.1");
    });
  }

  private async findAvailablePort(): Promise<number> {
    let port = this.port;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
      port++;
    }
    throw new Error("Unable to find an available port after 100 attempts");
  }

  private config?: CallbackServerConfig;
  private promiseResolve?: (value: CallbackResponse) => void;
  private promiseReject?: (reason: any) => void;

  async promptUser(
    config: CallbackServerConfig = {}
  ): Promise<CallbackResponse> {
    const { initialData = null, timeout = 300000 } = config;
    this.config = config;
    console.log("initialData", initialData);
    try {
      const availablePort = await this.findAvailablePort();
      this.server = createServer(this.handleRequest);
      this.server.listen(availablePort, "127.0.0.1");

      return new Promise<CallbackResponse>((resolve, reject) => {
        this.promiseResolve = resolve;
        this.promiseReject = reject;

        if (!this.server) {
          reject(new Error("Failed to start server"));
          return;
        }

        this.server.on("error", (error) => {
          if (this.promiseReject) this.promiseReject(error);
        });

        this.timeoutId = setTimeout(() => {
          resolve({ data: { timedOut: true } });
          this.shutdown();
        }, timeout);

        const url = `http://127.0.0.1:${availablePort}?id=${this.sessionId}`;

        open(url).catch((error) => {
          console.warn("Failed to open browser:", error);
          resolve({ data: { browserOpenFailed: true } });
          this.shutdown();
        });
      });
    } catch (error) {
      await this.shutdown();
      throw error;
    }
  }
}