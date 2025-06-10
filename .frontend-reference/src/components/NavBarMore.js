// src/components/NavBarMore.js
import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoon, faSun, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from "../contexts/ThemeContext";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import { removeTokenTimestamp } from "../utils/utils";
import axios from "axios";
import styles from "../styles/modules/NavBarMore.module.css";

const NavBarMore = ({ onClose, isDesktop }) => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { lightMode, setLightMode } = useContext(ThemeContext);
  const history = useHistory();
  const moreRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      history.push('/');
      onClose();
    } catch (err) {
      // Handle error
    }
  };

  const toggleTheme = (e) => {
    e.preventDefault();
    setLightMode(!lightMode);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    history.push(`/profiles/${currentUser?.profile_id}`);
    onClose();
  };

  const NavItem = ({ icon, text, onClick, itemKey }) => (
    <div 
      className={`${styles.NavItem} ${hoveredItem === itemKey ? styles.NavItemHovered : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHoveredItem(itemKey)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <FontAwesomeIcon icon={icon} />
      <span className={styles.NavItemSpan}>{text}</span>
    </div>
  );

  return (
    <div className={`${styles.NavBarMore} ${isDesktop ? styles.NavBarMoreDesktop : ''}`} ref={moreRef} >
      <NavItem data-id="go-to-profile" icon={faUser} text="My Profile" onClick={handleProfileClick} itemKey="profile" />
      <NavItem icon={lightMode ? faMoon : faSun} text="Color Theme" onClick={toggleTheme} itemKey="theme" />
      <NavItem icon={faSignOutAlt} text="Sign Out" onClick={handleSignOut} itemKey="signout" />
    </div>
  );
};

export default NavBarMore;