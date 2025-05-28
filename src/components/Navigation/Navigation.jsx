import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import "../../styles/App.css";

// Navigation component that handles responsive menu display and routing between pages
function Navigation() {
  const { user, token } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false); // State to track mobile menu open/closed status
  const location = useLocation();
  const navigate = useNavigate();

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close menu when clicking outside the navbar
      if (!event.target.closest(".navbar")) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to toggle main menu
  const toggleMainMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Helper for navigation
  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false); // Close mobile menu after navigation
  };
  return (
    <nav className="navbar">
      {/* App logo/title that links to home */}
      <div
        className={`navbar-logo ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => handleNav("/")}
        style={{ cursor: "pointer" }}
      >
        Connections
      </div>
      {/* Mobile menu hamburger button - only visible on smaller screens */}
      <button
        className="mobile-menu-button"
        onClick={toggleMainMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>{" "}
      {/* Navigation links with dynamic class based on menu state for responsive display */}
      <ul className={`navbar-links ${menuOpen ? "show-mobile-menu" : ""}`}>
        {/* Navigation items with active state highlighting based on current path */}
        <li className="nav-item-main">
          <button
            className={`nav-link ${
              location.pathname === "/browse" ? "active" : ""
            }`}
            onClick={() => handleNav("/browse")}
            type="button"
          >
            Browse Games
          </button>
        </li>
        {/* Navigation item for creating a game */}
        <li className="nav-item-main">
          <button
            className={`nav-link ${
              location.pathname === "/create" ? "active" : ""
            }`}
            onClick={() => handleNav("/create")}
            type="button"
          >
            Create Game
          </button>
        </li>
        {/* Conditional rendering of admin link for admin users) */}
        {token && user?.isAdmin && (
          <li className="nav-item-main">
            <button
              className={`nav-link ${
                location.pathname === "/admin" ? "active" : ""
              }`}
              onClick={() => handleNav("/admin")}
              type="button"
            >
              Admin
            </button>
          </li>
        )}
        {/* Conditional rendering of profile link for logged-in users) */}
        {token && (
          <li className="nav-item-main">
            <button
              className={`nav-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}
              onClick={() => handleNav("/profile")}
              type="button"
            >
              Profile
            </button>
          </li>
        )}
        {/* Dynamic login/logout button based on authentication state */}
        <li className="nav-item-main">
          {!token ? (
            <button
              className={`nav-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
              onClick={() => handleNav("/login")}
              type="button"
            >
              Login
            </button>
          ) : (
            <button
              className={`nav-link ${
                location.pathname === "/logout" ? "active" : ""
              }`}
              onClick={() => handleNav("/logout")}
              type="button"
            >
              Logout
            </button>
          )}{" "}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
