import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import WordTile from "./WordTile";

// Game board component for displaying and interacting with a game
function GameBoard({ gameId }) {
  // State variables
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [words, setWords] = useState([]); // Store the words for the game
  const [selected, setSelected] = useState([]); // Track selected words
  const [foundCategories, setFoundCategories] = useState([]); // Track found categories
  const [gameWon, setGameWon] = useState(false); // Track if the game is won
  const [tries, setTries] = useState(0); // Track the number of tries
  const [gameLost, setGameLost] = useState(false); // Track if the game is lost
  const [animatingCats, setAnimatingCats] = useState([]); // Track categories being animated
  const [shakingIndices, setShakingIndices] = useState([]); // Track indices of shaking tiles
  const [keepPlaying, setKeepPlaying] = useState(false); // Track if the user wants to keep playing
  const [gameName, setGameName] = useState(""); // Store the name of the current game
  const [creatorUsername, setCreatorUsername] = useState(""); // Store the username of the game creator

  // Function to animate all tiles when a game is completed and won
  // Function to animate all tiles when game is completed
  const animateGameComplete = () => {
    const allTiles = document.querySelectorAll(".word-tile");

    allTiles.forEach((tile, index) => {
      // Add a staggered delay for a wave effect
      tile.style.setProperty("--delay", index);
      tile.classList.add("game-complete");
    });

    // Calculate total duration: animation + max delay
    const totalDuration = 900 + (allTiles.length - 1) * 100;

    // Clean up classes after animation completes
    setTimeout(() => {
      allTiles.forEach((tile) => {
        tile.classList.remove("game-complete");
        tile.style.removeProperty("--delay");
      });
    }, totalDuration);
  };

  // Function to animate all tiles when game is failed
  const animateGameFailed = () => {
    const allTiles = document.querySelectorAll(".word-tile");

    allTiles.forEach((tile, index) => {
      // Add a slight staggered delay
      tile.style.setProperty("--delay", index);
      tile.classList.add("game-failed");
    });

    // Calculate total duration: animation + max delay
    const totalDuration = 400 + (allTiles.length - 1) * 50;

    // Clean up classes after animation completes
    setTimeout(() => {
      allTiles.forEach((tile) => {
        tile.classList.remove("game-failed");
        tile.style.removeProperty("--delay");
      });
    }, totalDuration);
  };

  // Fetch a specific game if gameId is provided, otherwise fetch a random game
  const fetchGame = async () => {
    try {
      setLoading(true);
      let res, data;
      if (gameId) {        res = await fetch(`${API_URL}/games/${gameId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);        data = await res.json();
        if (!data) throw new Error("Game not found");
        const game = data;
        setGameName(game.name); // Set the game name
        // Set creator username if available
        if (game.createdBy && game.createdBy.username) {
          setCreatorUsername(game.createdBy.username);
        } else {
          setCreatorUsername("Unknown");
        }
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
        data = await res.json();        if (data.length > 0) {
          const game = data[Math.floor(Math.random() * data.length)];
          setGameName(game.name); // Set the game name for random game
          // Set creator username if available for random game
          if (game.createdBy && game.createdBy.username) {
            setCreatorUsername(game.createdBy.username);
          } else {
            setCreatorUsername("Unknown");
          }
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

  // Reset the number of tries
  const resetTries = () => {
    setTries(0);
  };

  // Start a new game
  const newGame = () => {
    gameId = null;
    fetchGame();
    setFoundCategories([]);
    setSelected([]);
    setGameWon(false);
    resetTries();
    setKeepPlaying(false);
    setGameLost(false);
  };

  // Shuffle array using Fisher-Yates algorithm, but keep found categories intact
  const shuffleUnfoundWords = (array, foundCats) => {
    // Extract words from found categories
    const foundWords = array.filter((item) =>
      foundCats.includes(item.catIndex)
    );
    // Extract words from unfound categories
    const unfoundWords = array.filter(
      (item) => !foundCats.includes(item.catIndex)
    );

    // Shuffle only the unfound words
    const shuffledUnfound = [...unfoundWords];
    for (let i = shuffledUnfound.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledUnfound[i], shuffledUnfound[j]] = [
        shuffledUnfound[j],
        shuffledUnfound[i],
      ];
    }

    // Arrange all words with found categories first
    return [...foundWords, ...shuffledUnfound];
  };

  // Organize words with found categories at the top in rows
  const organizeWords = (words, foundCats) => {
    // Sort words: found categories first (in order they were found), then unfound words
    const organizedWords = [];

    // Add found categories in the order they were found
    foundCats.forEach((catIndex) => {
      const categoryWords = words.filter((item) => item.catIndex === catIndex);
      organizedWords.push(...categoryWords);
    });

    // Add remaining unfound words
    const unfoundWords = words.filter(
      (item) => !foundCats.includes(item.catIndex)
    );
    organizedWords.push(...unfoundWords);

    return organizedWords;
  };

  // Fetch game when component mounts
  useEffect(() => {
    fetchGame();
  }, [gameId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Organize words with found categories at the top
  const organizedWords = organizeWords(words, foundCategories);  // Render 4x4 grid of word tiles
  return (
    <div>      {gameId && (
        // Only show title and instructions when displaying a specific game (not on home page)
        <>
          <h2 style={{ fontWeight: "bold" }}>{gameName}</h2>
          <p style={{ fontSize: "0.9rem", margin: "-0.5rem 0 1rem", color: "#666", fontStyle: "italic" }}>
            by {creatorUsername}
          </p>
          <p>Find groups of four related words</p>
        </>
      )}
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
              key={`${item.catIndex}-${item.word}-${idx}`} // Use stable key based on content
              word={item.word}
              selected={selected.includes(idx)}
              correct={foundCategories.includes(item.catIndex)}
              onClick={() => {
                // Prevent selecting tiles from categories that are already found
                if (foundCategories.includes(item.catIndex)) return;

                setSelected(
                  (prev) =>
                    prev.includes(idx)
                      ? prev.filter((i) => i !== idx) // Deselect if already selected
                      : prev.length < 4
                      ? [...prev, idx]
                      : prev // Select if less than 4 selected
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
              isJumping={animatingCats.includes(item.catIndex)}
              isShaking={shakingIndices.includes(idx)}
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
          <br />{" "}
          <button
            className="game-action-btn"
            style={{ margin: "0.5rem" }}
            onClick={() => setKeepPlaying(true)}
          >
            Yes
          </button>{" "}
          <button
            className="game-action-btn"
            style={{ margin: "0.5rem" }}
            onClick={() => {
              setKeepPlaying(false);
              newGame();
            }}
          >
            No
          </button>
        </div>
      )}

      {/* Game control buttons - Submit requires 4 selections, Shuffle and New Game always available */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {" "}
        <button
          className="game-action-btn"
          disabled={selected.length !== 4}
          style={{
            opacity: selected.length !== 4 ? 0.5 : 1,
            cursor: selected.length !== 4 ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            // Validate all selected tiles are from the same category
            if (selected.length === 4) {
              if (tries < 4 || keepPlaying) {
                const firstCat = organizedWords[selected[0]].catIndex;
                const isCorrectGroup = selected.every(
                  (idx) => organizedWords[idx].catIndex === firstCat
                );

                if (isCorrectGroup) {
                  // Correct answer - add category to found categories
                  const newFoundCategories = [...foundCategories, firstCat];

                  // Animate the found category
                  setAnimatingCats((prev) => [...prev, firstCat]);
                  setTimeout(() => {
                    setFoundCategories(newFoundCategories);
                    setAnimatingCats((prev) =>
                      prev.filter((cat) => cat !== firstCat)
                    );
                    // Reorganize words with found categories first
                    setWords(organizeWords(words, newFoundCategories));
                    // Check if all four categories have been found (game win condition)
                    if (newFoundCategories.length === 4) {
                      setGameWon(true);
                      updateGameStats(true);
                      // Animate all tiles jumping up for game completion
                      setTimeout(() => {
                        animateGameComplete();
                      }, 400); // Small delay to let the last category animation finish
                    }
                  }, 600); // Animation duration
                } else {
                  // Wrong answer - increment tries
                  const newTriesCount = tries + 1;
                  setTries(newTriesCount);

                  // Trigger shake animation for selected tiles
                  setShakingIndices(selected);
                  setTimeout(() => setShakingIndices([]), 500);

                  // Check for game loss condition (4 wrong tries)
                  if (newTriesCount >= 4 && !keepPlaying) {
                    setGameLost(true);
                    updateGameStats(false);
                    // Animate all tiles shaking for game failure
                    setTimeout(() => {
                      animateGameFailed();
                    }, 600); // Small delay to let the wrong selection shake finish
                  }
                }
              }
              setSelected([]); // Reset selection after submit attempt
              return;
            }
          }}
        >
          Submit
        </button>{" "}
        <button
          className="game-action-btn"
          onClick={() => {
            setWords(shuffleUnfoundWords(words, foundCategories));
            setSelected([]);
          }}
        >
          Shuffle
        </button>{" "}
        <button
          className="game-action-btn"
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
