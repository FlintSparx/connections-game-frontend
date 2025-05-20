import { NavLink } from "react-router-dom";
import "../App.css";

//navbar for navigation between main pages
function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Connections</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
            Play Game
          </NavLink>
        </li>
        <li>
          <NavLink to="/browse" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Browse Game Boards
          </NavLink>
        </li>
        <li>
          <NavLink to="/create" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Create Game Board
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
