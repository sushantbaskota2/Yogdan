import React from "react";
import "./Button.scss";
const Button = ({ children, onClick, ...styles }) => {
  return (
    <button onClick={onClick} style={{ ...styles }} className="button">
      {children}
    </button>
  );
};

export default Button;
