import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/modules/SignInUpForm.module.css";
import btnStyles from "../../styles/modules/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";
import SuccessAlert from "../../components/SuccessAlert";


function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();
  const location = useLocation();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    if (success === 'signup') {
      setSuccessMessage("Sign up successful! Please sign in with your new account.");
      setShowSuccessAlert(true);
      
      // Set a timeout to hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      // Clean up the timer
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
    // Clear the specific error when user starts typing
    if (errors[event.target.name]) {
      setErrors({
        ...errors,
        [event.target.name]: null,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
  
    // Check for empty fields
    if (!username.trim()) newErrors.username = "Username may not be blank.";
    if (!password) newErrors.password = "Password may not be blank.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      try {
        setTokenTimestamp(data);
      } catch (tokenError) {
        
        // Continue with the sign-in process even if setting the timestamp fails
      }
      setCurrentUser(data.user);
      
      history.push("/?success=signin");
    } catch (err) {
      if (err.response?.status === 400) {
        // Check the error message to determine if it's an invalid username or password
        const errorMessage = err.response?.data?.non_field_errors?.[0] || "";
        if (errorMessage.toLowerCase().includes("username")) {
          setErrors({ username: "Invalid username." });
        } else if (errorMessage.toLowerCase().includes("password")) {
          setErrors({ password: "Invalid password." });
        } else {
          setErrors({ non_field_errors: ["Unable to log in with provided credentials."] });
        }
      } else {
        setErrors({ non_field_errors: ["An error occurred. Please try again."] });
      }
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2 m-auto" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          {showSuccessAlert && (
            <SuccessAlert
              message={successMessage}
              onClose={() => setShowSuccessAlert(false)}
            />
          )}
          <h1 className={styles.Header}>Sign in</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
                autoComplete="username"
              />
            </Form.Group>
            {errors.username && (
              <Alert variant="warning">
                {errors.username}
              </Alert>
            )}
  
            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Form.Group>
            {errors.password && (
              <Alert variant="warning">
                {errors.password}
              </Alert>
            )}
            
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign in
            </Button>
            
            {errors.non_field_errors && (
              <Alert variant="warning" className="mt-3">
                {errors.non_field_errors}
              </Alert>
            )}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
}

export default SignInForm;