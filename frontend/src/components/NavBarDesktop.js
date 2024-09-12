import React, { useContext } from "react";
import styles from "../styles/modules/NavBarDesktop.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";import Avatar from "./Avatar";
import { removeTokenTimestamp } from "../utils/utils";
import axios from "axios";
import { ThemeContext } from "../contexts/ThemeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';


const NavBarDesktop = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { lightMode, setLightMode } = useContext(ThemeContext);
  const logoURL = "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724410546/media/images/logo_buvyq3.png";

  const toggleTheme = () => {
    setLightMode(!lightMode);
  };

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // Handle error
    }
  };

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
      >
        <i className="fas fa-home"></i>
        <span className={styles.NavText}>Home Feed</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/posts/create"
      >
        <i className="far fa-plus-square"></i>
        <span className={styles.NavText}>Add Post</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/messages"
      >
        <i className="fas fa-envelope"></i>
        <span className={styles.NavText}>Messages</span>
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>
        <span className={styles.NavText}>Sign out</span>
      </NavLink>
    </>
  );
  
  const profileLink = (
    <div className={styles.ProfileLink}>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} />
        <span className={styles.NavText}>Profile</span>
      </NavLink>
    </div>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span className={styles.NavText}>Sign in</span>
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>
        <span className={styles.NavText}>Sign up</span>
      </NavLink>
    </>
  );

  return (
    <nav className={styles.NavBarDesktop}>
      <img src={logoURL} alt="Logo" className={`${styles.Logo} green-filter`} />
      {currentUser ? (
        <>
          {loggedInIcons}
          {profileLink}
        </>
      ) : (
        loggedOutIcons
      )}
    <button onClick={toggleTheme} className={styles.ThemeToggle}>
      <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
    </button>
    </nav>
  );
};

export default NavBarDesktop;
