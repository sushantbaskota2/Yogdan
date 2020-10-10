import React from "react";
import * as Icons from "react-feather";
import "./HamburgerButton.scss";
const HamburgerButton = ({ title, setHamBurger }) => {
  return (
    <div className="hamburger-button">
      <Icons.Menu
        onClick={() => {
          setHamBurger(true);
        }}
      />
      <span>{title}</span>
    </div>
  );
};

export default HamburgerButton;
