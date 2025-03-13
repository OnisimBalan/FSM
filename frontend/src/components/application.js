import "../style/style.css";
import { initializeGame } from "./game-sqare";
var AppState;
(function (AppState) {
    AppState["Idle"] = "IDLE";
    AppState["Login"] = "LOGIN";
    AppState["Playing"] = "PLAYING";
})(AppState || (AppState = {}));
let pname = "";
let currentState = AppState.Login;
const updateAppState = () => {
    // const appContainer = document.querySelector<HTMLDivElement>("#app")!;
    // appContainer.innerHTML = '';
    // Render content on base state
    if (currentState === AppState.Idle) {
        //appContainer.innerHTML = `<div>Error: Something went wrong!</div>`;
        return (React.createElement("div", null, "Error: Something went wrong!"));
    }
    else if (currentState === AppState.Login) {
        // Render the login page
        // renderLoginPage((name: string) => {
        //   name = pname;
        //   currentState = AppState.Playing; // Transition to Playing state
        //   console.log(name);
        //   initializeGame(name);  // Render the game page
        //});
        return React.createElement("renderLoginPage", null);
    }
    else if (currentState === AppState.Playing) {
        initializeGame(pname); // Render the game page
    }
};
updateAppState();
