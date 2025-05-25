export class BaseTool {
    register(server) {
        this.server = server;
        server.tool(this.name, this.description, this.schema.shape, this.execute.bind(this));
    }
}
