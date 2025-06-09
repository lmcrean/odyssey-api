import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/modules/MessageDetailHeader.module.css";

const MessageDetailHeader = ({ recipientUsername, onDeleteClick }) => {
  return (
    <Row className={`${styles.MessageDetailHeader} py-2`}>
      <Col xs={12} md={6}>
        <h2>Chat with {recipientUsername}</h2>
      </Col>
      <Col xs={12} md={6} className="d-flex justify-content-end align-items-center">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Back to Messages</Tooltip>}
        >
          <Link to="/messages">
            <Button variant="secondary" className={`${styles.IconButton} mr-2`}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Delete Chat</Tooltip>}
        >
          <Button variant="secondary" className={styles.IconButton} onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default MessageDetailHeader;