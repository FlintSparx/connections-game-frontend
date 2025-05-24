import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../App";
import "../../styles/App.css";

//navbar for navigation between main pages
function Navigation() {
  const { user, token } = useContext(UserContext);
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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end
            onClick={() => setMenuOpen(false)}
          >
            Play Game
          </NavLink>
        </li>
        <li className="nav-item-main">
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            Browse Game Boards
          </NavLink>
        </li>
        <li className="nav-item-main">
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            Create Game Board
          </NavLink>
        </li>        {token && user?.isAdmin && (
          <li className="nav-item-main">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </NavLink>
          </li>
        )}
        
        {token && (
          <li className="nav-item-main">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </NavLink>
          </li>
        )}
        
        <li className="nav-item-main">
          {!token ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          ) : (
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Logout
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
