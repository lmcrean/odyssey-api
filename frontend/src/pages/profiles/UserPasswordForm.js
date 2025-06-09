import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import btnStyles from "../../styles/modules/Button.module.css";
import appStyles from "../../App.module.css";

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [error, setError] = useState("");
  const [customError, setCustomError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        if (data.id === currentUser?.profile_id) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setCustomError("You are not authorized to change this password.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setIsAuthorized(false);
        setCustomError("An error occurred while verifying your authorization.");
      }
    };
  
    if (currentUser && id) {
      fetchProfileData();
    }
  }, [currentUser, id, isAuthorized]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCustomError("");

    // Client-side validation
    if (new_password1 !== new_password2) {
      setError("Passwords do not match.");
      return;
    }

    if (new_password1.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (/^\d+$/.test(new_password1)) {
      setError("Password cannot be entirely numeric.");
      return;
    }

    if (["password", "12345678", "qwertyuiop"].includes(new_password1.toLowerCase())) {
      setError("This password is too common.");
      return;
    }

    if (new_password1.toLowerCase().includes(currentUser?.username.toLowerCase())) {
      setError("Password cannot be similar to your username.");
      return;
    }

    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      history.goBack();
    } catch (err) {
      setError(err.response?.data?.new_password2?.[0] || "An error occurred. Please try again.");
    }
  };

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
    setError("");
    setCustomError("");
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          {!isAuthorized ? (
            <Alert variant="warning">
              {customError}
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>New password</Form.Label>
                <Form.Control
                  placeholder="new password"
                  type="password"
                  value={new_password1}
                  onChange={handleChange}
                  name="new_password1"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  placeholder="confirm new password"
                  type="password"
                  value={new_password2}
                  onChange={handleChange}
                  name="new_password2"
                />
              </Form.Group>
              {error && <Alert variant="warning">{error}</Alert>}
              {customError && <Alert variant="warning">{customError}</Alert>}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
              >
                save
              </Button>
            </Form>
          )}
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;