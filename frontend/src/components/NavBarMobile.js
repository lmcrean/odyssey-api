import React, { useState, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faPlus, faEnvelope, faUser, faSignInAlt, faUserPlus, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/modules/NavBarMobile.module.css";
import NavBarMore from "./NavBarMore";

const NavBarMobile = () => {
  const currentUser = useCurrentUser();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { lightMode, setLightMode } = useContext(ThemeContext);

  const toggleMore = () => setIsMoreOpen(!isMoreOpen);

  const closeMore = () => setIsMoreOpen(false);

  const toggleTheme = () => {
    setLightMode(!lightMode);
  };

  const loggedInIcons = (
    <>
      <div className={styles.NavItem}>
        <NavLink exact to="/" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faCompass} />
        </NavLink>
        <span>Feed</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/posts/create" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faPlus} />
        </NavLink>
        <span>Post</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/messages" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faEnvelope} />
        </NavLink>
        <span>Messages</span>
      </div>
      <div className={styles.NavItem} onClick={toggleMore}>
        <div className={styles.NavLink}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        <span>Profile</span>
      </div>
      {isMoreOpen && <NavBarMore onClose={closeMore} />}
    </>
  );

  const loggedOutIcons = (
    <>
      <div className={styles.NavItem}>
        <NavLink exact to="/" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faCompass} />
        </NavLink>
        <span>Explore</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/signin" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faSignInAlt} />
        </NavLink>
        <span>Sign In</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/signup" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faUserPlus} />
        </NavLink>
        <span>Sign Up</span>
      </div>
      <div className={styles.NavItem} onClick={toggleTheme}>
        <div className={styles.NavLink}>
          <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
        </div>
        <span>{lightMode ? "Dark Mode" : "Light Mode"}</span>
      </div>
    </>
  );

  return (
    <Navbar className={styles.NavBarMobile} fixed="bottom">
      <Container>
        <Nav className="w-100 justify-content-around">
          {currentUser ? loggedInIcons : loggedOutIcons}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBarMobile;