// filepath: f:\Documents\schoolStuff\gitRepos\assignments\capstone\client\src\components\Navigation\AdminNav.jsx
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import "../../App.css";
import GameBoardsListAdmin from "../Admin/GameBoardsListAdmin";
import UsersAdmin from "../Admin/UsersAdmin";

function Navigation() {
  const { user, token } = useContext(UserContext);
  const [selectedPage, setSelectedPage] = useState("games");

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">Administration</div>
        <ul className="navbar-links">
          <li>
            <button
              className={
                selectedPage === "games" ? "nav-link active" : "nav-link"
              }
              onClick={() => setSelectedPage("games")}
              style={{
                border: "none",
              }}
            >
              Games
            </button>
          </li>
          <li>
            <button
              className={
                selectedPage === "users" ? "nav-link active" : "nav-link"
              }
              onClick={() => setSelectedPage("users")}
              style={{
                border: "none",
              }}
            >
              Users
            </button>
          </li>
        </ul>
      </nav>
      <div>
        {selectedPage === "games" && <GameBoardsListAdmin />}
        {selectedPage === "users" && <UsersAdmin />}
      </div>
    </>
  );
}

export default Navigation;
