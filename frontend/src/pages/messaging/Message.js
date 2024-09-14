import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/modules/Message.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MessageDetailDropdown } from "../../components/MoreDropdown";

const Message = (props) => {
  const {
    id,
    sender,
    sender_profile_id,
    sender_profile_image,
    content,
    image,
    date,
    time,
    setMessages,
    showAvatar,
    isPreviousFromSameSender,
  } = props;

  const currentUser = useCurrentUser();
  const [showFullTimestamp, setShowFullTimestamp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
  const [loadingUsername, setLoadingUsername] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const imageInput = useRef(null);

  useEffect(() => {
    setNewContent(content);
  }, [content]);

  useEffect(() => {
    const fetchSenderUsername = async () => {
      if (showAvatar) {
        try {
          const response = await axiosRes.get(`/users/${sender}/`);
          if (response && response.data && response.data.username) {
            setSenderUsername(response.data.username);
            setFetchError(false);
          } else {
            throw new Error('Invalid response data');
          }
        } catch (err) {
          setFetchError(true);
        } finally {
          setLoadingUsername(false);
        }
      }
    };

    fetchSenderUsername();
  }, [sender, showAvatar]);

  const is_sender = currentUser && currentUser.pk && sender_profile_id
    ? currentUser.pk.toString() === sender_profile_id.toString()
    : false;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('content', newContent);
      if (newImage) {
        formData.append('image', newImage);
      }
      const { data } = await axiosRes.patch(`/messages/${id}/update/`, formData);
      setMessages((prevMessages) => ({
        ...prevMessages,
        results: prevMessages.results.map((message) =>
          message.id === id ? { ...message, content: data.content, image: data.image } : message
        ),
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosRes.delete(`/messages/${id}/delete/`);
      setMessages((prevMessages) => ({
        ...prevMessages,
        results: prevMessages.results.filter((message) => message.id !== id),
      }));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      setNewImage(event.target.files[0]);
    }
  };

  const isBegin = !isPreviousFromSameSender;
  const messageClasses = `${styles.Message} ${is_sender ? styles.senderMessage : styles.recipientMessage} ${isBegin ? styles.Begin : ''}`;

  return (
    <div className={messageClasses}>
      <div className={styles.MessageContent}>
        {showAvatar && (
          <Link to={`/profiles/${sender_profile_id}`} className={styles.AvatarLink}>
            <Avatar src={sender_profile_image} height={40} />
            {loadingUsername ? (
              <small className={styles.Username}>Loading...</small>
            ) : fetchError ? (
              <small className={styles.Username}>Failed to load username</small>
            ) : (
              <small className={styles.Username}>{senderUsername}</small>
            )}
          </Link>
        )}
        {isEditing ? (
          <>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className={styles.EditTextarea}
            />
            {(image || newImage) && (
              <figure onClick={() => imageInput.current.click()} className={styles.ImageContainer}>
                <Image src={newImage ? URL.createObjectURL(newImage) : image} alt="Message attachment" fluid className={styles.MessageImage} />
                <div className={styles.ImageOverlay}>
                  <span>Click to change image</span>
                </div>
              </figure>
            )}
            <input
              type="file"
              id="image-upload"
              ref={imageInput}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <div className={styles.EditButtons}>
              <Button onClick={handleSaveEdit} variant="success" size="sm">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p>{content}</p>
            {image && (
              <Image src={image} alt="Message attachment" fluid className={styles.MessageImage} />
            )}
          </>
        )}
        <div className={styles.MessageMeta}>
          <span
            className={styles.Timestamp}
            onMouseEnter={() => setShowFullTimestamp(true)}
            onMouseLeave={() => setShowFullTimestamp(false)}
          >
            {showFullTimestamp ? `${date} ${time}` : time}
          </span>
          {is_sender && (
            <MessageDetailDropdown
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton aria-label="Close modal">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} data-testid="delete-button-modal">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Message;