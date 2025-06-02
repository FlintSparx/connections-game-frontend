import { useState } from "react";
import PuzzleForm from "./PuzzleForm";
import fetchWithAuth from "../../utils/fetchWithAuth";
import "../../styles/ListPageStyles.css"; 
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CreateGame({ showOverlay, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    try {
      const response = await fetchWithAuth(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create game board");
      }

      alert("Game board created successfully!");
      onClose(); // Close the overlay on success
   
    } catch (err) {
      console.error("Error creating game:", err);
      alert("Error creating game: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showOverlay) {
    return null;
  }

  return (
    <div
      className="edit-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3 className="edit-modal-title">Create New Game Board</h3>
          <button
            className="edit-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="edit-modal-body">
          <PuzzleForm
            onSubmit={handleFormSubmit}
            submitButtonText="Create Game Board"
            loading={loading}
          />
        </div>
        
      </div>
    </div>
  );
}

export default CreateGame;