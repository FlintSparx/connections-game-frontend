import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
import WordTile from './WordTile';

function GameBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundGroups, setFoundGroups] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const fetchGame = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/games`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.length > 0) {
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
  // shuffle array using fisher-yates algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // fetch game when component mounts
  useEffect(() => { fetchGame(); }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  // render 4x4 grid of word tiles
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
      }}>        {words.map((item, idx) => {
          // find category index if tile belongs to a found group
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
              onClick={() => {                // prevent selecting tiles already in a found group
                if (foundGroups.flat().includes(idx)) return;
                setSelected(prev =>
                  prev.includes(idx)
                    ? prev.filter(i => i !== idx) // deselect if already selected
                    : prev.length < 4 ? [...prev, idx] : prev // select if less than 4 selected
                );
              }}
              catIndex={item.catIndex}
              foundGroupCatIndex={foundGroupCatIndex}
            />
          );
        })}
      </div>      
      {gameWon && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          backgroundColor: '#d1fae5', 
          borderRadius: '0.375rem',
          fontWeight: 'bold' 
        }}>
          🎉 Congratulations! You've found all categories! 🎉
        </div>
      )}
      {/* game control buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>        
        <button
          disabled={selected.length !== 4}
          onClick={() => {
            // validate selection of exactly 4 tiles            
            if (selected.length === 4) {
              // check if all tiles belong to same category
              const cats = selected.map(i => words[i].catIndex);
              if (cats.every(c => c === cats[0])) {
                const newFoundGroups = [...foundGroups, selected];
                setFoundGroups(newFoundGroups);
                // check if all four categories have been found
                if (newFoundGroups.length === 4) {
                  setGameWon(true);
                }
              }
            }
            setSelected([]); // reset selection after submit attempt
          }}
        >
          Submit
        </button>
        <button onClick={() => { 
          setWords(shuffleArray(words)); 
          setSelected([]); 
          setGameWon(false); 
        }}>Shuffle</button>
        <button onClick={() => { 
          fetchGame(); 
          setFoundGroups([]); 
          setSelected([]);
          setGameWon(false); 
        }}>New Game</button>
      </div>
    </div>
  );
}

export default GameBoard;
