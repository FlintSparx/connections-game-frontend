import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
import WordTile from './WordTile';

/**
 * GameBoard - the main Connections game board
 * Handles fetching a random game, shuffling, selection, and group logic
 *
 * This is a 4x4 grid of WordTiles. When you select 4, hit Submit to check if they're a group!
 */
function GameBoard() {
  // Loading and error state for fetching game data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Array of word objects: { word, catIndex }
  const [words, setWords] = useState([]);
  // Indices of currently selected tiles
  const [selected, setSelected] = useState([]);
  // Array of arrays, each containing indices of a found group
  const [foundGroups, setFoundGroups] = useState([]);

  // Fetch a random game from the backend and prepare the board
  const fetchGame = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/games`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.length > 0) {
        // Pick a random game and flatten all category words into a single array
        const game = data[Math.floor(Math.random() * data.length)];
        const all = [
          ...game.category1.word.map(w => ({ word: w, catIndex: 0 })),
          ...game.category2.word.map(w => ({ word: w, catIndex: 1 })),
          ...game.category3.word.map(w => ({ word: w, catIndex: 2 })),
          ...game.category4.word.map(w => ({ word: w, catIndex: 3 })),
        ];
        setWords(shuffleArray(all));
      } else {
        setError('No games available');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading game');
    } finally {
      setLoading(false);
    }
  };

  // Shuffle an array using Fisher-Yates
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Fetch game on mount
  useEffect(() => { fetchGame(); }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Render the 4x4 board as a grid of WordTiles
  return (
    <div>
      <h2>Connections Game</h2>
      <p>Create four groups of four!</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '400px',
        margin: '0 auto 1.5rem auto',
      }}>
        {words.map((item, idx) => {
          // Find the category index of a found group this tile belongs to, if any
          let foundGroupCatIndex = undefined;
          foundGroups.forEach(group => {
            if (group.includes(idx)) foundGroupCatIndex = item.catIndex;
          });
          return (
            <WordTile
              key={idx}
              word={item.word}
              selected={selected.includes(idx)}
              correct={foundGroups.some(group => group.includes(idx))}
              onClick={() => {
                // Don't let users select a tile that's already in a found group
                if (foundGroups.flat().includes(idx)) return;
                setSelected(prev =>
                  prev.includes(idx)
                    ? prev.filter(i => i !== idx) // Deselect if already selected
                    : prev.length < 4 ? [...prev, idx] : prev // Select if less than 4 selected
                );
              }}
              catIndex={item.catIndex}
              foundGroupCatIndex={foundGroupCatIndex}
            />
          );
        })}
      </div>
      {/* Button row for game actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          disabled={selected.length !== 4}
          onClick={() => {
            // Only allow submit if exactly 4 selected
            if (selected.length === 4) {
              // Check if all selected tiles belong to the same category
              const cats = selected.map(i => words[i].catIndex);
              if (cats.every(c => c === cats[0])) setFoundGroups([...foundGroups, selected]);
            }
            setSelected([]); // Always clear selection after submit
          }}
        >
          Submit
        </button>
        <button onClick={() => { setWords(shuffleArray(words)); setSelected([]); }}>Shuffle</button>
        <button onClick={() => { fetchGame(); setFoundGroups([]); setSelected([]); }}>New Game</button>
      </div>
    </div>
  );
}

export default GameBoard;
