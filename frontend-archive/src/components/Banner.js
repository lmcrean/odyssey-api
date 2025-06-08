import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import styles from "../styles/modules/Banner.module.css";
import Logo from "./Logo";
import SuccessAlert from "./SuccessAlert";

const Banner = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    
    if  (success === 'signin') {
      setSuccessMessage("Sign in successful! Welcome back to Odyssey!");
      setShowSuccessAlert(true);

      // Set a timeout to hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      // Clean up the timer
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <Container
        fluid
        className={`py-4 mb-3 ${styles.Background}`}
        style={{ borderRadius: '20px' }}
        >
      <Row className="align-items-center text-center text-lg-left">
        {showSuccessAlert && (
          <SuccessAlert
            message={successMessage}
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <Col xs={12} lg={4} className="mb-3 mb-lg-0">
          <Logo />
        </Col>
        <Col xs={8} lg={8} className="m-auto">
          <h1 className={`bold ${styles.Title}`}>ODYSSEY</h1>
          <p className={`muted ${styles.SubTitle}`}>
            Discover the power of shared goals. Explore posts, follow popular profiles, and stay connected with the
            community through our messaging feature.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Banner;