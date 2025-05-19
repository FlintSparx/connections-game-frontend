import { useState } from "react";
import PuzzleForm from "./GameComponents/PuzzleForm";

function CreateGame() {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    // We need to adapt the form data format as expected by the existing API
    const gameData = {
      gameName: formData.name,
      category1: {
        name: formData.category1.name,
        words: formData.category1.words,
      },
      category2: {
        name: formData.category2.name,
        words: formData.category2.words,
      },
      category3: {
        name: formData.category3.name,
        words: formData.category3.words,
      },
      category4: {
        name: formData.category4.name,
        words: formData.category4.words,
      },
    };

    try {
      const response = await fetch(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error("Failed to create game board");
      }

      alert("Game board created successfully!");

      // Reset form by forcing a re-render
      window.location.reload();
    } catch (err) {
      console.error("Error creating game:", err);
      alert("There was an error creating the game board. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Game</h1>
      <PuzzleForm
        onSubmit={handleFormSubmit}
        submitButtonText="Create Game"
        loading={loading}
      />
    </div>
  );
}

export default CreateGame;
