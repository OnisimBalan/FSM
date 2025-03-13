export class AppService {
    private socket: WebSocket | null = null;
  
    constructor(private serverUrl: string) {}
  
    // Connect to the WebSocket server
    connect(name: string): Promise<void> {
      return new Promise((resolve, reject) => {
        this.socket = new WebSocket(this.serverUrl);
  
        this.socket.onopen = () => {
          console.log('Connected to WebSocket server');
          // Send the player's name once connected
          this.socket?.send(JSON.stringify({ type: 'join', name }));
          resolve();
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'update_position') {
            console.log(`${data.name} updated position:`, data.position);
            // You can implement any logic here to update the game state based on position data
          }
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
  
        this.socket.onclose = () => {
          console.log('Disconnected from WebSocket server');
        };
      });
    }
  
    // Send position data to the server
    sendPosition(name: string, position: { x: number; y: number }): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: 'update_position',
            name,
            position,
          })
        );
      }
    }
  
    // Close the WebSocket connection
    closeConnection(): void {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  