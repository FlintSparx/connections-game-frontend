import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import WordTile from "./WordTile";

// words are organized in a 4x4 grid, with found categories moving to the top
function GameBoard({ gameId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  // track found categories by their index (0-3)
  const [foundCategories, setFoundCategories] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [tries, setTries] = useState(0);
  const [gameLost, setGameLost] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Fetch a specific game if gameId is provided, otherwise random
  const fetchGame = async () => {
    try {
      setLoading(true);
      let res, data;
      if (gameId) {
        res = await fetch(`${API_URL}/games/${gameId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        if (!data) throw new Error("Game not found");
        const game = data;
        const all = [
          ...game.category1.words.map((w) => ({
            word: w,
            catIndex: 0,
            categoryName: game.category1.name,
          })),
          ...game.category2.words.map((w) => ({
            word: w,
            catIndex: 1,
            categoryName: game.category2.name,
          })),
          ...game.category3.words.map((w) => ({
            word: w,
            catIndex: 2,
            categoryName: game.category3.name,
          })),
          ...game.category4.words.map((w) => ({
            word: w,
            catIndex: 3,
            categoryName: game.category4.name,
          })),
        ];
        setWords(shuffleUnfoundWords(all, []));
      } else {
        res = await fetch(`${API_URL}/games`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        if (data.length > 0) {
          const game = data[Math.floor(Math.random() * data.length)];
          const all = [
            ...game.category1.words.map((w) => ({
              word: w,
              catIndex: 0,
              categoryName: game.category1.name,
            })),
            ...game.category2.words.map((w) => ({
              word: w,
              catIndex: 1,
              categoryName: game.category2.name,
            })),
            ...game.category3.words.map((w) => ({
              word: w,
              catIndex: 2,
              categoryName: game.category3.name,
            })),
            ...game.category4.words.map((w) => ({
              word: w,
              catIndex: 3,
              categoryName: game.category4.name,
            })),
          ];
          setWords(shuffleUnfoundWords(all, []));
        } else {
          setError("No games available");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error loading game");
    } finally {
      setLoading(false);
    }
  };

  // Update game stats when the game is won or lost
  const updateGameStats = async (won) => {
    if (!gameId) return; // Only update for specific games
    try {
      await fetch(`${API_URL}/games/${gameId}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ won }),
      });
    } catch (err) {
      console.error("Failed to update game stats", err);
    }
  };

  const resetTries = () => {
    setTries(0);
  };

  const newGame = () => {
    fetchGame();
    setFoundCategories([]);
    setSelected([]);
    setGameWon(false);
    resetTries();
    setKeepPlaying(false);
    setGameLost(false);
  };

  // shuffle array using fisher-yates algorithm, but keep found categories intact
  const shuffleUnfoundWords = (array, foundCats) => {
    // extract words from found categories
    const foundWords = array.filter((item) =>
      foundCats.includes(item.catIndex)
    );
    // extract words from unfound categories
    const unfoundWords = array.filter(
      (item) => !foundCats.includes(item.catIndex)
    );

    // shuffle only the unfound words
    const shuffledUnfound = [...unfoundWords];
    for (let i = shuffledUnfound.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledUnfound[i], shuffledUnfound[j]] = [
        shuffledUnfound[j],
        shuffledUnfound[i],
      ];
    }

    // arrange all words with found categories first
    return [...foundWords, ...shuffledUnfound];
  };

  // organize words with found categories at the top in rows
  const organizeWords = (words, foundCats) => {
    // sort words: found categories first (in order they were found), then unfound words
    const organizedWords = [];

    // add found categories in the order they were found
    foundCats.forEach((catIndex) => {
      const categoryWords = words.filter((item) => item.catIndex === catIndex);
      organizedWords.push(...categoryWords);
    });

    // add remaining unfound words
    const unfoundWords = words.filter(
      (item) => !foundCats.includes(item.catIndex)
    );
    organizedWords.push(...unfoundWords);

    return organizedWords;
  };

  // fetch game when component mounts
  useEffect(() => {
    fetchGame();
  }, [gameId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // organize words with found categories at the top
  const organizedWords = organizeWords(words, foundCategories);

  // render 4x4 grid of word tiles
  return (
    <div>
      <h2>Connections Game</h2>
      <p>Create four groups of four!</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "400px",
          margin: "0 auto 1.5rem auto",
        }}
      >
        {organizedWords.map((item, idx) => {
          return (
            <WordTile
              key={`${item.catIndex}-${item.word}-${idx}`} // use stable key based on content
              word={item.word}
              selected={selected.includes(idx)}
              correct={foundCategories.includes(item.catIndex)}
              onClick={() => {
                // prevent selecting tiles from categories that are already found
                if (foundCategories.includes(item.catIndex)) return;

                setSelected(
                  (prev) =>
                    prev.includes(idx)
                      ? prev.filter((i) => i !== idx) // deselect if already selected
                      : prev.length < 4
                      ? [...prev, idx]
                      : prev // select if less than 4 selected
                );
              }}
              catIndex={item.catIndex}
              foundGroupCatIndex={
                foundCategories.includes(item.catIndex)
                  ? item.catIndex
                  : undefined
              }
              categoryName={
                foundCategories.includes(item.catIndex)
                  ? item.categoryName
                  : undefined
              }
            />
          );
        })}
      </div>

      {gameWon && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#d1fae5",
            borderRadius: "0.375rem",
            fontWeight: "bold",
          }}
        >
          🎉 Congratulations! You've found all categories! 🎉
        </div>
      )}
      {tries > 0 && !gameWon && !gameLost && (
        <div>
          <p style={{ fontWeight: "bold" }}>Wrong answers Left: {4 - tries}</p>
        </div>
      )}
      {keepPlaying && (
        <div>
          <p style={{ fontWeight: "bold" }}>Keep Playing!</p>
        </div>
      )}
      {gameLost && !keepPlaying && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee2e2",
            borderRadius: "0.375rem",
            fontWeight: "bold",
          }}
        >
          😢 Game Over, you lose! 😢
          <br />
          Would you like to keep playing?
          <br />
          <button onClick={() => setKeepPlaying(true)}>Yes</button>{" "}
          <button
            onClick={() => {
              setKeepPlaying(false);
              newGame();
            }}
          >
            No
          </button>
        </div>
      )}

      {/* game control buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          disabled={selected.length !== 4}
          onClick={() => {
            // validate all selected tiles are from the same category
            if (selected.length === 4) {
              if (tries < 4 || keepPlaying) {
                const firstCat = organizedWords[selected[0]].catIndex;

                const allSameCategory = selected.every(
                  (idx) => organizedWords[idx].catIndex === firstCat
                );

                if (allSameCategory) {
                  // add category to found categories
                  const newFoundCategories = [...foundCategories, firstCat];
                  setFoundCategories(newFoundCategories);

                  // reorganize words with found categories first
                  setWords(organizeWords(words, newFoundCategories));

                  // check if all four categories have been found
                  if (newFoundCategories.length === 4) {
                    setGameWon(true);
                    updateGameStats(true);
                  }
                } else {
                  setTries(tries + 1);
                  if (tries + 1 >= 4 && !keepPlaying) {
                    setGameLost(true);
                    updateGameStats(false);
                  }
                }
              }
              setSelected([]); // reset selection after submit attempt
            }
          }}
        >
          Submit
        </button>
        <button
          onClick={() => {
            setWords(shuffleUnfoundWords(words, foundCategories));
            setSelected([]);
          }}
        >
          Shuffle
        </button>
        <button
          onClick={() => {
            newGame();
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
