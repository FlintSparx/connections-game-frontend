<<<<<<< HEAD
import React, { useState } from 'react'
import GameBoard from './components/GameBoard'
import GameBoardsList from './components/GameBoard/GameBoardsList'
=======
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from "./components/GameComponents/GameBoard";
import CreateGame from "./components/CreateGame";
import "./App.css";
>>>>>>> origin/create-game

function App() {
  const [view, setView] = useState('game'); // 'game' or 'admin'
  
  return (
<<<<<<< HEAD
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
=======
    // Routing set up for the app
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/CreateGame" element={<CreateGame />} />
          <Route
            path="/"
            element={
              <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Connections Game</h1>
                <p className="text-sm text-gray-600 mb-4">
                  Find groups of four related words
                </p>

                {/* added our game board component */}
                <GameBoard />

                {/* todo: add other game controls and info later */}
                <div className="mt-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    Submit
                  </button>
                  <button className="bg-gray-300 px-4 py-2 rounded">
                    Shuffle
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
>>>>>>> origin/create-game
}

export default App;
