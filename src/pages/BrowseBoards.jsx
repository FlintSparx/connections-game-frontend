import React, { useState } from "react";
import GameBoardsList from "../components/GameComponents/GameBoardsList";

// Page for browsing all game boards, with admin switch
function BrowseBoards() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");

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
      <GameBoardsList />
    </div>
  );
}

export default BrowseBoards;
