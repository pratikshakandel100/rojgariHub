import React from "react";
import "../style/Login.css";

const Login = ({ switchToRegister, onClose }) => {
  return (
    <div className="login-container">
      <div className="login-box">
        <button className="modal-close" onClick={onClose}>×</button>

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

          <button className="btn-primary login-center-btn">Login</button>


          <div className="login-footer">
            <a href="#" className="forgot-password">Forgot password?</a>
            <p className="signup-link">
              New to RojgariHub?{" "}
              <span className="switch-link" onClick={switchToRegister}>Sign up</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

