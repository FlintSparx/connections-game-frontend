import React, { useEffect, useState } from "react";
import PuzzleForm from "./PuzzleForm";

const API_URL = import.meta.env.VITE_API_URL;

// displays and manages all available game boards with delete functionality
function GameBoardsList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // fetch all games when component mounts
  useEffect(() => {
    fetchGames();
  }, []);
  
  // fetch all games from the API
  const fetchGames = () => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  };
  
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
  
  // submit the form to create a new game
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // reset form and fetch updated games
        setShowForm(false);
        fetchGames();
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
      <h2 className="text-xl font-semibold mb-4">Game Board Management</h2>
      
      {/* Create form toggle button */}
      <button
        className={`mb-4 px-4 py-2 rounded ${showForm ? 'bg-red-500' : 'bg-green-500'} text-white`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Create New Game Board"}
      </button>
      
      {/* Create Game Form */}
      {showForm && (
        <>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>Create New Game Board</h3>
          <PuzzleForm
            onSubmit={handleFormSubmit}
            submitButtonText="Create Game Board"
            loading={formLoading}
          />
        </>      )}
      
      {/* List of existing game boards */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Existing Game Boards</h3>
        
        {games.length === 0 ? (
          <p className="text-gray-500">No game boards available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Categories</th>
                  <th className="py-2 px-4 border">Words</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-sm font-mono">{game._id}</td>
                    <td className="py-2 px-4 border text-sm">{game.name}</td>
                    <td className="py-2 px-4 border">
                      <div className="text-sm">
                        {game.category1?.name}, {game.category2?.name}, 
                        {game.category3?.name}, {game.category4?.name}
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-sm">
                      {game.category1?.word.length + game.category2?.word.length + 
                       game.category3?.word.length + game.category4?.word.length} words total
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
        )}
      </div>
    </div>
  );
}

export default GameBoardsList;
