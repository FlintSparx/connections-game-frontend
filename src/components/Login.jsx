import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   const { setToken } = useContext(UserContext);
  const nav = useNavigate();

  const logIn = () => {
    if (username === "" || password === "") {
      setError("Username and password cannot be empty.");
      return;
    }
    // Placeholder for login functionality
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        // value={username}
        // onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        // value={password}
        // onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={logIn}>Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
