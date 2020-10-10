import React, { useState, useEffect } from "react";
import * as Icons from "react-feather";
import moment from "moment";
import StoryDescription from "../components/StoryDescription";
import Button from "../components/Button";
import { Swipeable } from "react-swipeable";
import { motion } from "framer-motion";
import Slider from "../components/Slider";
import BackButton from "../components/BackButton";
import Comment from "../components/Comments";
import axios from "../axios";
import { connect } from "react-redux";
import { loadUser } from "../store/actions/authAction";
const ImageDiv = ({ imageURLArray, height, setTop, setActive, history }) => {
  const RIGHT = "-1";
  const LEFT = "+1";

  const [imageIdx, setImageIdx] = useState(0);

  const onSwiped = (direction) => {
    setActive(false);
    setTop();
    const change = direction === RIGHT ? RIGHT : LEFT;
    const adjustedIdx = imageIdx + Number(change);
    let newIdx;
    if (adjustedIdx >= imageURLArray.length) {
      newIdx = 0;
    } else if (adjustedIdx < 0) {
      newIdx = imageURLArray.length - 1;
    } else {
      newIdx = adjustedIdx;
    }
    setImageIdx(newIdx);
  };

  const imageStyle = () => {
    return imageURLArray
      ? {
          backgroundImage: `url(http://localhost:8000${imageURLArray[imageIdx].image})`,
        }
      : { backgroundImage: `url(https://unsplash.it/342/249)` };
  };

  return (
    <Swipeable
      trackMouse
      style={{ touchAction: "none" }}
      preventDefaultTouchmoveEvent
      onSwipedLeft={() => onSwiped(LEFT)}
      onSwipedRight={() => onSwiped(RIGHT)}
    >
      <motion.div
        animate={{ height }}
        transition={{
          duration: 0.5,
        }}
        className="donation_image_div"
        style={imageStyle()}
      >
        <div className="header-button">
          <BackButton history={history} />
        </div>
      </motion.div>
    </Swipeable>
  );
};

const FloatingDiv = ({
  id,
  comments,
  goal,
  createdAt,
  creator,
  title,
  description,
  donations,
  endDate,
  top,
  setHeight,
  setActive,
  active,
  history,
  user,
  loadUser,
}) => {
  const Enum = {
    Story: 1,
    Comments: 2,
  };

  const [content, setContent] = useState(Enum.Story);
  const raisedMoney =
    donations && donations.reduce((init, current) => init + current.amount, 0);
  const percentage = (raisedMoney / goal) * 100;
  const handleContentClick = (num) => {
    if (!top) {
      setHeight();
      setActive(true);
    }
    setContent(num);
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const bookmarked = user && user.favorites.find(({ cause }) => cause === id);

  const handleBookMark = async () => {
    try {
      if (!bookmarked) {
        await axios.post(`/users/addFavorites/${id}`);
        history.push("/my-favorites");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="floating_div">
      {!bookmarked && (
        <div onClick={handleBookMark} className="bookmark">
          <Icons.Bookmark size="3rem" color="white" fill="white" />
        </div>
      )}
      <motion.div
        animate={{
          rotate: active ? 180 : 0,
        }}
        transition={{
          duration: 0.5,
        }}
        onClick={() => {
          setHeight();
          setActive(!active);
        }}
        className="dash"
      >
        <Icons.ChevronUp />
      </motion.div>
      <div className="types">
        <span className="type">Medical</span>
        <span className="type">Emergency</span>
      </div>
      <h1>{title}</h1>
      <div className="campaign-info">
        <span className="organizer">
          Organized by <span className="name">{creator && creator.name}</span>
        </span>
        <span className="date">
          <span className="day">
            {moment(endDate).diff(moment.now(), "days")}
          </span>
          days left
        </span>
      </div>
      <Slider goal={goal} raised={raisedMoney < goal ? raisedMoney : goal} />
      <div className="amount-info">
        <div className="amount-title">
          <span>Raised so far</span>
          <span>Target</span>
        </div>
        <div className="amount">
          <span className="total">
            Rs.{raisedMoney}
            <span className="percentage">({percentage}%)</span>
          </span>

          <span className="target">Rs.{goal}</span>
        </div>
      </div>
      <div className="donors-list">
        <span className="title">Recent Donors</span>
        <div className="donors">
          {donations &&
            donations
              .filter((donation, index) => index < 5)
              .map((donation) => {
                return (
                  <img
                    key={donation._id}
                    src={`http://localhost:8000${donation.user.avatar}`}
                  />
                );
              })}
          {donations && donations.length > 5 && (
            <div>+{donations.length - 5}</div>
          )}
        </div>
      </div>
      <div className="content-title">
        <span
          onClick={() => handleContentClick(Enum.Story)}
          className={`story ${content === Enum.Story ? "active" : ""}`}
        >
          Story
        </span>

        <span
          onClick={() => handleContentClick(Enum.Comments)}
          className={`updates ${content === Enum.Comments ? "active" : ""}`}
        >
          Comments{" "}
          <span className="grey-out">{comments && comments.length}</span>
        </span>
      </div>

      <div className="main-content">
        {content === 1 ? (
          <StoryDescription
            image={creator && `http://localhost:8000${creator.avatar}`}
            name={creator && creator.name}
            date={moment(createdAt).format("ddd")}
            text={description}
          />
        ) : (
          comments.map((comment) => (
            <Comment
              image={`http://localhost:8000${comment.user.avatar}`}
              name={comment.user.name}
              text={comment.text}
              date={moment(comment.date).format("ddd")}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ButtonContainer = ({ history, id, target }) => (
  <div className="bottom-buttons">
    <div className="share">
      <Icons.Share />
    </div>
    <Button
      onClick={() => history.push(`/donate/${id}?target=${target}`)}
      width="23rem"
    >
      Donate
    </Button>
  </div>
);

const Campaign = ({ history, user, loadUser }) => {
  const [top, setTop] = useState(false);
  const [active, setActive] = useState(false);
  const [campaign, setCampaign] = useState({});

  useEffect(() => {
    let mounted = true;
    let campaign = history.location.pathname.split("/")[2];
    try {
      axios
        .get(`/causes/${campaign}`)
        .then(({ data }) => {
          if (mounted) {
            setCampaign(data);
          }
        })
        .catch((e) => {
          history.push("/");
        });
    } catch (error) {
      history.push("/");
    }

    return () => {
      mounted = false;
    };
  }, [history]);

  const handleHeightChange = () => {
    setTop(!top);
  };
  const height = top ? "16vh" : "40vh";
  return (
    <div className="Campaign">
      <ImageDiv
        history={history}
        imageURLArray={campaign.images}
        height={height}
        setTop={() => {
          if (top) {
            setTop(!top);
          }
          return;
        }}
        setActive={setActive}
      />
      <FloatingDiv
        id={campaign._id}
        comments={campaign.comments}
        creator={campaign.creator}
        createdAt={campaign.createdAt}
        goal={campaign.goal}
        title={campaign.title}
        description={campaign.description}
        donations={campaign.donations}
        endDate={campaign.endDate}
        active={active}
        setActive={setActive}
        user={user}
        loadUser={loadUser}
        top={top}
        setHeight={handleHeightChange}
        history={history}
      />
      {
        <ButtonContainer
          id={campaign._id}
          history={history}
          target={campaign.goal}
        />
      }
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { loadUser })(Campaign);
