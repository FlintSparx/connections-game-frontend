import React, { useState } from "react";
import GameBoardsList from "./GameComponents/GameBoardsList";

// Page for browsing all game boards, with admin switch
function BrowseBoards() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");

  //We will use the token and add protected admin routes
  // // Temp Admin mode toggle (password: 1234)
  // const handleAdminClick = () => {
  //   if (!isAdmin) {
  //     setShowPrompt(true);
  //   } else {
  //     setIsAdmin(false);
  //   }
  // };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (input === "1234") {
      setIsAdmin(true);
      setShowPrompt(false);
      setInput("");
    } else {
      alert("Incorrect password");
      setInput("");
    }
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2>Browse Game Boards</h2>
        {/* 
        We will use the token and add protected admin routes
        <button
          style={{
            background: isAdmin ? "#f56565" : "#4299e1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0.5em 1.2em",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem"
          }}
          onClick={handleAdminClick}
        >
          {isAdmin ? "Exit Admin" : "Admin"}
        </button> */}
      </div>
      {showPrompt && (
        <form onSubmit={handlePasswordSubmit} style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter admin password"
            style={{
              padding: "0.5em 1em",
              borderRadius: 6,
              border: "1px solid #ccc",
              marginRight: 8,
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              padding: "0.5em 1em",
              borderRadius: 6,
              border: "none",
              background: "#4299e1",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPrompt(false);
              setInput("");
            }}
            style={{
              marginLeft: 8,
              padding: "0.5em 1em",
              borderRadius: 6,
              border: "none",
              background: "#aaa",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </form>
      )}
      <GameBoardsList admin={isAdmin} />
    </div>
  );
}

export default BrowseBoards;
