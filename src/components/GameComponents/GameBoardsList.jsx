import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../utils/fetchWithAuth";
import { UserContext } from "../../App";
const API_URL = import.meta.env.VITE_API_URL;

// Component for displaying and managing all available game boards
function GameBoardsList({ admin, setShowCreateGameOverlay }) {
  const { token, user } = useContext(UserContext); // Access the user token and user from context
  const [games, setGames] = useState([]); // Store the list of game boards
  const [filteredGames, setFilteredGames] = useState([]); // Store filtered games
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // Filter by difficulty
  const [showNSFW, setShowNSFW] = useState(false); // Filter for NSFW content
  const [loading, setLoading] = useState(true); // Track loading state
  const [userAge, setUserAge] = useState(null); // Store user's age
  const [isAdult, setIsAdult] = useState(false); // Track if user is 18+ (default false)
  const [solvedGames, setSolvedGames] = useState([]); // Store user's solved games
  const navigate = useNavigate(); // Navigation helper

  // Calculate age from user's date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Decode JWT token to get the user's date of birth
  const getUserAgeFromToken = () => {
    if (!token) {
      setIsAdult(false); // Must be logged in and 18+ to see NSFW content
      return;
    }

    try {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.dateOfBirth) {
        const age = calculateAge(payload.dateOfBirth);
        setUserAge(age);
        const adult = age >= 18;
        setIsAdult(adult); // Fixed: was setIsAdult(true)

        // If the user is under 18, hide NSFW content
        if (!adult) {
          setShowNSFW(false);
        }
      } else {
        setIsAdult(false); // Fixed: was fasle
      }
    } catch (error) {
      console.error("Error decoding token", error);
      setIsAdult(false); // Default to false if the token cannot be decoded
    }
  };
  // Fetch all games when the component mounts
  useEffect(() => {
    getUserAgeFromToken();

    if (user && token) {
      fetchGames();
      fetchSolvedGames();
    } else {
      fetchGames();
    }
  }, [token, user]);

  // Refresh function to refetch all data
  const refreshData = () => {
    setLoading(true);
    fetchGames();
    if (user && token) {
      fetchSolvedGames();
    }
  }; // Fetch user's solved games
  const fetchSolvedGames = async () => {
    if (!user || !token || !user.userID) {
      console.log("Missing user data or token, cannot fetch solved games");
      return;
    }

    try {
      console.log(`Fetching solved games for user ID: ${user.userID}`);
      const response = await fetch(`${API_URL}/games/solved/${user.userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure we have a valid array even if the response is malformed
        const validSolvedGames = Array.isArray(data.solvedGames)
          ? data.solvedGames
          : [];
        console.log(`Received ${validSolvedGames.length} solved games`);
        setSolvedGames(validSolvedGames);
      } else {
        // Handle non-200 responses
        console.error(
          `Failed to fetch solved games: ${response.status} ${response.statusText}`,
        );
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        setSolvedGames([]);
      }
    } catch (error) {
      console.error("Error fetching solved games:", error);
      setSolvedGames([]);
    }
  };

  // Filter games when filters change
  useEffect(() => {
    if (games.length > 0) {
      filterGames(games, difficultyFilter, showNSFW);
    }
  }, [difficultyFilter, showNSFW, games, isAdult]); // Added isAdult dependency

  // Fetch all games from the API
  const fetchGames = () => {
    fetch(`${API_URL}/games`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        filterGames(data, difficultyFilter, showNSFW);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  };

  // Filter games by difficulty and NSFW content
  const filterGames = (gamesData, difficulty, includeNSFW) => {
    let filtered = gamesData;

    // Filter by difficulty
    if (difficulty !== "all") {
      filtered = filtered.filter((game) => game.difficulty === difficulty);
    }

    // Filter by NSFW content
    // If user is not adult (under 18 or not logged in), ALWAYS filter out NSFW
    const shouldShowNSFW = isAdult && includeNSFW;
    if (!shouldShowNSFW) {
      filtered = filtered.filter((game) => !game.tags?.includes("NSFW"));
    }

    setFilteredGames(filtered);
  };

  // Handle NSFW checkbox change (only if user is adult)
  const handleNSFWChange = (e) => {
    if (isAdult) {
      setShowNSFW(e.target.checked);
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
          onClick={() => setShowCreateGameOverlay(true)} // Modified: Call setShowCreateGameOverlay
        >
          Create New Game Board
        </button>
      )}

      {/* Age-based message for minors */}
      {!isAdult && userAge !== null && (
        <div
          className="mb-4 p-3"
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            borderRadius: "4px",
            border: "1px solid #fbbf24",
          }}
        >
          <strong>Content Filter Active:</strong> NSFW content is automatically
          hidden for users under 18.
        </div>
      )}

      {/* Message for non-logged-in users */}
      {!token && (
        <div
          className="mb-4 p-3"
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0277bd",
            borderRadius: "4px",
            border: "1px solid #4fc3f7",
          }}
        >
          <strong>Guest Mode:</strong> NSFW content is hidden. Please log in and
          verify your age to access all content.
        </div>
      )}

      {/* Filters */}
      <div className="filter-container mb-4">
        {/* Difficulty Filter */}
        <div className="filter-group flex align-center">
          <label htmlFor="difficultyFilter" className="filter-label">
            Filter by Difficulty:
          </label>
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

        {/* NSFW Filter - Only show for adults */}
        {isAdult && (
          <div
            className="filter-group flex align-center"
            style={{ marginTop: "10px" }}
          >
            <label htmlFor="nsfwFilter" className="filter-label">
              <input
                type="checkbox"
                id="nsfwFilter"
                checked={showNSFW}
                onChange={handleNSFWChange}
                style={{ marginRight: "8px" }}
              />
              Show NSFW Content
            </label>
          </div>
        )}
      </div>      {/* List of existing game boards */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="name-column">Name</th>
              <th className="creator-column">Creator</th>
              <th className="tags-column">Tags</th>
              <th className="difficulty-column">Difficulty</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => {
              // Safe check for solved game - ensure all data is valid
              const isGameSolved =
                game &&
                game._id &&
                Array.isArray(solvedGames) &&
                solvedGames.includes(game._id);
              return (
                <tr
                  key={game._id}
                  className={isGameSolved ? "solved-game" : ""}
                >
                  <td className="name-column" data-label="Name">
                    <span style={{ fontWeight: "bold" }}>{game.name}</span>
                  </td>
                  <td className="creator-column" data-label="Creator">
                    {game.createdBy
                      ? `Created by ${game.createdBy.username}`
                      : "Unknown creator"}
                  </td>
                  <td className="tags-column" data-label="Tags">
                    {game.tags && game.tags.length > 0 ? (
                      <div className="tags-container">
                        {game.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`tag-badge ${
                              tag === "NSFW" ? "tag-nsfw" : "tag-general"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td className="difficulty-column" data-label="Difficulty">
                    <span
                      className={`difficulty-badge difficulty-${game.difficulty}`}
                    >
                      {game.difficulty
                        ? game.difficulty.charAt(0).toUpperCase() +
                          game.difficulty.slice(1)
                        : "Unknown"}
                    </span>
                  </td>
                  <td className="actions-column" data-label="Actions">
                    <button
                      className={`btn ${
                        isGameSolved ? "btn-success" : "btn-primary"
                      }`}
                      onClick={() => navigate(`/play/${game._id}`)}
                    >
                      {isGameSolved ? "Play Again" : "Play"}
                    </button>{" "}
                    {isGameSolved && (
                      <span
                        style={{
                          marginLeft: "5px",
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        ✓✓✓ Solved
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameBoardsList;
