import React from "react";
import * as Icons from "react-feather";
import { connect } from "react-redux";
const Nav = ({ scroll, hamburger, isAuthenticated, avatar }) => {
  return (
    <nav className={`${!scroll ? "nav" : "nav nav-sticky"}`}>
      <div className="searchbar">
        <Icons.Menu
          onClick={() => {
            hamburger();
          }}
        />

        <input type="text" placeholder="Find campaign, charities" />
        <Icons.Search />
      </div>
      {isAuthenticated && <img src={`http://localhost:8000${avatar}`} />}
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    avatar: state.auth.user && state.auth.user.avatar,
  };
};

export default connect(mapStateToProps)(Nav);
