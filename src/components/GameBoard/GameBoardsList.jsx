import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function GameBoardsList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  // fetch all games when component mounts
  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      });
  }, []);
  // remove game from database with confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game board?")) {
      try {
        const response = await fetch(`${API_URL}/games/${id}`, { method: "DELETE" });
        if (response.ok) {
          setGames(games.filter(game => game._id !== id));
        } else {
          alert("Failed to delete the game board.");
        }
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("An error occurred while trying to delete the game board.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>All Game Boards</h2>
      <ul>
        {games.map(game => (
          <li key={game._id} style={{ marginBottom: "1rem" }}>
            <strong>
              {game.category1?.name}, {game.category2?.name}, {game.category3?.name}, {game.category4?.name}
            </strong>
            <button
              style={{ marginLeft: "1rem", color: "red" }}
              onClick={() => handleDelete(game._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameBoardsList;
