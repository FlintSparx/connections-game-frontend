import React from 'react';

// color scheme for the four different categories
const CATEGORY_COLORS = [
  '#fde68a', // yellow
  '#a7f3d0', // green
  '#fca5a5', // red
  '#93c5fd', // blue
];

// single tile component that displays a word and changes appearance based on selection state
function WordTile({ word, selected, correct, onClick, catIndex, foundGroupCatIndex, categoryName }) {
  // set background color based on tile state
  const background =
    typeof foundGroupCatIndex === 'number'
      ? CATEGORY_COLORS[foundGroupCatIndex]
      : selected
      ? '#bfdbfe'
      : '#ecebe4';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '7rem',
        height: '4rem',
        border: '1px solid black',
        borderRadius: '0.375rem',
        fontWeight: 600,
        fontSize: '1rem',
        background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: '0.25rem',
      }}
    >
      {word}
      {categoryName && (
        <div style={{ 
          fontSize: '0.6rem', 
          marginTop: '0.25rem',
          opacity: 0.8 
        }}>
          {categoryName}
        </div>
      )}
    </button>
  );
}

export default WordTile;
