import React from "react";
import "../style/Register.css";

const Register = ({ onClose, switchToLogin }) => {

  return (
    <div className="register-container">
      <div className="register-box">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="register-header">
          <h2>Register for RojgariHub</h2>
          <p>Join us and explore amazing opportunities 🌱</p>
        </div>

        <form className="register-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required />
          </div>

          <button type="submit" className="btn-primary">Register</button>


          <p className="register-footer">
          Already have an account?{" "}
          <span onClick={switchToLogin} className="signin-link">Sign In here</span>
          </p>


        </form>
      </div>
    </div>
  );
};

export default Register;


