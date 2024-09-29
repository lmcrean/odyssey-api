import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/modules/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const { post, setPost, setComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});


  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Trim the content and run validation
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      setErrors({ content: ["Comment must not be empty."] });
      return;
    } else if (trimmedContent.length < 3) {
      setErrors({ content: ["Comment must be at least 3 characters long."] });
      return;
    } else if (trimmedContent.length > 1000) {
      setErrors({ content: ["Comment must not exceed 1000 characters."] });
      return;
    } else if (trimmedContent.includes("  ")) {
      setErrors({ content: ["Comment must not contain consecutive spaces."] });
      return;
    }
  
    // Clear errors before submission
    setErrors({});
  
    try {
      const { data } = await axiosRes.post("/comments/", {
        content: trimmedContent,
        post,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };
  

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
            aria-label="Comment content"
          />
        </InputGroup>
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        // Disable button if content is empty
        type="submit"
        aria-label="Post comment"
      >
        post
      </button>
    </Form>
  );
}

export default CommentCreateForm;