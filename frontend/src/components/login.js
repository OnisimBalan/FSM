import "../style/style.css";
export const renderLoginPage = (onPlayClick) => {
    const appContainer = document.querySelector("#app");
    appContainer.innerHTML = `
    <div class="login-screen">
      <div class="name-input">
        <label for="name">Enter your name:</label>
        <input type="text" id="name" placeholder="Your name">
        <button id="playBtn">Play</button>
      </div>
    </div>
  `;
    const playButton = document.getElementById("playBtn");
    playButton.addEventListener("click", () => {
        const nameInput = document.getElementById("name");
        const name = nameInput.value.trim();
        if (name) {
            onPlayClick(name); // Pass the name to the callback function
        }
        else {
            alert("Please enter a name");
        }
    });
    return (React.createElement("label", null, "asdasdasd"));
};
