export class AppService {
  private socket: WebSocket | null = null;
  private reconnectInterval = 5000; // Reconnect every 5 seconds if disconnected
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  // Connect to the WebSocket server
  connect(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.serverUrl);

      this.socket.onopen = () => {
        console.log("Connected to WebSocket server");
        this.sendMessage({ type: "join", name }); // Send player data on connect
        resolve();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "update_position") {
          console.log(`${data.name} updated position:`, data.position);
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.reconnect(name); // Attempt reconnection
        reject(error);
      };

      this.socket.onclose = () => {
        console.warn("WebSocket connection closed. Attempting reconnection...");
        this.reconnect(name);
      };
    });
  }

  // Handle automatic reconnection
  private reconnect(name: string) {
    setTimeout(() => {
      console.log("Reconnecting...");
      this.connect(name).catch((error) =>
        console.error("Reconnection failed:", error)
      );
    }, this.reconnectInterval);
  }

  // Send data to the WebSocket server
  sendMessage(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("Cannot send data: WebSocket not connected");
    }
  }

  // Send position data to the server
  sendPosition(name: string, position: { x: number; y: number }): void {
    this.sendMessage({ type: "update_position", name, position });
  }

  // Close the WebSocket connection
  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
