import { Drash } from "../../deps.ts";

export class WebSocketResource extends Drash.Resource {
  public paths = ["/websocket"];

  /**
   * VERIFY
| TERMINAL_ONE[Run App]   * $ deno run --allow-net app.ts

| TERMINAL_TWO[Open REPL] * $ deno
| TERMINAL_TWO[init ws]   * > const ws = new WebSocket("ws://localhost:1447/websocket");

| TERMINAL_ONE[Verify]    * WebSocket connection opened!

| TERMINAL_TWO[handler]   * > ws.onmessage = (e) => console.log(e.data);
| TERMINAL_TWO[Verify]    * [Function]
| TERMINAL_TWO[SendMsg]   * > ws.send("Is there anybody out there?!");
| TERMINAL_TWO[Verify]    * > We received your message! You sent: Is there anybody out there?!

| TERMINAL_ONE[Verify]    * Message received: Is there anybody out there?!
   */

  public GET(request: Drash.Request, response: Drash.Response): void {
    // If all of the requirements to upgrade a connection to a WebSocket are
    // met, then upgrade the connection to a WebSocket
    if (
      request.headers.has("connection") &&
      request.headers.has("upgrade") &&
      request.headers.get("connection")!.toLowerCase().includes("upgrade") &&
      request.headers.get("upgrade")!.toLowerCase() == "websocket"
    ) {
      try {
        const {
          socket,
          response: socketResponse,
        } = Deno.upgradeWebSocket(request);

        this.#addEventHandlers(socket);

        return response.upgrade(socketResponse);
      } catch (error) {
        console.log(error);
        return response.text(error);
      }
    }

    // Otherwise, just send a message
    return response.text("Hello!");
  }

  #addEventHandlers(socket: WebSocket): void {
    // When the connection opens, log that it has been opened
    socket.onopen = () => {
      console.log("WebSocket connection opened!");
    };

    // When a message is received from the client, log it and send a message to
    // the client confirming that the message was received
    socket.onmessage = (e: MessageEvent) => {
      console.log(`Message received:`, e.data);
      socket.send(`We received your message! You sent: ${e.data}`);
    };

    // When the connection closes, log that it has been closed
    socket.onclose = () => {
      console.log("Connection closed.");
    };

    // When an error occurs during the connection, log the error
    socket.onerror = (e: Event) => {
      console.log("WebSocket error:", e);
      socket.send(`Woops! We hit a snag: ${e}`);
    };
  }
}