import React, { useState } from "react";
import LoginPage from "./login-page"; 
import GameScreen from "./game-screen"; 
import { AppState } from "../types/appState";

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.Login);
  const [playerName, setPlayerName] = useState<string>("");

  // Handle the login and transition to the game screen
  const handleLogin = (name: string) => {
    setPlayerName(name);
    setCurrentState(AppState.Playing); // Transition to the Playing state
  };

  return (
    <div id="app">
      {currentState === AppState.Idle && <div>Error: Something went wrong!</div>}

      {currentState === AppState.Login && <LoginPage onPlayClick={handleLogin} />}

      {currentState === AppState.Playing && <GameScreen playerName={playerName} />}
    </div>
  );
};

export default App;
