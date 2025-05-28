import React, { useState } from "react";
import GameBoardsListAdmin from "../components/Admin/GameBoardsListAdmin";
import UsersAdmin from "../components/Admin/UsersAdmin";
import "../styles/App.css";

// Page for browsing all game boards, with admin switch
function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState("games"); // Track the active admin page
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header-container">
        <h2>Admin Dashboard</h2>
        
        <div className="admin-tabs">
          <button 
            className={selectedPage === "games" ? "admin-tab active" : "admin-tab"}
            onClick={() => setSelectedPage("games")}
          >
            Games
          </button>
          <button 
            className={selectedPage === "users" ? "admin-tab active" : "admin-tab"}
            onClick={() => setSelectedPage("users")}
          >
            Users
          </button>
        </div>
      </div>

      {/* Render the selected admin page */}
      <div className="admin-content">
        {selectedPage === "games" && <GameBoardsListAdmin />}
        {selectedPage === "users" && <UsersAdmin />}
      </div>
    </div>
  );
}

export default AdminDashboard;
