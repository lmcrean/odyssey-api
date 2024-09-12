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

function MessageDetailSendForm({ setMessages }) {
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
  
    const formDataToSend = new FormData();
    formDataToSend.append("content", content);
    if (image) {
      formDataToSend.append("image", image);
    }
    
    try {
      const { data } = await axiosReq.post(`/messages/${id}/send/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log('Message sent successfully:', data);
  
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
      setErrors(err.response?.data || {});
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