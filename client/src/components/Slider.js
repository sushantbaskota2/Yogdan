import React from "react";
import "./Slider.scss";
const Slider = ({ raised, goal }) => {
  return (
    <div
      style={{
        height: window.innerHeight * 0.01,
      }}
      className="filler"
    >
      <div
        className="slider-fill"
        style={{ width: `${Math.floor((raised * 100) / goal)}%` }}
      />
    </div>
  );
};

export default Slider;
