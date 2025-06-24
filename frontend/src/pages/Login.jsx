import React from "react";
import "../style/Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Login to RojgariHub</h2>
          <p>Welcome back 👋</p>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input type="text" id="username" required />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input type="password" id="login-password" required />
          </div>

          <div className="login-links">
            <a href="#">Forgot password?</a>
          </div>

          <button className="btn-secondary">Login</button>

          <p className="login-footer">
            New to RojgariHub? <a href="#">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
