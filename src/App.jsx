import React from "react";
import GameBoard from "./components/GameComponents/GameBoard";
import "./App.css";
import CreateGame from "./components/CreateGame";

function App() {
  return (
    // TODO: Move to a new page
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
        <button className="bg-gray-300 px-4 py-2 rounded">Shuffle</button>
      </div>
    </div>
  );
}

export default App;
