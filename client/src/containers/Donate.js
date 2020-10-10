import React, { Fragment, useState } from "react";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { useCountUp } from "react-countup";
import { Redirect } from "react-router-dom";
import numeral from "numeral";
import { motion } from "framer-motion";
import Switcher from "../components/Switcher";
import * as Icons from "react-feather";

const Donate = ({ history }) => {
  const campaignId = history.location.pathname.split("/")[2];

  const target = parseInt(
    new URLSearchParams(history.location.search).get("target")
  );

  const [donation, setDonation] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [slider, setSlider] = useState(true);

  const handleDonation = (value) => {
    if (value < target) {
      setPrevious(donation);
      setDonation(value);
    }
  };

  const CountHook = ({ previous, donation }) => {
    const { countUp } = useCountUp({
      end: donation,
      start: previous,
      delay: 0,
      duration: 0.5,
      preserveValue: true,
    });

    return <span>{countUp}</span>;
  };

  if (!target) {
    return <Redirect to="/" />;
  }
  const height = slider ? window.innerHeight * 0.4 : window.innerHeight * 0.3;
  return (
    <div className="Donate">
      <motion.div
        animate={{
          width: !slider ? "0%" : `${(donation / target) * 100}%`,
        }}
        transition={{
          duration: slider ? 0 : 0.2,
        }}
        className="donation-fill"
      />
      <div className="slider-before">
        <div className="header">
          <BackButton history={history} color="rgb(34, 27, 27)" />
        </div>

        <motion.img
          animate={{ height }}
          transition={{
            duration: 0.2,
          }}
          src="https://i.pinimg.com/originals/71/21/85/712185683557a51c87a1d821a251d183.jpg"
        />
      </div>
      <div className="slider-wrapper">
        {slider ? (
          <SliderWrapper
            slider={slider}
            setSlider={setSlider}
            previous={previous}
            target={target}
            donation={donation}
            changeDonation={handleDonation}
          />
        ) : (
          <NumpadWrapper
            donation={donation}
            changeDonation={handleDonation}
            slider={slider}
            setSlider={setSlider}
          />
        )}
      </div>
      <div className="button-container">
        <Button
          onClick={() => history.push(`/pay/${campaignId}?amount=${donation}`)}
          height="100%"
        >
          Donate &nbsp;<span style={{ fontWeight: "bolder" }}>Rs.</span>
          <CountHook donation={donation} previous={previous} />
        </Button>
      </div>
    </div>
  );
};

const NumpadWrapper = ({ donation, changeDonation, slider, setSlider }) => {
  const nums = [
    { key: 1, value: "1" },
    { key: 2, value: "2" },
    { key: 3, value: "3" },
    { key: 4, value: "4" },
    { key: 5, value: "5" },
    { key: 6, value: "6" },
    { key: 7, value: "7" },
    { key: 8, value: "8" },
    { key: 9, value: "9" },
    { key: "00", value: "00" },
    { key: 0, value: 0 },
    { key: "*", value: <Icons.ChevronLeft /> },
  ];

  const handleDonation = (key) => {
    let newDonation = donation.toString();

    if (key >= 0 || key <= 9 || key === "00") {
      newDonation = parseInt(`${newDonation + key}`);
    } else {
      const hello = newDonation.slice(0, -1);
      newDonation = hello === "" ? 0 : parseInt(hello);
    }
    changeDonation(newDonation);
  };

  return (
    <div className="numpad-wrapper">
      <div className="top-header">
        <h2>Rs.{donation}</h2>
        <Switcher slider={slider} setSlider={setSlider} />
      </div>
      <div className="numpad">
        {nums.map(({ key, value }) => (
          <span
            key={key}
            onClick={() => {
              handleDonation(key);
            }}
            style={{
              padding: window.innerHeight * 0.02,
            }}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

const SliderWrapper = ({
  slider,
  setSlider,
  previous,
  target,
  donation,
  changeDonation,
}) => {
  const CountHook = ({ previous, donation }) => {
    const { countUp } = useCountUp({
      end: donation,
      start: previous,
      delay: 0,
      duration: 0.5,
      preserveValue: true,
    });

    return <span>{countUp}</span>;
  };
  return (
    <Fragment>
      <div className="donate-title">
        <h2 style={{ fontWeight: 400 }}>Donate</h2>
        <div className="donation-header">
          <h1>
            Rs.
            <CountHook donation={donation} previous={previous} />
          </h1>
          <Switcher slider={slider} setSlider={setSlider} />
        </div>

        <h2 style={{ fontWeight: 400 }}>
          to help this <span>Rainforest</span> recover
        </h2>
      </div>

      <div className="slider">
        <input
          type="range"
          min="0"
          max={target}
          onChange={({ target: { value } }) => changeDonation(value)}
          value={donation}
        />

        <div className="donation-detail">
          <span>Rs.0</span>
          <span>Rs.{numeral(target).format("0.a")}</span>
        </div>
      </div>
    </Fragment>
  );
};
export default Donate;
