// src/components/LoginPage.tsx
import React, { useState } from "react";

interface LoginPageProps {
  onPlayClick: (name: string) => void;  // Add onPlayClick as a required prop
}

const LoginPage: React.FC<LoginPageProps> = ({ onPlayClick }) => {
  const [name, setName] = useState("");

  const handlePlayClick = () => {
    if (name.trim()) {
      onPlayClick(name.trim());
    } else {
      alert("Please enter a name");
    }
  };

  return (
    <div className="login-screen">
      <div className="name-input">
        <label htmlFor="name">Enter your name:</label>
        <input
          type="text"
          id="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handlePlayClick}>Play</button>
      </div>
    </div>
  );
};

export default LoginPage;
