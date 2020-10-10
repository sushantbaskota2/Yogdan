import React from "react";
import "./AuthButton.scss";
const AuthButton = ({ children, ...rest }) => {
  return (
    <button {...rest} className="auth-button">
      {children}
    </button>
  );
};

export default AuthButton;
