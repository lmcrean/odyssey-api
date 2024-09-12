import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Avatar from "./Avatar";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";
import axios from "axios";
import styles from "../styles/modules/NavBarMobile.module.css";

const NavBarMobile = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { lightMode, setLightMode } = useContext(ThemeContext);
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // Handle error
    }
  };

  const toggleTheme = () => {
    setLightMode(!lightMode);
  };

  const loggedInIcons = (
    <>
      <NavLink
        exact
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
      >
        <i className="fas fa-home"></i>
        <span>Home Feed</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/posts/create"
      >
        <i className="far fa-plus-square"></i>
        <span>Add</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/messages"
      >
        <i className="fas fa-envelope"></i>
        <span>Messages</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} />
        <span>{currentUser?.username}</span>
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Sign out</span>
      </NavLink>
      <button className={styles.NavLink} onClick={toggleTheme}>
        <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
        <span>{lightMode ? "Dark Mode" : "Light Mode"}</span>
      </button>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span>Sign in</span>
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>
        <span>Sign up</span>
      </NavLink>
      <button className={styles.NavLink} onClick={toggleTheme}>
        <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
        <span>{lightMode ? "Dark Mode" : "Light Mode"}</span>
      </button>
    </>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBarMobile} fixed="bottom">
      <Container className="justify-content-around">
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 justify-content-around">
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarMobile;