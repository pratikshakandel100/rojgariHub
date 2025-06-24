import React from "react";
import "../style/SigIn.css";


const SignIn = () => {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="signin-header">
          <h2>Sign in to RojgariHub</h2>
          <p>Find your dream job with us 🌱</p>
        </div>

        <form className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className="signin-links">
            <a href="#">Forgot your password?</a>
          </div>

          <button className="btn-secondary" onClick={() => setShowSignIn(true)}>Sign In</button>



          <p className="signin-footer">
            Don't have an account?{" "}
            <a href="#" className="register-link">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
