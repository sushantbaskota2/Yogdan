import React, { useEffect, useState } from "react";
import "./MyProfile.scss";
import * as Icons from "react-feather";
import HamburgerButton from "../components/HamburgerButton";
import axios from "../axios";
import { connect } from "react-redux";

const MyProfile = ({ history, hamburger, setHamBurger, logout, user }) => {
  const [donation, setDonation] = useState(0);

  useEffect(() => {
    let mounted = true;
    axios
      .get("/users/me/donations")
      .then(({ data }) => {
        if (mounted) {
          setDonation(data.length);
        }
      })
      .catch((err) => setDonation(0));
    return () => {
      mounted = false;
    };
  }, []);

  const [avatar, setAvatar] = useState(user && user.avatar);

  const uploadImage = async (image) => {
    try {
      const fd = new FormData();
      fd.append("upload", image, image.name);
      await axios.post("/users/me/avatar", fd);
      const avat = await axios.get(`/users/${user._id}/avatar`);
      setAvatar(avat.data);
    } catch (error) {}
  };

  return (
    user && (
      <div
        className="MyProfile"
        onClick={(e) => {
          return hamburger && setHamBurger(false);
        }}
      >
        <HamburgerButton setHamBurger={setHamBurger} />
        <div className="banner">
          <div className="avatar-overlay" />
          <img src={`http://localhost:8000${avatar}`} />
        </div>
        <div className="sexyDiv">
          <div className="avatar">
            <input
              id="chooseFile"
              type="file"
              onChange={(e) => uploadImage(e.target.files[0])}
              name="upload"
              style={{ display: "none" }}
              accept="image/*"
            />
            <span
              onClick={() => document.getElementById("chooseFile").click()}
              className="add"
            >
              <Icons.PlusCircle color="white" />
            </span>
            <img src={`http://localhost:8000${avatar}`} />
          </div>
          <div className="top">
            <span className="name">{user.name}</span>

            <div className="couple-couple">
              <div className="couple">
                <div className="number">{user.favorites.length}</div>
                <div>Favorites</div>
              </div>

              <div className="couple">
                <div className="number">{donation}</div>
                <div>Donations</div>
              </div>
            </div>
          </div>
          <hr />

          <div className="bottom">
            <div className="bottom-card">
              <span>Change Password</span>
            </div>
            <div
              className="bottom-card"
              onClick={() => history.push("my-fundraisers")}
            >
              <span>My Fundraisers</span>
            </div>
            <div className="bottom-card" onClick={() => logout()}>
              <span style={{ color: "red" }}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => {
  return { user: state.auth.user };
};

export default connect(mapStateToProps)(MyProfile);
