import { useContext } from "react";
import Login from "../components/Login";
import { UserContext } from "../App";

function Authenticate() {
  const { setShowRegisterOverlay } = useContext(UserContext);

  return (
    <div
      className="auth-container"
      style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}
    >
      <Login setShowRegisterOverlay={setShowRegisterOverlay} />
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => setShowRegisterOverlay(true)}
            className="btn btn-secondary"
            style={{ marginLeft: "0.5rem" }}
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Authenticate;
