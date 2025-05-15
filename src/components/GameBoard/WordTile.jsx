import React from 'react';

const CATEGORY_COLORS = [
  '#fde68a', // yellow
  '#a7f3d0', // green
  '#fca5a5', // red
  '#93c5fd', // blue
];

function WordTile({ word, selected, correct, onClick, catIndex, foundGroupCatIndex }) {
  // pick background color
  const background =
    typeof foundGroupCatIndex === 'number'
      ? CATEGORY_COLORS[foundGroupCatIndex]
      : correct
      ? '#bbf7d0'
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
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
      }}
    >
      {word}
    </button>
  );
}

export default WordTile;
