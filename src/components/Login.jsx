import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(UserContext);
  const nav = useNavigate();

  const logIn = () => {
    if (username === "" || password === "") {
      setError("Username and password cannot be empty.");
      return;
    } else {
      fetch(`http://localhost:5000/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error();
          }
          return res.json();
        })
        .then((data) => {
          if (data.token) {
            document.cookie = `auth_token=${data.token}; path=/;`;
            setToken(data.token);
            nav("/");
          } else {
            setError(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Login failed. Please try again.");
        });
    }
    // Placeholder for login functionality
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={logIn}>Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
