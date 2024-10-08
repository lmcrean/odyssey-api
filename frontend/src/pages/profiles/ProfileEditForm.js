import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/modules/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    content: "",
    image: "",
  });
  const { name, content, image } = profileData;

  const [error, setError] = useState("");
  const [customError, setCustomError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        if (data.id === currentUser?.profile_id) {
          setIsAuthorized(true);
          setProfileData({ name: data.name, content: data.content, image: data.image });
        } else {
          setIsAuthorized(false);
          setCustomError("You are not authorized to edit this profile.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setIsAuthorized(false);
        setCustomError("An error occurred while verifying your authorization. Please check you are logged in as the correct user.");
      }
    };
  
    if (currentUser && id) {
      fetchProfileData();
    }
  }, [currentUser, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  
    setError("");
    setCustomError("");
  
    // Validate bio content
    if (name === 'content') {
      if (value.length > 1000) {
        setError("Bio content cannot exceed 1000 characters.");
      } else if (value.trim() === "") {
        setError("Bio content cannot be empty or contain only spaces.");
      } else if (value.startsWith("    ")) {
        setError("Bio content cannot start with more than three spaces.");
      }
    }
  };
  
  const handleImageChange = (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      
      // Validate image file
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload a valid image.");
      } else if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("The image file is too large. Maximum size is 2MB.");
      } else {
        setProfileData({
          ...profileData,
          image: URL.createObjectURL(file),
        });
        setError("");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCustomError("");
  
    // Client-side validation for bio length
    if (content.length > 1000) {
      setError("Bio content cannot exceed 1000 characters.");
      return;  // Prevent form submission
    }

    if (content.trim() === "") {
      setError("Bio content cannot be empty.");
      return;  // Prevent form submission
    }

    if (content.includes("   ")) {
      setError("Bio content cannot contain more than 2 spaces in a row.");
      return;  // Prevent form submission
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
  
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }
  
    try {
      const { data } = await axiosRes.put(`/profiles/${id}/`, formData);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.status === 400) {
        // Handle specific validation errors
        const errorData = err.response.data;
        if (errorData.content) {
          setError(errorData.content[0]);
        } else if (errorData.image) {
          setError(errorData.image[0]);
        } else {
          setError("Validation error. Please check your inputs.");
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setCustomError("You don't have permission to perform this action.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={content}
          onChange={handleChange}
          name="content"
          rows={7}
        />
      </Form.Group>

      {error && <Alert variant="warning">{error}</Alert>}
      {customError && <Alert variant="warning">{customError}</Alert>}
      <Button
        className={`${btnStyles.Button} btn-secondary`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            {!isAuthorized ? (
              <Alert variant="warning">
                {customError}
              </Alert>
            ) : (
              <>
                <Form.Group>
                  {image && (
                    <figure>
                      <Image src={image} fluid />
                    </figure>
                  )}
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                  <Form.File
                    id="image-upload"
                    ref={imageFile}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
                <div className="d-md-none">{textFields}</div>
              </>
            )}
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;