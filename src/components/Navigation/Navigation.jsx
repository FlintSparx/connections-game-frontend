import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "../../styles/App.css";

//navbar for navigation between main pages
function Navigation() {
  const { user, token } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
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

  // Helper for navigation
  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Connections</div>
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
            className="nav-link"
            onClick={() => handleNav("/")}
            type="button"
          >
            Play Game
          </button>
        </li>
        <li className="nav-item-main">
          <button
            className="nav-link"
            onClick={() => handleNav("/browse")}
            type="button"
          >
            Browse Game Boards
          </button>
        </li>
        <li className="nav-item-main">
          <button
            className="nav-link"
            onClick={() => handleNav("/create")}
            type="button"
          >
            Create Game Board
          </button>
        </li>
        {token && user?.isAdmin && (
          <li className="nav-item-main">
            <button
              className="nav-link"
              onClick={() => handleNav("/admin")}
              type="button"
            >
              Admin
            </button>
          </li>
        )}
        {token && (
          <li className="nav-item-main">
            <button
              className="nav-link"
              onClick={() => handleNav("/profile")}
              type="button"
            >
              Profile
            </button>
          </li>
        )}
        <li className="nav-item-main">
          {!token ? (
            <button
              className="nav-link"
              onClick={() => handleNav("/login")}
              type="button"
            >
              Login
            </button>
          ) : (
            <button
              className="nav-link"
              onClick={() => handleNav("/logout")}
              type="button"
            >
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
