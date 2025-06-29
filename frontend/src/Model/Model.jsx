// src/Model/Model.jsx
import React from "react";
import "./Model.css"; // make sure you have a CSS file for styling

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
