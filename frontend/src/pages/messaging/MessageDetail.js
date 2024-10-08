import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Message from "./Message";
import MessageDetailSendForm from "./MessageDetailSendForm";
import MessageDetailHeader from "./MessageDetailHeader";
import styles from "../../styles/modules/MessageDetail.module.css";
import MessageDetailSkeleton from "../../components/MessageDetailsSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../../hooks/useWindowSize";

function MessageDetail() {
  const { id: user_id } = useParams();
  const history = useHistory();
  const [recipientUsername, setRecipientUsername] = useState("");
  const [messages, setMessages] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const size = useWindowSize();

  useEffect(() => {
    const fetchOrCreateChat = async () => {
      try {
        const { data } = await axiosReq.get(`/messages/${user_id}/`);
        setMessages({ results: data.results });
        setHasLoaded(true);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          try {
            const { data } = await axiosReq.post(`/messages/${user_id}/start/`, { content: "Chat started" });
            setMessages({ results: [data] });
          } catch (createErr) {
            console.error("Failed to create new chat:", createErr);
          }
        } else {
          console.error("Failed to fetch messages:", err);
        }
        setHasLoaded(true);
      }
    };

    fetchOrCreateChat();
  }, [user_id]);

  useEffect(() => {
    const fetchRecipientUsername = async () => {
      try {
        const { data } = await axiosReq.get(`/users/${user_id}/`);
        setRecipientUsername(data.username);
      } catch (err) {
        console.error("Failed to fetch recipient username:", err);
        setRecipientUsername("Unknown user");
      }
    };
  
    fetchRecipientUsername();
  }, [user_id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (hasLoaded && messages.results.length > 0) {
      scrollToBottom();
    }
  }, [hasLoaded, messages.results]);

  const handleDeleteChat = async () => {
    try {
      await axiosRes.delete(`/chats/${user_id}/delete/`);
      history.push('/messages');
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((message) => {
      const date = message.date;
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(messages.results);

  return (
    <Container className={styles.MessageDetail}>
      <MessageDetailHeader 
        recipientUsername={recipientUsername} 
        onDeleteClick={handleShowModal}
      />
      <Row className={styles.MessageDetailContainerRow}>
        <Col className="py-2 p-0 p-lg-2" lg={8}>
          {hasLoaded ? (
            <>
              {messages.results.length ? (
                <InfiniteScroll
                  children={Object.entries(groupedMessages).map(([date, msgs]) => {
                    return (
                      <div key={date}>
                        <div className={`${styles.DateSeparator} d-flex align-items-center justify-content-center`}>
                          <span className={styles.DateBubble}>{date}</span>
                        </div>
                        {msgs.map((message, index) => {
                          const isPreviousFromSameSender = index > 0 && messages.results[index - 1].sender === message.sender;
                          const isBegin = !isPreviousFromSameSender;
                          return (
                            <div key={message.id} className={`${styles.MessageWrapper} ${message.is_sender ? styles.SenderWrapper : styles.RecipientWrapper}`}>
                              <Message
                                key={message.id}
                                {...message}
                                sender={message.sender} 
                                sender_profile_id={message.sender}
                                recipient={message.recipient}
                                recipientUsername={recipientUsername}
                                showAvatar={!isPreviousFromSameSender}
                                isPreviousFromSameSender={isPreviousFromSameSender}
                                setMessages={setMessages}
                              />
                              <div className={`${styles.MessageTriangle} ${message.is_sender ? styles.SenderMessage : styles.RecipientMessage}`} style={{ display: isBegin ? 'block' : 'none' }}></div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  dataLength={messages.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!messages.next}
                  next={() => fetchMoreData(messages, setMessages)}
                />
              ) : (
                <Container className={styles.Content}>
                  <Asset message={`Start a conversation with ${recipientUsername}`} />
                </Container>
              )}
            </>
          ) : (
            <MessageDetailSkeleton />
          )}
          <div ref={messagesEndRef} />
        </Col>
      </Row>
      <Container className={styles.FormContainer}>
        <MessageDetailSendForm 
          messages={messages} 
          setMessages={setMessages} 
          recipientUsername={recipientUsername} 
          user_id={user_id}
          onMessageSubmit={(data) => {/* Handle message submit if needed */}}
          onMessageSent={scrollToBottom}
        />
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this chat?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteChat}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {showScrollButton && (
        <Button
          className={`${styles.ScrollToBottomButton} ${size.width <= 768 ? styles.MobileButton : styles.DesktopButton}`}
          onClick={scrollToBottom}
          variant="secondary"
          ref={(button) => {
            if (button && hasLoaded && !showScrollButton) {
              button.click();
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      )}
    </Container>
  );
}

export default MessageDetail;