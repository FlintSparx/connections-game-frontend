import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../utils/fetchWithAuth";
import { UserContext } from "../../App";
import CreateGame from "../GameComponents/CreateGame";
import "../../styles/ListPageStyles.css";

const API_URL = import.meta.env.VITE_API_URL;

// Displays and manages all available game boards
function GameBoardsListAdmin() {
  const { token } = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGameOverlay, setShowCreateGameOverlay] = useState(false);
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

  // This function will be passed to CreateGame
  const handleCreateGameSuccess = () => {
    fetchGames(); // Refresh the list of games
    setShowCreateGameOverlay(false); // Close the overlay
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="list-page-container">
      {token && (
        <button
          className="btn btn-success mb-4"
          onClick={() => setShowCreateGameOverlay(true)}
        >
          Create New Game Board
        </button>
      )}
      {/* The CreateGame component is controlled by showCreateGameOverlay */}
      <CreateGame
        showOverlay={showCreateGameOverlay}
        onClose={handleCreateGameSuccess}
      />
      <div className="table-wrapper">
        <table className="list-table">
          <thead>
            <tr>
              <th className="id-column">ID</th>
              <th className="name-column">Name</th>
              <th className="categories-column">Categories</th>
              <th className="words-column">Words</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id}>
                <td className="id-column" data-label="ID">
                  {game._id}
                </td>
                <td className="name-column" data-label="Name">
                  <span style={{ fontWeight: "bold" }}>{game.name}</span>
                </td>
                <td className="categories-column" data-label="Categories">
                  <div className="categories-cell">
                    {game.category1?.name}, {game.category2?.name},{" "}
                    {game.category3?.name}, {game.category4?.name}
                  </div>
                </td>
                <td className="words-column" data-label="Words">
                  {(game.category1?.words.length || 0) +
                    (game.category2?.words.length || 0) +
                    (game.category3?.words.length || 0) +
                    (game.category4?.words.length || 0)}{" "}
                  words total
                </td>{" "}
                <td className="actions-column" data-label="Actions">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => navigate(`/play/${game._id}`)}
                    type="button"
                    style={{ marginRight: "10px" }}
                  >
                    Play
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(game._id)}
                    type="button"
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
