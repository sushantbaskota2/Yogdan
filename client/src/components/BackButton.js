import React from "react";
import * as Icons from "react-feather";
import "./BackButton.scss";
const BackButton = ({ history, ...styles }) => {
  return (
    <div
      onClick={() => history.goBack()}
      style={{ ...styles }}
      className="go-back"
    >
      <Icons.ChevronLeft fontSize="1.4rem" />
      <span>Back</span>
    </div>
  );
};

export default BackButton;
