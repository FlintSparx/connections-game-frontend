import React, { useState, useEffect } from 'react';
// Use Vite environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL;
import WordTile from './WordTile';

// basic wireframe:
// +-------+-------+-------+-------+
// | Tile1 | Tile2 | Tile3 | Tile4 |
// +-------+-------+-------+-------+
// | Tile5 | Tile6 | Tile7 | Tile8 |
// +-------+-------+-------+-------+
// | Tile9 | Tile10| Tile11| Tile12|
// +-------+-------+-------+-------+
// | Tile13| Tile14| Tile15| Tile16|
// +-------+-------+-------+-------+

function GameBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);

  // Fetch a random game from our API
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/games`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.length > 0) {
          // Pick a random game and shuffle its words
          const { category1, category2, category3, category4 } = data[Math.floor(Math.random() * data.length)];
          const allWords = [...category1.word, ...category2.word, ...category3.word, ...category4.word];
          setWords(shuffleArray(allWords));
        } else {
          setError('No games available');
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Error loading game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return <div className="text-center p-4">Loading game...</div>;
  }
  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* game board container with grid layout */}
      <div className="grid grid-cols-4 gap-2">
        {/* mapping through words to create tiles */}
        {words.map((word, index) => (
          <WordTile key={index} word={word} />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
