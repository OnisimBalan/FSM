import React, { useState, useEffect } from "react";
import { AppService } from "../services/app-services";

const GameScreen: React.FC<{ playerName: string }> = ({ playerName }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const wsService = new AppService("ws://localhost:5000/playerdata/ws");

    wsService.connect(playerName).then(() => {
      setSocket(wsService['socket']);  // Assign WebSocket instance to state
    }).catch((error) => {
      console.error("WebSocket connection failed", error);
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [playerName]);

  // Send player data (name and position) to the WebSocket server
  const sendPlayerData = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        Name: playerName,
        Position: position,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = 50;
    setPosition((prevPosition) => {
      const newPosition = { ...prevPosition };

      if (event.key === "w") newPosition.y = Math.max(0, newPosition.y - step);
      if (event.key === "s") newPosition.y = Math.min(575, newPosition.y + step);
      if (event.key === "a") newPosition.x = Math.max(0, newPosition.x - step);
      if (event.key === "d") newPosition.x = Math.min(775, newPosition.x + step);

      sendPlayerData();
      return newPosition;
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);

  return (
    <div className="game-screen">
      <div className="square" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
        {playerName}
      </div>
    </div>
  );
};

export default GameScreen;
