import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function GameBoardsList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all games
  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      });
  }, []);

  // Delete a game
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/games/${id}`, { method: "DELETE" });
    setGames(games.filter(game => game._id !== id));
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
