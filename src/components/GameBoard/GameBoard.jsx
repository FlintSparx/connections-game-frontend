import React from 'react'
import WordTile from './WordTile'

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
  // for now just using dummy data for testing
  // todo: get real game data from api
  const sampleWords = [
    "Apple", "Banana", "Cherry", "Date", 
    "Elephant", "Frog", "Giraffe", "Hippo", 
    "Igloo", "Jacket", "Kite", "Lemon", 
    "Mountain", "Notebook", "Orange", "Pencil"
  ]
  
  return (
    <div className="max-w-md mx-auto p-4">
      {/* game board container with grid layout */}
      <div className="grid grid-cols-4 gap-2">
        {/* mapping through sample words to create tiles */}
        {sampleWords.map((word, index) => (
          <WordTile key={index} word={word} />
        ))}
      </div>
    </div>
  )
}

export default GameBoard
