import React from 'react';
import Alert from 'react-bootstrap/Alert';

const SuccessAlert = ({ message, onClose }) => (
  <Alert variant="success" dismissible onClose={onClose}>
    {message}
  </Alert>
);

export default SuccessAlert;