import { createContext, useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GameBoard from "./components/GameComponents/GameBoard";
import Navigation from "./components/Navigation/Navigation";
import BrowseBoards from "./pages/BrowseBoards";
import CreateGame from "./components/GameComponents/CreateGame"; // replaced createGamePage import
import Authenticate from "./pages/Authenticate";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import { useParams } from "react-router-dom";
import "./styles/App.css";
import "./styles/ListPageStyles.css";
// MobileAdjustments needs to be last to override other styles
import "./styles/MobileAdjustments.css"; // Has card view toggle at 1000px width

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
      userID: payload.id,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  } catch {
    return null;
  }
};

function Logout({ onLogout }) {
  useEffect(() => {
    onLogout();
  }, [onLogout]);
  return <Navigate to="/" replace />;
}

const navigate = useNavigate();

function App() {
  // user and token state
  const [user, setUser] = useState(getUserFromToken());
  const [token, setToken] = useState(getCookieValue("auth_token"));
  const [showCreateGameOverlay, setShowCreateGameOverlay] = useState(false);

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
    navigate("/login");
  };
  return (
    <UserContext.Provider value={{ user, token, setToken }}>
      <BrowserRouter>
        <Navigation setShowCreateGameOverlay={setShowCreateGameOverlay} />{" "}
        {showCreateGameOverlay && (
          <CreateGame
            showOverlay={showCreateGameOverlay}
            onClose={() => setShowCreateGameOverlay(false)}
          />
        )}
        <Routes>
          <Route
            path="/browse"
            element={
              <BrowseBoards
                setShowCreateGameOverlay={setShowCreateGameOverlay}
              />
            }
          />{" "}
          {}
          <Route path="/play/:id" element={<PlayGameBoard />} />
          <Route path="/login" element={<Authenticate />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />{" "}
          <Route
            path="/"
            element={
              <div className="container">
                <h1 style={{ fontWeight: "bold" }}>Connections Game</h1>
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
