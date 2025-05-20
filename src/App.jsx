import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from "./components/GameComponents/GameBoard";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import BrowseBoards from "./components/BrowseBoards";
import CreateGamePage from "./pages/CreateGame";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowseBoards />} />
        <Route path="/create" element={<CreateGamePage />} />
        <Route
          path="/"
          element={
            <div className="container">
              <h1>Connections Game</h1>
              <p className="subtitle">Find groups of four related words</p>
              <GameBoard />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
