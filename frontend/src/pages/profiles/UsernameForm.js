import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/modules/Button.module.css";
import appStyles from "../../App.module.css";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [customError, setCustomError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        if (data.user_id === currentUser?.pk) {
          setIsAuthorized(true);
          setUsername(currentUser?.username || "");
        } else {
          setIsAuthorized(false);
          setCustomError("You are not authorized to change this username.");
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
  }, [currentUser, isAuthorized, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    setCustomError("");

    if (!username.trim()) {
      setError("Username cannot be empty.");
      setIsLoading(false);
      return;
    }

    if (username === currentUser?.username) {
      setError("New username must be different from the current one.");
      setIsLoading(false);
      return;
    }

    if (username.length < 3 || username.length > 150) {
      setError("Username must be between 3 and 150 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const checkResponse = await axiosReq.get(`/users/?username=${username}`);
      if (checkResponse.data.length > 0) {
        setError("This username is already taken. Please choose another.");
        setIsLoading(false);
        return;
      }
      const response = await axiosRes.put("/dj-rest-auth/user/", { username });
      if (response.status === 200) {
        setCurrentUser((prevUser) => ({
          ...prevUser,
          username,
        }));
        history.goBack();
      }
    } catch (err) {
      console.error("Error updating username:", err);
      setError(err.response?.data?.username?.[0] || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
    setError("");
    setCustomError("")
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
            <Form onSubmit={handleSubmit} className="my-2">
              <Form.Group>
                <Form.Label>Change username</Form.Label>
                <Form.Control
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {error && (
                <Alert variant="warning">
                  {error}
                </Alert>
              )}
              {customError && (
                <Alert variant="warning">
                  {customError}
                </Alert>
              )}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
              >
                cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Form>
          )}
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;