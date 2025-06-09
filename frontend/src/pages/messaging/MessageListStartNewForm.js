// src/pages/messaging/MessageListStartNewForm.js

// currently in testing

// This component provides a form to start a new chat by entering a message. It sends a POST request to initiate the chat and redirects to the new chat's detail page.

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";

function MessageListStartNewForm() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    content: "",
  });
  const [recipientUsername, setRecipientUsername] = useState("");
  const { content } = formData;
  const history = useHistory();
  const { id } = useParams(); // Get the recipient ID from the URL

  useEffect(() => {
    // Fetch recipient username. Tested as WORKING. Do not change.
    const fetchRecipientUsername = async () => {
      try {
        const response = await axiosReq.get(`/users/${id}/`);
        setRecipientUsername(response.data.username);
      } catch (err) {
        setErrors(err.response?.data);
      }
    };

    fetchRecipientUsername();
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.post(`/messages/${id}/start/`, { content });
      history.push(`/messages/${id}/`); // Redirect to the message detail page for the recipient.
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <div>
      <h2>Start new chat with {recipientUsername}</h2>
      {errors?.recipient && <Alert variant="danger">User not found or you cannot message this user.</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={content}
            onChange={handleChange}
          />
        </Form.Group>
        {errors?.content?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <Button type="submit">Send</Button>
      </Form>
    </div>
  );
}

export default MessageListStartNewForm;
