import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../utils/fetchWithAuth";
import { UserContext } from "../../App";

const API_URL = import.meta.env.VITE_API_URL;

// Component for displaying and managing all available game boards
function GameBoardsList({ admin }) {
  const { token } = useContext(UserContext); // Access the user token from context
  const [games, setGames] = useState([]); // Store the list of game boards
  const [filteredGames, setFilteredGames] = useState([]); // Store filtered games
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // Filter by difficulty
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Navigation helper
  
  // Fetch all games when the component mounts
  useEffect(() => {
    fetchGames();
  }, []);

  // Filter games when difficulty filter changes
  useEffect(() => {
    if (games.length > 0) {
      filterGamesByDifficulty(games, difficultyFilter);
    }
  }, [difficultyFilter, games]);
  
  // Fetch all games from the API
  const fetchGames = () => {
    fetch(`${API_URL}/games`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        filterGamesByDifficulty(data, difficultyFilter);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  };

  // Filter games by difficulty
  const filterGamesByDifficulty = (gamesData, difficulty) => {
    if (difficulty === "all") {
      setFilteredGames(gamesData);
    } else {
      setFilteredGames(gamesData.filter(game => game.difficulty === difficulty));
    }
  };

  // Remove a game from the database with confirmation
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

  if (loading) return <div>Loading...</div>; // Show loading indicator while fetching data
  
  return (
    <div className="list-page-container">
      {/* Create button navigates to create page */}
      {token && (
        <button
          className="btn btn-success mb-4"
          onClick={() => navigate("/create")}
        >
          Create New Game Board
        </button>
      )}

      {/* Difficulty Filter */}
      <div className="filter-container mb-4">
        <div className="filter-group flex align-center">
          <label htmlFor="difficultyFilter" className="filter-label">Filter by Difficulty:</label>
          <select 
            id="difficultyFilter"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="form-control"
            style={{ width: "200px", marginLeft: "10px" }}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* List of existing game boards */}
      <div className="table-wrapper">
        <table className="list-table">
          <thead>
            {" "}
            <tr>
              <th>Name</th>
              <th>Creator</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>{" "}
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game._id}>
                <td data-label="Name">{game.name}</td>
                <td data-label="Creator">
                  {game.createdBy
                    ? `Created by ${game.createdBy.username}`
                    : "Unknown creator"}
                </td>                <td data-label="Difficulty">
                  <span className={`difficulty-badge difficulty-${game.difficulty}`}>
                    {game.difficulty ? game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1) : "Unknown"}
                  </span>
                </td>
                <td data-label="Actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/play/${game._id}`)}
                  >
                    Play
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

export default GameBoardsList;
