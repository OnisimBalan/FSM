import React, { useState, useEffect } from "react";
import "../style/style.css";
import LoginPage  from "./login";
import { AppState } from "./application";
import { AppService } from "../services/app-services";

const appService = new AppService("ws://localhost:3000");

const GameScreen: React.FC<{ playerName: string }> = ({ playerName }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    appService.connect(playerName)
      .then(() => console.log("Game connected successfully"))
      .catch(() => console.error("Error connecting to WebSocket server"));

    const handleKeyDown = (event: KeyboardEvent) => {
      const step = 50;
      setPosition((prevPosition) => {
        const newPosition = { ...prevPosition };
        if (event.key === "w") newPosition.y = Math.max(0, newPosition.y - step);
        if (event.key === "s") newPosition.y = Math.min(575, newPosition.y + step);
        if (event.key === "a") newPosition.x = Math.max(0, newPosition.x - step);
        if (event.key === "d") newPosition.x = Math.min(775, newPosition.x + step);

        appService.sendPosition(playerName, newPosition);
        return newPosition;
      });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      appService.closeConnection();
    };
  }, [playerName]);

  return (
    <div className="game-screen">
      <div className="square" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}></div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.Login);
  const [playerName, setPlayerName] = useState<string>("");

  const handleLogin = (name: string) => {
    setPlayerName(name);
    setCurrentState(AppState.Playing);
  };

  return (
    <div id="app">
      {currentState === AppState.Idle && <div>Error: Something went wrong!</div>}
      {currentState === AppState.Login && <div>{LoginPage(handleLogin)}</div>}
      {currentState === AppState.Playing && <GameScreen playerName={playerName} />}
    </div>
  );
};

export default App;