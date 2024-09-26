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

function MessageDetailSendForm({ setMessages, messages }) {
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
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      const selectedFile = event.target.files[0];
      setFormData({
        ...formData,
        image: selectedFile,
      });
      setImagePreview(URL.createObjectURL(selectedFile));
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
  
    const formDataToSend = new FormData();
    formDataToSend.append("content", content);
    if (image) {
      formDataToSend.append("image", image);
    }
    
    try {
      console.log("Sending message to user ID:", id);
      console.log("Form data:", Object.fromEntries(formDataToSend));
  
      const endpoint = `/messages/${id}/send/`;
  
      const { data } = await axiosReq.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Message sent, response:", data);
      
      setMessages(prevMessages => ({
        ...prevMessages,
        results: [...prevMessages.results, data],
      }));
  
      setFormData({ content: "", image: null });
      setImagePreview(null);
      if (imageInput?.current) {
        imageInput.current.value = "";
      }
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
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInput}
            className={styles.HiddenFileInput}
          />
          <Button variant="primary" type="submit" className={styles.SendButton}>
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </div>

        {errors?.general?.map((message, idx) => (
          <Alert variant="danger" key={idx}>
            {message}
          </Alert>
        ))}
        {errors?.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
        {errors?.image?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form>
    </Container>
  );
}

export default MessageDetailSendForm;