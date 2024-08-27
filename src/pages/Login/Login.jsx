import "./Login.css";
import assets from "../../assets/assets.js";
import { useState } from "react";
import { signup, login,resetPass } from "../../config/firebase.js";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmittHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign up") {
      signup(username, email, password);
    }
    else{
      login(email,password)
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmittHandler} className="login-form">
        <h2>{currentState}</h2>
        {currentState === "Sign up" ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          className="form-input"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="form-input"
        />
        <button type="Submit">
          {currentState === "Sign up" ? "create account" : "Login"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currentState === "Sign up" ? (
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account{" "}
              <span onClick={() => setCurrentState("Sign up")}>Click here</span>
            </p>
          )}
          {currentState === 'Login' ? <p className="login-toggle">
              Forget Password ?
              <span onClick={() => resetPass(email)}>Click here</span>
            </p> : null }
        </div>
      </form>
    </div>
  );
};

export default Login;
