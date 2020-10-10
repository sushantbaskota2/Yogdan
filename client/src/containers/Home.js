import React, { useState, useEffect } from "react";
import moment from "moment";
import Nav from "../components/Nav";
import Slider from "../components/Slider";
import * as Icons from "react-feather";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { withRouter } from "react-router-dom";
import { ContentLoaderHome } from "../components/ContentLoader";
import axios from "../axios";

const FundCards = ({ hero, history }) => {
  return (
    <div className="fundcards">
      {hero.map(({ title, images, donations, endDate, goal, _id }) => {
        const raised = donations.reduce(
          (init, current) => init + current.amount,
          0
        );

        const image = images[0] ? images[0].image : "";
        return (
          <div
            onClick={() => history.push(`/campaign/${_id}`)}
            key={_id}
            className="fcard"
          >
            <div className="top">
              <img src={`http://localhost:8000${image}`} />
              <div className="img-comp">
                <span>{`${moment(endDate).fromNow(true)} left`}</span>
                <div className="bookmark">
                  <Icons.Bookmark />
                </div>
              </div>
            </div>
            <div className="bottom">
              <span className="fundname">{title}</span>
              <Slider raised={raised} goal={goal} />
              <div className="raised-text">
                <span>Total Raised</span>
                <span style={{ fontWeight: 600 }}>
                  Rs. &nbsp;
                  {`${raised} (${Math.floor((raised * 100) / goal)}%)`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Home = ({ history, hamburger, hamBurgerIsVisible, setHamBurger }) => {
  const [scrolled, setScrolled] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    let mounted = true;
    document.body.style.overflow = !hamBurgerIsVisible && "scroll";

    const handleScroll = (_) => {
      if (window.pageYOffset > 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    document.addEventListener("scroll", handleScroll);

    try {
      axios.get("/causes/").then(({ data }) => {
        if (mounted) {
          setCauses(data);
          setFetched(true);
        }
      });
    } catch (error) {
      if (mounted) {
        setFetched(true);
      }
    }

    return (_) => {
      document.body.style.overflow = "hidden";
      document.removeEventListener("scroll", handleScroll);
      mounted = false;
    };
  }, [hamBurgerIsVisible]);
  return (
    <div onClick={() => hamburger && setHamBurger(false)} className="Home">
      <AnimatePresence initial={false}></AnimatePresence>
      {
        <Nav
          scroll={scrolled}
          hamburger={() => {
            setHamBurger(true);
          }}
        />
      }
      <main>
        <div className="headers" style={{ marginTop: scrolled ? "10rem" : "" }}>
          <div className="title">Trending</div>
          <div className="more">MORE</div>
        </div>
        {fetched ? (
          <FundCards history={history} hero={causes} />
        ) : (
          <ContentLoaderHome />
        )}
      </main>
      )
      <Button
        onClick={() => history.push("/new-campaign")}
        position="fixed"
        bottom="1rem"
        width="60%"
        right="1rem"
      >
        <div className="start-button">Start Campaign</div>
      </Button>
    </div>
  );
};

export default withRouter(Home);
