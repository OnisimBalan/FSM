import { AppService } from '../services/app-services';
// Instantiate AppService with WebSocket URL
const appService = new AppService('ws://localhost:3000');
export const initializeGame = (name) => {
    const appContainer = document.querySelector("#app");
    appContainer.innerHTML = `
    <div class="game-screen">
      <div class="square"></div>
    </div>
  `;
    const square = document.querySelector(".square");
    let position = { x: 0, y: 0 };
    // Connect to WebSocket server
    appService.connect(name).then(() => {
        console.log('Game connected successfully');
    }).catch(() => {
        console.error('Error connecting to WebSocket server:');
    });
    // Function to send position updates to the server
    const sendPositionToServer = () => {
        appService.sendPosition(name, position);
    };
    document.addEventListener("keydown", (event) => {
        const step = 50;
        if (event.key === "w") {
            position.y = Math.max(0, position.y - step);
        }
        if (event.key === "s") {
            position.y = Math.min(575, position.y + step);
        }
        if (event.key === "a") {
            position.x = Math.max(0, position.x - step);
        }
        if (event.key === "d") {
            position.x = Math.min(775, position.x + step);
        }
        square.style.transform = `translate(${position.x}px, ${position.y}px)`;
        // Send position update to server
        sendPositionToServer();
    });
    // Ensure WebSocket connection is closed when leaving the game
    window.addEventListener('beforeunload', () => {
        appService.closeConnection();
    });
};
