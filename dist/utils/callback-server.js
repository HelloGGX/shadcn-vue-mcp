import express from "express";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class CallbackServer {
    constructor(port = 3333) {
        this.server = null;
        this.app = express();
        this.sessionId = Math.random().toString(36).substring(7);
        this.port = port;
        this.setupRoutes();
    }
    setupRoutes() {
        const previewerPath = path.join(__dirname, "../../previewer");
        this.app.use(express.json());
        this.app.use(express.static(previewerPath));
        this.app.get("/callback/:id", (req, res) => {
            const { id } = req.params;
            if (id === this.sessionId) {
                res.json({ status: "success", data: this.config?.initialData });
            }
            else {
                res.status(404).json({ status: "error", message: "Session not found" });
            }
        });
        this.app.post("/callback/:id", (req, res) => {
            const { id } = req.params;
            if (id === this.sessionId && this.promiseResolve) {
                if (this.timeoutId)
                    clearTimeout(this.timeoutId);
                this.promiseResolve({ data: req.body || {} });
                this.shutdown();
            }
            res.json({ status: "success" });
        });
        this.app.get("*", (req, res) => {
            res.sendFile(path.join(previewerPath, "index.html"));
        });
    }
    async shutdown() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    isPortAvailable(port) {
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
    async findAvailablePort() {
        let port = this.port;
        for (let attempt = 0; attempt < 100; attempt++) {
            if (await this.isPortAvailable(port)) {
                return port;
            }
            port++;
        }
        throw new Error("Unable to find an available port after 100 attempts");
    }
    async promptUser(config = {}) {
        const { initialData = null, timeout = 300000 } = config;
        this.config = config;
        try {
            const availablePort = await this.findAvailablePort();
            this.server = this.app.listen(availablePort, "127.0.0.1");
            return new Promise((resolve, reject) => {
                this.promiseResolve = resolve;
                this.promiseReject = reject;
                if (!this.server) {
                    reject(new Error("Failed to start server"));
                    return;
                }
                this.server.on("error", (error) => {
                    if (this.promiseReject)
                        this.promiseReject(error);
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
        }
        catch (error) {
            await this.shutdown();
            throw error;
        }
    }
}
