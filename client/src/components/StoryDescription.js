import React from "react";
import "./StoryDescription.scss";
const StoryDescription = ({ image, name, date, text }) => {
  return (
    <div className="StoryDescription">
      <div className="comment-card">
        <div className="commenter-info">
          <img src={image} />
          <span className="name">{name}</span>
          <span className="date">{date}</span>
        </div>
        <span className="comment">{text}</span>
      </div>
    </div>
  );
};

export default StoryDescription;
