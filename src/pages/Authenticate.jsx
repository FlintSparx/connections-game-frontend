import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

function Authenticate() {
  const [isRegistering, setIsRegistering] = useState(false);
  return (
    <div>
      {!isRegistering ? (
        <>
          <Login />
          <div>
            <h3>
              Don't have an account?{" "}
              <button onClick={() => setIsRegistering(true)}>
                Register Here
              </button>
            </h3>
          </div>
        </>
      ) : (
        <>
          <Register />
          <h3>
            Already have an account?{" "}
            <button onClick={() => setIsRegistering(false)}>Login Here</button>
          </h3>
        </>
      )}
    </div>
  );
}

export default Authenticate;
