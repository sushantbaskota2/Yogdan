import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as Icons from "react-feather";
import AuthInput from "../components/AuthInput";
import { Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { login, signup } from "../store/actions/authAction";
const Button = ({ children }) => {
  return <button className="auth-main-button">{children}</button>;
};

const Auth = ({
  login,
  signup,
  loading,
  isAuthenticated,
  hamburger,
  setHamBurger,
  history,
}) => {
  const isLogin = history.location.pathname === "/login";

  let [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email, password, name } = state;

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login/Signup with redux
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        return login(email, password, history);
      }

      signup(name, email, password, history);
    } catch (error) {
      console.log(error);
    }
  };
  if (isAuthenticated) {
    return <Redirect to={"/"} />;
  }
  return (
    <div onClick={() => hamburger && setHamBurger(false)} className="Auth">
      <Icons.Menu onClick={() => setHamBurger(true)} />

      <div className="main-header">
        <h1>{isLogin ? "Welcome" : "Create account"},</h1>
        <h2>Sign {isLogin ? "in to continue!" : "up to get started!"} </h2>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} style={{ width: "100%" }}>
        <div className="auth-input-wrapper">
          {!isLogin && (
            <AuthInput
              required
              onChange={(e) => handleChange(e)}
              type="text"
              name="name"
              value={name}
              label="Full Name"
            />
          )}
          <AuthInput
            onChange={(e) => handleChange(e)}
            required
            type="email"
            name="email"
            value={email}
            label="Email ID"
          />
          <AuthInput
            onChange={(e) => handleChange(e)}
            required
            type="password"
            value={password}
            name="password"
            label="Password"
          />
          {isLogin && <span className="forgot">Forgot Password?</span>}
        </div>

        <div className="auth-buttons">
          <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
          <Button>
            <Icons.Facebook />
            Connect with facebook
          </Button>
        </div>
      </form>

      <div className="auth-bottom-status">
        {isLogin ? "I'm a new user. " : "I'm already a member. "}
        <Link to={`${isLogin ? "/signup" : "/login"}`}>
          {isLogin ? "Sign Up" : "Sign In"}
        </Link>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => {
  return {
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
  };
};
export default connect(mapStatetoProps, { login, signup })(withRouter(Auth));
