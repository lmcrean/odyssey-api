import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from "../../styles/modules/MessageDetailSendForm.module.css";

function MessageDetailSendForm({ setMessages, messages, onMessageSubmit, onMessageSent }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    content: "",
    image: null,
  });
  const { content, image } = formData;
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const imageInput = useRef(null);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrors({});
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({ image: ["Image file size should not exceed 5MB."] });
        setFormData({
          ...formData,
          image: null,
        });
        setImagePreview(null);
        if (imageInput?.current) {
          imageInput.current.value = "";
        }
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrors({ image: ["Only JPEG, PNG, and GIF images are allowed."] });
        setFormData({
          ...formData,
          image: null,
        });
        setImagePreview(null);
        if (imageInput?.current) {
          imageInput.current.value = "";
        }
        return;
      }
      setFormData({
        ...formData,
        image: selectedFile,
      });
      setImagePreview(URL.createObjectURL(selectedFile));
      setErrors({});
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);
    if (imageInput?.current) {
      imageInput.current.value = "";
    }
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (errors.image) {
      return;  // Prevent submission if there's an image error
    }

    if (!content.trim() && !image) {
      setErrors({ general: ["Please enter a message or upload an image."] });
      return;
    }

    if (content.trim().length > 1000) {
      setErrors({ content: ["Message should not exceed 1000 characters."] });
      return;
    }

    const formDataToSend = new FormData();
    if (content.trim()) {
      formDataToSend.append("content", content.trim());
    }
    if (image) {
      formDataToSend.append("image", image);
    }
    
    try {
      const endpoint = `/messages/${id}/send/`;
      const { data } = await axiosReq.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessages(prevMessages => ({
        ...prevMessages,
        results: [...prevMessages.results, data],
      }));

      // Call the onMessageSubmit prop function
      onMessageSubmit(data);

      // Call the new onMessageSent prop function
      onMessageSent();

      setFormData({ content: "", image: null });
      setImagePreview(null);
      if (imageInput?.current) {
        imageInput.current.value = "";
      }
      setErrors({});
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.status === 500) {
          setErrors({ general: ["An unexpected error occurred. Please try again later."] });
        } else {
          setErrors(err.response.data);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        setErrors({ general: ["No response received from the server. Please check your internet connection."] });
      } else {
        console.error("Error setting up request:", err.message);
        setErrors({ general: ["An error occurred while sending your message. Please try again."] });
      }
    }
  };

  return (
    <Container className={styles.MessageSendForm}>
      <Form onSubmit={handleSubmit}>
        {imagePreview && (
          <div className={styles.ImagePreviewContainer}>
            <Image src={imagePreview} alt="Preview" className={styles.ImagePreview} />
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleRemoveImage} 
              className={styles.RemoveImageButton}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        )}
        <Form.Group className={styles.FormGroup}>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={content}
            onChange={handleChange}
            placeholder="Type your message here..."
            className={styles.MessageInput}
          />
        </Form.Group>

        <div className={styles.FormActions}>
          <Button 
            as="label" 
            htmlFor="image-upload" 
            variant="secondary" 
            className={styles.BrowseButton}
          >
            <FontAwesomeIcon icon={faImage} /> Add Image
          </Button>
          <Form.File
            id="image-upload"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            ref={imageInput}
            className={styles.HiddenFileInput}
          />
          <Button 
            variant="primary" 
            type="submit" 
            className={styles.SendButton}
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </div>

        {Object.keys(errors).map((key) => (
          errors[key].map((message, idx) => (
            <Alert variant="warning" key={`${key}-${idx}`}>
              {message}
            </Alert>
          ))
        ))}
      </Form>
    </Container>
  );
}

export default MessageDetailSendForm;