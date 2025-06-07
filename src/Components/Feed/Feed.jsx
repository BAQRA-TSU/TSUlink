import { useState, useContext, useEffect } from 'react';
import styles from './Feed.module.css';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';
import { getFeed, postFeed, postFeedComment } from '../../Services/common';

const Feed = () => {
  const [posts, setPosts] = useState([
    // Example post for demonstration
    // { id: 1, name: 'Alice', text: 'Welcome to TSUlink!', comments: [{ name: 'Bob', text: 'Nice post!' }] }
  ]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  useEffect(() => {
    getFeed(0, 10)
      .then((res) => {
        setPosts(res);
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      });
  }, []);

  const handleAddPost = () => {
    if (newPost.trim()) {
      postFeed(newPost)
        .then((res) => {
          console.log(res);
          setNewPost('');
          setPosts([{ id: Date.now(), name: res.name, text: res.content, comments: [] }, ...posts]);
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        });
    }

    // if (newPost.trim()) {
    //   setPosts([{ id: Date.now(), name: user?.name || 'Anonymous', text: newPost, comments: [] }, ...posts]);
    // }
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (commentText && commentText.trim()) {
      postFeedComment(postId, commentText)
        .then((res) => {
          console.log(res);
          setCommentInputs({ ...commentInputs, [postId]: '' });
          setPosts(
            posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: [...post.comments, { name: res.name, text: res.text }],
                  }
                : post
            )
          );
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        });
    }
  };

  return (
    <div className={styles.feedContainer}>
      <div className={styles.newPostSection}>
        <textarea
          className={styles.textarea}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write something..."
        />
        <button className={styles.addButton} onClick={handleAddPost}>
          Post
        </button>
      </div>
      <div className={styles.postsSection}>
        {posts.length === 0 && <div className={styles.placeholder}>No posts yet. Be the first to post!</div>}
        {posts.map((post) => (
          <div key={post.id} className={styles.postItem}>
            <div className={styles.postHeader}>
              <strong>{post.name}</strong>
            </div>
            <div className={styles.postText}>{post.text}</div>
            <div className={styles.commentsSection}>
              <ul className={styles.commentList}>
                {post.comments.map((comment, idx) => (
                  <li key={idx} className={styles.commentItem}>
                    <strong>{comment.name}:</strong> {comment.text}
                  </li>
                ))}
              </ul>
              <div className={styles.newComment}>
                <input
                  className={styles.commentInput}
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => handleCommentInput(post.id, e.target.value)}
                  placeholder="Write a comment..."
                />
                <button className={styles.addCommentButton} onClick={() => handleAddComment(post.id)}>
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
