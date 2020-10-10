import React from "react";
import "./AuthInput.scss";
const AuthInput = ({ label, ...rest }) => {
  return (
    <div className="auth-input-container">
      <span className="label-wrapper">{label}</span>
      <input {...rest} className="auth-input" />
    </div>
  );
};

export default AuthInput;
