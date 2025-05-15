import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// displays and manages all available game boards with delete functionality
function GameBoardsList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  
  // initial form state
  const initialFormState = {
    name: "", // Added name field
    category1: { name: "", word: ["", "", "", ""] },
    category2: { name: "", word: ["", "", "", ""] },
    category3: { name: "", word: ["", "", "", ""] },
    category4: { name: "", word: ["", "", "", ""] },
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
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
  
  // handle form field changes
  const handleCategoryChange = (catIndex, field, value, wordIndex = null) => {
    const categoryKey = `category${catIndex + 1}`;
    
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (field === 'name') {
        newData[categoryKey].name = value;
      } else if (field === 'word') {
        const words = [...newData[categoryKey].word];
        words[wordIndex] = value;
        newData[categoryKey].word = words;
      }
      
      return newData;
    });
  };
  
  // submit the form to create a new game
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // validate form data
    if (!formData.name.trim()) {
      setFormError("Game board name is required");
      return;
    }

    for (let i = 1; i <= 4; i++) {
      const cat = formData[`category${i}`];
      if (!cat.name.trim()) {
        setFormError(`Category ${i} name is required`);
        return;
      }
      
      for (let j = 0; j < 4; j++) {
        if (!cat.word[j].trim()) {
          setFormError(`All words are required for Category ${i}`);
          return;
        }
      }
    }
    
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
        setFormData(initialFormState);
        setShowForm(false);
        fetchGames();
      } else {
        const error = await response.json();
        setFormError(error.message || "Failed to create game board");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      setFormError("An error occurred while trying to create the game board");
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
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded max-w-2xl mx-auto">
          <h3 className="text-lg font-medium mb-4">Create New Game Board</h3>

          {/* Input for game board name */}
          <div className="mb-4">
            <label htmlFor="gameName" className="block text-sm font-medium mb-1">Game Board Name</label>
            <input
              type="text"
              id="gameName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          {formError && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {formError}
            </div>
          )}
          
          {[0, 1, 2, 3].map(catIndex => (
            <div key={catIndex} className="mb-6 p-3 border rounded bg-gray-50">
              <h4 className="font-medium mb-2">Category {catIndex + 1}</h4>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">
                  Category Name:
                  <input
                    type="text"
                    value={formData[`category${catIndex + 1}`].name}
                    onChange={(e) => handleCategoryChange(catIndex, 'name', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map(wordIndex => (
                  <input
                    key={wordIndex}
                    type="text"
                    value={formData[`category${catIndex + 1}`].word[wordIndex]}
                    onChange={(e) => handleCategoryChange(catIndex, 'word', e.target.value, wordIndex)}
                    className="p-2 border rounded"
                    placeholder={`Word ${wordIndex + 1}`}
                    required
                  />
                ))}
              </div>
            </div>
          ))}
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Game Board
          </button>
        </form>
      )}
      
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
                  <th className="py-2 px-4 border">Categories</th>
                  <th className="py-2 px-4 border">Words</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-sm font-mono">{game._id}</td>
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
