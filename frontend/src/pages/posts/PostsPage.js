import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Post from "./Post";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/modules/PostsPage.module.css";
import { useLocation, useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Banner from "../../components/Banner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { InputGroup } from "react-bootstrap";

function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const history = useHistory();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === "for-you") {
      history.push("/");
    } else if (tab === "following") {
      history.push("/feed");
    } else if (tab === "liked") {
      history.push("/liked");
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={7} xl={8}>
        <Banner />
        <PopularProfiles mobile />
        {currentUser && (
          <ButtonGroup className={`${styles.FeedSwitch} w-100 mb-3`}>
          <Button
              variant={pathname === "/" ? "primary" : "secondary"}
              onClick={() => handleTabChange("for-you")}
            >
              For You
            </Button>
            <Button
              variant={pathname === "/feed" ? "primary" : "secondary"}
              onClick={() => handleTabChange("following")}
            >
              Following
            </Button>
            <Button
              variant={pathname === "/liked" ? "primary" : "secondary"}
              onClick={() => handleTabChange("liked")}
            >
              Liked
            </Button>
          </ButtonGroup>
        )}
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              className="mr-sm-2"
              placeholder="Search posts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </Form>

        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={5} xl={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
      {showBackToTop && (
        <Button
          className={styles.BackToTopButton}
          onClick={handleBackToTop}
          variant="secondary"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      )}
    </Row>
  );
}

export default PostsPage;