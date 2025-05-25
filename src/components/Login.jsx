import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(UserContext);
  const nav = useNavigate();

  const logIn = (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="list-page-container" style={{ maxWidth: "500px" }}>
      <h2 className="list-page-title">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3" style={{ backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "4px" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={logIn}>
        <div className="mb-4">
          <label htmlFor="email" className="filter-label">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="filter-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Log In</button>
      </form>
    </div>
  );
}

export default Login;
