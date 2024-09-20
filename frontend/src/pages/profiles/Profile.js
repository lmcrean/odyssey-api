// src/pages/profiles/Profile.js

import React, { useState } from "react";
import styles from "../../styles/modules/Profile.module.css";
import btnStyles from "../../styles/modules/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Button from "react-bootstrap/Button";
import { axiosReq } from "../../api/axiosDefaults";
import { useSetProfileData } from "../../contexts/ProfileDataContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const { handleFollow, handleUnfollow } = useSetProfileData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFollowClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = following_id
        ? await handleUnfollow(profile)
        : await handleFollow(profile);
      
      if (!result.success) {
        setError(result.error);
        console.error("Follow/Unfollow error:", result.error);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfChatExists = async () => {
    try {
      const { data } = await axiosReq.get(`/messages/${id}/`);
      if (data.results.length > 0) {
        history.push(`/messages/${id}`);
      } else {
        history.push(`/messages/create/${id}`);
      }
    } catch (err) {
      console.error("Error checking for existing chat:", err);
    }
  };

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`d-flex text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser &&
          !is_owner && (
            <>
              {following_id ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{"Unfollow"}</Tooltip>}
                >
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.UndoButton}`}
                    onClick={handleFollowClick}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : <i className="fas fa-user-minus"></i>}
                  </Button>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{"Follow"}</Tooltip>}
                >
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.SocialButton}`}
                    onClick={handleFollowClick}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : <i className="fas fa-user-plus"></i>}
                  </Button>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{"Message"}</Tooltip>}
              >
                <Button
                  className={`${btnStyles.Button} ${btnStyles.SocialButton} ${btnStyles.BlackOutline}`}
                  onClick={checkIfChatExists}
                >
                  <i className="fas fa-envelope"></i>
                </Button>
              </OverlayTrigger>
            </>
          )}
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default Profile;