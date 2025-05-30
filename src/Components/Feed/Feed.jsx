import { useState, useContext } from 'react';
import styles from './Feed.module.css';
import { UserContext } from '../../Services/userContext';

const Feed = () => {
  const { user } = useContext(UserContext) || { user: { name: 'Anonymous' } };
  const [posts, setPosts] = useState([
    // Example post for demonstration
    // { id: 1, name: 'Alice', text: 'Welcome to TSUlink!', comments: [{ name: 'Bob', text: 'Nice post!' }] }
  ]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const handleAddPost = () => {
    if (newPost.trim()) {
      setPosts([{ id: Date.now(), name: user?.name || 'Anonymous', text: newPost, comments: [] }, ...posts]);
      setNewPost('');
    }
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (commentText && commentText.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, { name: user?.name || 'Anonymous', text: commentText }],
              }
            : post
        )
      );
      setCommentInputs({ ...commentInputs, [postId]: '' });
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
