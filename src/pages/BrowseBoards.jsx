import React, { useState } from "react";
import GameBoardsList from "../components/GameComponents/GameBoardsList";
import "../styles/ListPageStyles.css";
import { UserContext } from "../App";

// Page for browsing all game boards, with admin switch
function BrowseBoards({ setShowCreateGameOverlay }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password submitted:", input);
    setShowPrompt(false);
    setInput("");
  };

  return (
    <div className="list-page-container">
      <div className="list-page-header">
        <h2 className="list-page-title">Browse Game Boards</h2>
      </div>
      {showPrompt && (
        <form onSubmit={handlePasswordSubmit} className="mb-4 flex gap-3 align-center">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter admin password"
            className="form-control"
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowPrompt(false);
              setInput("");
            }}
          >
            Cancel
          </button>
        </form>
      )}
      <GameBoardsList setShowCreateGameOverlay={setShowCreateGameOverlay} />
    </div>
  );
}

export default BrowseBoards;
