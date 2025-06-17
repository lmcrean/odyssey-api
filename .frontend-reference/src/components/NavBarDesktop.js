import React, { useState, useContext } from "react";
import styles from "../styles/modules/NavBarDesktop.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faPlus, faEnvelope, faUser, faSignInAlt, faUserPlus, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import NavBarMore from "./NavBarMore";
import Logo from "./Logo";

const NavBarDesktop = () => {
  const currentUser = useCurrentUser();
  const { lightMode, setLightMode } = useContext(ThemeContext);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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
        <span className={styles.NavText}>Feed</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/posts/create" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faPlus} />
        </NavLink>
        <span className={styles.NavText}>Post</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/messages" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faEnvelope} />
        </NavLink>
        <span className={styles.NavText}>Messages</span>
      </div>
      <div className={`${styles.NavItem} ${styles.ProfileNavItem}`} onClick={toggleMore}>
        <div className={styles.NavLink}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        <span className={styles.NavText} data-id="my-profile">Profile</span>
      </div>
    </>
  );

  const loggedOutIcons = (
    <>
      <div className={styles.NavItem}>
        <NavLink exact to="/" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faCompass} />
        </NavLink>
        <span className={styles.NavText}>Explore</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/signin" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faSignInAlt} />
        </NavLink>
        <span className={styles.NavText}>Sign In</span>
      </div>
      <div className={styles.NavItem}>
        <NavLink to="/signup" className={styles.NavLink} activeClassName={styles.Active}>
          <FontAwesomeIcon icon={faUserPlus} />
        </NavLink>
        <span className={styles.NavText}>Sign Up</span>
      </div>
      <div className={styles.NavItem} onClick={toggleTheme}>
        <div className={styles.NavLink}>
          <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
        </div>
        <span className={styles.NavText}>{lightMode ? "Dark Mode" : "Light Mode"}</span>
      </div>
    </>
  );

  return (
    <nav className={styles.NavBarDesktop}>
      <div className={styles.LogoContainer}>
        <Logo />
      </div>
      <div className={styles.NavLinks}>
        {currentUser ? loggedInIcons : loggedOutIcons}
      </div>
      {isMoreOpen && <NavBarMore onClose={closeMore} isDesktop={true} />}
    </nav>
  );
};

export default NavBarDesktop;