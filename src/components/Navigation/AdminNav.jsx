import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import "../../App.css";
import GameBoardsListAdmin from "../Admin/GameBoardsListAdmin";
import UsersAdmin from "../Admin/UsersAdmin";

function Navigation() {
  const { user, token } = useContext(UserContext);
  const [selectedPage, setSelectedPage] = useState("games");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close menu when clicking outside the navbar
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
        <div className="navbar-logo">Administration</div>
        
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
          </li>          <li className="nav-item-main">
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
          
          <li className="nav-item-main">
            <Link
              to="/"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Back to Home
            </Link>
          </li>
          
          {token && (
            <li className="nav-item-main">
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
          )}
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
