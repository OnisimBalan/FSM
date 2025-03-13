import React, { useState } from "react";
import "../style/style.css";
import LoginPage from "./login";
import GameScreen from "./game-sqare";

export enum AppState {
  Idle = "IDLE",
  Login = "LOGIN",
  Playing = "PLAYING",
}

interface GameScreenProps {
  playerName: string;
}

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

      {currentState === AppState.Login && (
        <LoginPage onPlayClick={handleLogin} />
      )}

      {currentState === AppState.Playing && (
        <GameScreen playerName={playerName} />
      )}
    </div>
  );
};

export default App;
