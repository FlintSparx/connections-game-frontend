import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

function Authenticate() {
  const [isRegistering, setIsRegistering] = useState(false);
  return (
    <div className="auth-container" style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      {!isRegistering ? (
        <>
          <Login />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <p>
              Don't have an account?{" "}
              <button 
                onClick={() => setIsRegistering(true)}
                className="btn btn-secondary"
                style={{ marginLeft: "0.5rem" }}
              >
                Register Here
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <Register />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => setIsRegistering(false)}
                className="btn btn-secondary"
                style={{ marginLeft: "0.5rem" }}
              >
                Login Here
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Authenticate;
