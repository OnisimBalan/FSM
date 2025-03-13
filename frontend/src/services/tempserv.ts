export class TempServ {
    private socket: WebSocket;

    constructor() {
        // Initialize the WebSocket in the constructor
        this.socket = new WebSocket('ws://localhost:5000/ws');

        // Set up WebSocket event handlers
        this.socket.onopen = () => {
            console.log("Connected to the WebSocket server");

            // Send a message to the server
            this.socket.send("Test Client<EOF>");
        };

        this.socket.onmessage = (event) => {
            console.log("Message from server: " + event.data);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket Error: " + error);
        };

        this.socket.onclose = () => {
            console.log("Disconnected from WebSocket server");
        };
    }
}


