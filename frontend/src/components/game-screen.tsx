import React, { useState, useEffect } from "react";
import { AppService } from "../services/app-services";

const GameScreen: React.FC<{ playerName: string }> = ({ playerName }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const appService = new AppService("ws://localhost:3000"); // WebSocket URL

  useEffect(() => {
    appService.connect(playerName)
      .then(() => console.log("Game connected successfully"))
      .catch((error) => console.error("Error connecting to WebSocket server", error));

    const handleKeyDown = (event: KeyboardEvent) => {
      const step = 50;
      setPosition((prevPosition) => {
        const newPosition = { ...prevPosition };
        if (event.key === "w") newPosition.y = Math.max(0, newPosition.y - step);
        if (event.key === "s") newPosition.y = Math.min(575, newPosition.y + step);
        if (event.key === "a") newPosition.x = Math.max(0, newPosition.x - step);
        if (event.key === "d") newPosition.x = Math.min(775, newPosition.x + step);

        appService.sendPosition(playerName, newPosition); // Send position update to server
        return newPosition;
      });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      appService.closeConnection(); // Close connection when component unmounts
    };
  }, [playerName, appService]);

  return (
    <div className="game-screen">
      <div className="square" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}></div>
    </div>
  );
};

export default GameScreen;
