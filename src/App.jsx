import React, { useState } from 'react'
import GameBoard from './components/GameBoard'
import GameBoardsList from './components/GameBoard/GameBoardsList'

function App() {
  const [view, setView] = useState('game'); // 'game' or 'admin'
  
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Connections Game</h1>
      
      {/* Navigation */}
      <div className="mb-4">
        <button 
          className={`px-4 py-2 mx-2 rounded ${view === 'game' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('game')}
        >
          Play Game
        </button>
        <button 
          className={`px-4 py-2 mx-2 rounded ${view === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('admin')}
        >
          Manage Boards
        </button>
      </div>
      
      {/* Show appropriate view */}
      {view === 'game' ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Find groups of four related words
          </p>
          <GameBoard />
        </>
      ) : (
        <GameBoardsList />
      )}
    </div>
  )
}

export default App
