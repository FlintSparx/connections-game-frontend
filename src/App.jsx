import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GameBoard from "./components/GameComponents/GameBoard";
import Navigation from "./components/Navigation";
import BrowseBoards from "./components/BrowseBoards";
import CreateGamePage from "./pages/CreateGame";
import Authenticate from "./pages/Authenticate";
import { useParams } from "react-router-dom";
import "./App.css";

export const UserContext = createContext(null);

// helper to get cookie value
export const getCookieValue = (keyName) => {
  try {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${keyName}`));
    const value = cookie.split("=")[1];
    return value;
  } catch {
    return null;
  }
};

// Wrapper to pass gameId param to GameBoard
function PlayGameBoard() {
  const { id } = useParams();
  return <GameBoard gameId={id} />;
}

// decode user info from the jwt token stored in cookie
const getUserFromToken = () => {
  try {
    const token = getCookieValue("auth_token");
    if (!token) return null;
    const payload = jwtDecode(token);
    // return user details directly from payload
    return {
      userID: payload.userID,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isAdmin: payload.isAdmin,
    };
  } catch {
    return null;
  }
};

const handleLogout = () => {
  document.cookie =
    "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  setToken(null);
  setUser(null);
  window.location = "/login";
};

function Logout({ onLogout }) {
  useEffect(() => {
    onLogout();
  }, [onLogout]);
  return <Navigate to="/" replace />;
}

function App() {
  // user and token state
  const [user, setUser] = useState(getUserFromToken());
  const [token, setToken] = useState(getCookieValue("auth_token"));

  // update user state if token changes (e.g. after login)
  useEffect(() => {
    setUser(getUserFromToken());
  }, [token]);

  // logout function clears cookie and state redirects to login
  const handleLogout = () => {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    setUser(null);
    window.location = "/login";
  };
  return (
    <UserContext.Provider value={{ user, token, setToken }}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/browse" element={<BrowseBoards />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/play/:id" element={<PlayGameBoard />} />
          <Route path="/login" element={<Authenticate />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
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
    </UserContext.Provider>
  );
}

export default App;
export default App;
