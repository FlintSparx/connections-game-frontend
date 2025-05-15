import React from 'react'
import GameBoard from './components/GameBoard'

function App() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Connections Game</h1>
      <p className="text-sm text-gray-600 mb-4">
        Find groups of four related words
      </p>
      
      {/* added our game board component */}
      <GameBoard />
      
      {/* Buttons moved into GameBoard component */}
    </div>
  )
}

export default App
