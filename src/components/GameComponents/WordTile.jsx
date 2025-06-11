import React from "react";

// Color scheme for the four different categories with semantic names
const CATEGORY_COLORS = [
  "#fde68a", // yellow - category 0
  "#a7f3d0", // green - category 1
  "#fca5a5", // red - category 2
  "#93c5fd", // blue - category 3
];

// Single tile component that displays a word and changes appearance based on selection state
function WordTile({
  word, // The word to display
  selected, // Whether this tile is currently selected
  onClick, // Function to call when clicked
  catIndex, // The category index this word belongs to (0-3)
  foundGroupCatIndex, // If this word's category has been found, its index
  categoryName, // The name of the category (shown when found)
  isJumping, // Whether the tile is currently jumping
  isShaking, // Whether the tile is currently shaking
}) {
  // Set background color based on tile state
  const tileBackground =
    typeof foundGroupCatIndex === "number"
      ? CATEGORY_COLORS[foundGroupCatIndex] // Use category color when found
      : selected
      ? "#bfdbfe" // Light blue when selected
      : "#f8fafc"; // Very light gray for maximum readability when not selected
  return (
    <button
      type="button"
      onClick={onClick}
      className={`word-tile${isJumping ? " jump-up" : ""}${
        isShaking ? " shake" : ""
      }${selected ? " selected" : ""}`}
      style={{ background: tileBackground }}
    >
      <span className="word-tile-text">{word}</span>
      {categoryName && (
        <div className="word-tile-category-name">{categoryName}</div>
      )}
    </button>
  );
}

export default WordTile;
