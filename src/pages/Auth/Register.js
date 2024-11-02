import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "config/firebase";
import { Link } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthContext } from "contexts/AuthContext";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [state, setState] = useState(initialState);
  const { dispatch } = useAuthContext();
  const provider = new GoogleAuthProvider();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const addTodB = async (user) => {
    const userData = {
      fullName: state.fullName || user.displayName || "Anonymous",
      email: user.email,
      uid: user.uid,
      dateCreated: serverTimestamp(),
      isActive: true,
    };
    try {
      await setDoc(doc(firestore, "users", user.uid), userData);
      dispatch({ type: "SET_LOGGED_IN", payload: { user: userData } });
      console.log(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let { fullName, email, password, confirmPassword } = state;

    fullName = fullName.trim();

    if (fullName.length < 3) {
      return window.toastify("Please enter your full name", "error");
    }
    if (!window.isEmail(email)) {
      return window.toastify("Please enter a valid email address", "error");
    }
    if (password.length < 6) {
      return window.toastify("Password must be at least 6 chars.", "error");
    }
    if (confirmPassword !== password) {
      return window.toastify("Password doesn't match", "error");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addTodB(user);
        console.log(userCredential);
        window.toastify("Registration success", "success");
      })
      .catch((error) => {
        console.error("error", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            window.toastify("Email address already in use", "error");
            break;
          default:
            window.toastify("Something went wrong", "error");
            break;
        }
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      addTodB(user);
      window.toastify("Logged in with Google", "success");
    } catch (error) {
      console.error("Google Sign-In error", error);
      window.toastify("Failed to log in with Google", "error");
    }
  };

  return (
    <div className="login-page register-page">
      <div className="login-form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            name="fullName"
            required
          />
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button type="submit" className="register">Register</button>
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
        <Link to="/auth/login">Already registered? Login here</Link>
      </div>
      <div className="login-image-container register-image">
        {/* You can add a different background image or image element here */}
      </div>
    </div>
  );
}
