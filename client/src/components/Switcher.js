import React from "react";
import * as Icons from "react-feather";
import "./Switcher.scss";
const Switcher = ({ slider, setSlider }) => (
  <span onClick={() => setSlider(!slider)} className="input-option">
    {slider ? <Icons.ChevronUp size="15" /> : <Icons.ChevronDown size="20" />}
  </span>
);
export default React.memo(Switcher);
