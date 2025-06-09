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
  correct, // Whether this tile's group has been correctly identified
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
      }`}
      style={{
        width: "100%",
        height: "4.5rem",
        border: "1px solid black",
        borderRadius: "0.375rem",
        fontWeight: 600,
        fontSize: "clamp(0.7rem, 2.5vw, 1rem)",
        background: tileBackground,
        color: "#000", // Ensure text is always black
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: "0.15rem",
        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
      <span className="word-tile-text">{word}</span>
      {categoryName && (
        <div
          style={{
            fontSize: "0.6rem",
            marginTop: "0.25rem",
            opacity: 0.8,
          }}
        >
          {categoryName}
        </div>
      )}
    </button>
  );
}

export default WordTile;
