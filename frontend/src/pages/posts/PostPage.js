import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
// import { usePostCache } from '../../contexts/PostCacheContext';
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import PostSkeleton from "../../components/PostSkeleton";
import CommentSkeleton from "../../components/CommentSkeleton";

function PostPage() {
  const { id } = useParams();
  // PostCacheContext and it's usage are working
  // however temporarily commented out in order to clear console.log errors caused by excessive network requests.
  // const location = useLocation();
  // const { cachedPosts, cachePost } = usePostCache();
  // const [post, setPost] = useState(() => {
  //   return cachedPosts[id] ? { results: [cachedPosts[id]] } : null;
  // });
  const [post, setPost] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const [{ data: fetchedPost }, { data: commentsData }] = await Promise.all([
          axiosReq.get(`/posts/${id}/`),
          axiosReq.get(`/comments/?post=${id}`)
        ]);
        setPost({ results: [fetchedPost] });
        setComments(commentsData);
        // cachePost(fetchedPost);
        setCommentsLoading(false);
      } catch (err) {
        console.log(err);
        setCommentsLoading(false);
      }
    };
    fetchPostData()
    // PostCacheContext commented out for now
    // if (!post || location.state?.fromEdit) {
    //   fetchPostData();
    // } else {
    //   // If we have cached post data and not coming from edit, just fetch comments
    //   const fetchComments = async () => {
    //     try {
    //       const { data: commentsData } = await axiosReq.get(`/comments/?post=${id}`);
    //       setComments(commentsData);
    //       setCommentsLoading(false);
    //     } catch (err) {
    //       console.log(err);
    //       setCommentsLoading(false);
    //     }
    //   };
    //   fetchComments();
    // }
    // // Clear the fromEdit state after using it
    // if (location.state?.fromEdit) {
    //   window.history.replaceState({}, document.title)
    // }
  }, [id]);

  
  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {post ? (
          <Post {...post.results[0]} setPosts={setPost} postPage />
        ) : (
          <PostSkeleton />
        )}
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {commentsLoading ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostPage;