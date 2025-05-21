import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(UserContext);
  const nav = useNavigate();

  const logIn = () => {
    if (email === "" || password === "") {
      setError("Email and password cannot be empty.");
      return;
    } else {
      fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/users/login`,
        {
          method: "POST",
          body: JSON.stringify({ email: email.toLowerCase(), password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
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
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
