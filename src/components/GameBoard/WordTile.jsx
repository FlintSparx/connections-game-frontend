import React from 'react'

// basic component for displaying a word tile in the connections game
// todo: add selection state and different colors for categories
function WordTile({ word }) {
  return (
    <div className="bg-gray-200 p-3 rounded m-1 text-center font-medium cursor-pointer hover:bg-gray-300 transition-colors duration-150 select-none">
      {word}
    </div>
  )
}

export default WordTile
