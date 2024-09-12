import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import styles from "../styles/modules/Banner.module.css";

const Banner = () => {
  return (
    <Container
        fluid
        className={`py-4 mb-3 ${styles.Background}`}
        style={{ borderRadius: '20px' }}
        >
      <Row className="align-items-center text-center text-lg-left">
        <Col xs={12} lg={6} className="mb-3 mb-lg-0">
          <Image
            src="https://res.cloudinary.com/dh5lpihx1/image/upload/v1724521404/media/images/logo_mainpage.png"
            alt="Website Logo"
            fluid
            className="w-100 green-filter"
          />
        </Col>
        <Col xs={12} lg={6}>
          <h1 className="bold">Discover the power of shared goals</h1>
          <p className="text-muted">
            Explore posts, follow popular profiles, and stay connected with the
            community through our messaging feature.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Banner;