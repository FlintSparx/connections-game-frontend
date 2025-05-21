import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PuzzleForm from "../GameComponents/PuzzleForm";
import fetchWithAuth from "../../utils/fetchWithAuth";
import { UserContext } from "../../App";

const API_URL = import.meta.env.VITE_API_URL;

// Displays and manages all available game boards
function GameBoardsListAdmin() {
  const { token } = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Fetch all games when component mounts
  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch all games from the API
  const fetchGames = () => {
    fetch(`${API_URL}/games`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  };

  // Remove game from database with confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game board?")) {
      try {
        const response = await fetch(`${API_URL}/games/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setGames(games.filter((game) => game._id !== id));
        } else {
          alert("Failed to delete the game board.");
        }
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("An error occurred while trying to delete the game board.");
      }
    }
  };

  // Submit the form to create a new game
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false); // Hide form after success
        fetchGames(); // Refresh list
        alert("Game board created successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create game board");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("An error occurred while trying to create the game board");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Show create form */}
      {token && (
        <button
          className="mb-4 px-4 py-2 rounded bg-green-500 text-white"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create New Game Board"}
        </button>
      )}
      {showForm && (
        <>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Create New Game Board
          </h3>
          <PuzzleForm
            onSubmit={handleFormSubmit}
            submitButtonText="Create Game Board"
            loading={formLoading}
          />
        </>
      )}
      {/* List of existing game boards */}
      <div style={{ overflowX: "auto" }}>
        <table className="game-boards-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Categories</th>
              <th>Words</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id}>
                <td>{game._id}</td>
                <td>{game.name}</td>
                <td>
                  <div>
                    {game.category1?.name}, {game.category2?.name},{" "}
                    {game.category3?.name}, {game.category4?.name}
                  </div>
                </td>
                <td>
                  {(game.category1?.words.length || 0) +
                    (game.category2?.words.length || 0) +
                    (game.category3?.words.length || 0) +
                    (game.category4?.words.length || 0)}{" "}
                  words total
                </td>
                <td>
                  <button
                    style={{
                      background: "#4299e1",
                      color: "#fff",
                      padding: "0.5em 1em",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      marginRight: 8,
                    }}
                    onClick={() => navigate(`/play/${game._id}`)}
                  >
                    Play
                  </button>
                  <button
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      padding: "0.5em 1em",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      marginLeft: 8,
                    }}
                    onClick={() => handleDelete(game._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameBoardsListAdmin;
