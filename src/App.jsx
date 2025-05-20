import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import GameBoard from './components/GameBoard'
import './App.css'
import RegistrationForm from './components/RegistrationForm';

function GamePage() {
  return (
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Simple navigation bar */}
        <nav className="bg-blue-500 p-4 text-white">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold">Connections App</Link>
            <div>
              <Link to="/" className="mr-4">Game</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App