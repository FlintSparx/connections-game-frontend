import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../App";
import "../../App.css";

//navbar for navigation between main pages
function Navigation() {
  const { user, token } = useContext(UserContext);
  return (
    <nav className="navbar">
      <div className="navbar-logo">Connections</div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end
          >
            Play Game
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Browse Game Boards
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Create Game Board
          </NavLink>
        </li>        {token && user?.isAdmin && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Admin
            </NavLink>
          </li>
        )}
        {token && (
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Profile
            </NavLink>
          </li>
        )}
        <li>
          {!token && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          )}
          {token && (
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
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
