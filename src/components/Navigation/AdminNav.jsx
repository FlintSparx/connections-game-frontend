import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import "../../styles/App.css";
import GameBoardsListAdmin from "../Admin/GameBoardsListAdmin";
import UsersAdmin from "../Admin/UsersAdmin";

// Admin navigation bar for switching between admin pages
function Navigation() {
  const { user, token } = useContext(UserContext);
  const [selectedPage, setSelectedPage] = useState("games"); // Track the active admin page
  const [menuOpen, setMenuOpen] = useState(false); // Track the state of the mobile menu

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.navbar')) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <nav className="navbar">
        <div className="admin-header">Administration</div>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? "show-mobile-menu" : ""}`}>
          <li className="nav-item-main">
            <button
              className={selectedPage === "games" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setSelectedPage("games");
                setMenuOpen(false);
              }}
              style={{ border: "none" }}
            >
              Games
            </button>
          </li>
          <li className="nav-item-main">
            <button
              className={selectedPage === "users" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setSelectedPage("users");
                setMenuOpen(false);
              }}
              style={{ border: "none" }}
            >
              Users
            </button>
          </li>
        </ul>
      </nav>

      {/* Render the selected admin page */}
      <div>
        {selectedPage === "games" && <GameBoardsListAdmin />}
        {selectedPage === "users" && <UsersAdmin />}
      </div>
    </>
  );
}

export default Navigation;
