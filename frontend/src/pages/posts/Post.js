// src/pages/posts/Post.js

import React, { useState } from "react";
import styles from "../../styles/modules/Post.module.css";
import animationStyles from "../../styles/modules/animations/LikeAnimation.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { usePostCache } from '../../contexts/PostCacheContext';

import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { useAnimationLoading } from '../../contexts/AnimationLoadingContext';


const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const { cachePost } = usePostCache();

  const [isLiking, setIsLiking] = useState(false);
  const [isUnliking, setIsUnliking] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const { isAnimationLoaded, loadingProgress } = useAnimationLoading();


  const handlePostClick = () => {
    cachePost(props);
    
    history.push(`/posts/${id}`);
  };

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.push('/');
    } catch (err) {
      
    }
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      setShowOverlay(true);
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
      setTimeout(() => {
        setIsLiking(false);
        setShowOverlay(false);
      }, 800);
    } catch (err) {
      
    }
  };

  const handleUnlike = async () => {
    try {
      setIsUnliking(true);
      setShowOverlay(true);
      if (!currentUser) {
        // If there's no current user, they're not authorized to unlike
        return;
      }
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
      setTimeout(() => {
        setIsUnliking(false);
        setShowOverlay(false);
      }, 800);
    } catch (err) {
      
    }
  };

  return (
    <Card className={styles.Post} data-testid="post-item">
      {!isAnimationLoaded && (
        <div className={styles.loadingNotice}>
          Loading animations: {Math.round(loadingProgress)}%
        </div>
      )}
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span className={styles.Date}>{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`} onClick={handlePostClick}>
        <div className={`${animationStyles.postImageWrapper} ${showOverlay && isAnimationLoaded ? animationStyles.showOverlay : ''}`}>
          <Card.Img className={styles.PostImage} src={image} alt={title} />
          {isAnimationLoaded && (
            <FontAwesomeIcon 
              icon={solidHeart} 
              className={`${animationStyles.likeIcon} ${isLiking ? animationStyles.likeAnimation : ''} ${isUnliking ? animationStyles.unlikeAnimation : ''}`} 
            />
          )}
        </div>
      </Link>
      <Card.Body>
        {title && <Card.Title className={styles.PostTitle}>{title}</Card.Title>}
        {content && <Card.Text className={styles.PostText}>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id && currentUser ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;