import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthContext } from "contexts/AuthContext";

export default function Login() {
  const { dispatch } = useAuthContext();
  const [state, setState] = useState({ email: "", password: "" });
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "SET_LOGGED_IN", payload: { user } });
      } else {
        dispatch({ type: "SET_LOGGED_OUT" });
      }
    });
  }, [dispatch]);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = state;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.toastify("Login success", "success");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            window.toastify("Wrong Email or Password", "error");
            break;
          default:
            window.toastify("Something went wrong or Network anomaly", "error");
            break;
        }
      });
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch({ type: "SET_LOGGED_IN", payload: { user } });
      window.toastify("Logged in with Google", "success");
    } catch (error) {
      console.error("Google Sign-In error", error);
      window.toastify("Failed to log in with Google", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            required
          />
          <input
            type="password"
            onChange={handleChange}
            placeholder="Password"
            name="password"
            required
          />
          <button type="submit" className="register">Login</button>
        </form>
        <button class="button" onClick={handleGoogleSignIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            ></path>
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          Continue with Google
        </button>
        <Link to="/auth/register">New? Register here</Link>
      </div>
      <div className="login-image-container">
        {/* You can add a background image or image element here */}
      </div>
    </div>
  );
}
