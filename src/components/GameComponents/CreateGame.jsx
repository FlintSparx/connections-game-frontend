import { useState } from "react";
import PuzzleForm from "./PuzzleForm";
import fetchWithAuth from "../../utils/fetchWithAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CreateGame() {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);    try {
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
      window.location.href = "/browse";
    } catch (err) {
      console.error("Error creating game:", err);
      // Show the specific error message from the server if available
      if (err.message && err.message.includes("inappropriate language")) {
        alert("Your game board contains inappropriate language and cannot be saved. Please remove any offensive words.");
      } else {
        alert("There was an error creating the game board. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Game</h1>
      <PuzzleForm
        onSubmit={handleFormSubmit}
        submitButtonText="Create Game Board"
        loading={loading}
      />
    </div>
  );
}

export default CreateGame;
