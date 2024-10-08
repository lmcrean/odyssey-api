// src/pages/profiles/Profile.js

import React, { useState } from "react";
import styles from "../../styles/modules/Profile.module.css";
import btnStyles from "../../styles/modules/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Button from "react-bootstrap/Button";
import { useSetProfileData } from "../../contexts/ProfileDataContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Profile = (props) => {
  const { 
    profile, 
    mobile, 
    imageSize = 55, 
    hideOwner = false, 
    hideAvatar = false,
    hideMessage = false,
    hideFollow = false,
    followLabel = "Follow",
    unfollowLabel = "Unfollow",
    messageLabel = "Message",
    showLabels = false
  } = props;
  const { id, following_id, image, owner, user_id } = profile;

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

  const handleMessageClick = () => {
    history.push(`/messages/${user_id}`);
  };

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      {!hideAvatar && (
        <div>
          <Link className="align-self-center" to={`/profiles/${id}`}>
            <Avatar src={image} height={imageSize} />
          </Link>
        </div>
      )}
      {!hideOwner && (
        <div className={`mx-2 ${styles.WordBreak}`}>
          <strong>{owner}</strong>
        </div>
      )}
      <div className={`d-flex flex-column text-center ${!mobile && "ml-auto"}`}>
        {currentUser && !is_owner && !hideFollow && !hideMessage && (
          <>
            <div className="d-flex justify-content-center">
              {!hideFollow && (following_id ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{unfollowLabel}</Tooltip>}
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
                  overlay={<Tooltip>{followLabel}</Tooltip>}
                >
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.SocialButton}`}
                    onClick={handleFollowClick}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : <i className="fas fa-user-plus"></i>}
                  </Button>
                </OverlayTrigger>
              ))}
              {!hideMessage && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{messageLabel}</Tooltip>}
                >
                  <Button
                    className={`${btnStyles.Button} ${btnStyles.SocialButton} ${btnStyles.BlackOutline} ml-2`}
                    onClick={handleMessageClick}
                  >
                    <i className="fas fa-envelope"></i>
                  </Button>
                </OverlayTrigger>
              )}
            </div>
            {showLabels && (
              <div className="mt-2 d-flex justify-content-center">
                {!hideFollow && <div className="m-auto">{following_id ? unfollowLabel : followLabel}</div>}
                {!hideMessage && <div className="m-auto">{messageLabel}</div>}
              </div>
            )}
          </>
        )}
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default Profile;