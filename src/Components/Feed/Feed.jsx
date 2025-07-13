import { useState, useContext, useEffect } from 'react';
import styles from './Feed.module.css';
import { UserContext } from '../../Services/userContext';
import { useNotificationPopup } from '../../Services/notificationPopupProvider';
import {
  getFeed,
  postApproveFeed,
  deleteFeed,
  postFeed,
  postFeedComment,
  deleteFeedComment,
} from '../../Services/common';
import Loader from '../../Components/loader/Loader';
import { useTranslation } from 'react-i18next';

const Feed = () => {
  const [t] = useTranslation();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [addingPost, setAddingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [addingCommentId, setAddingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [approvingPostId, setApprovingPostId] = useState(null);
  const { logout } = useContext(UserContext);
  const { showSnackNotificationPopup } = useNotificationPopup();

  useEffect(() => {
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddPost = () => {
    if (newPost.trim()) {
      setAddingPost(true);
      postFeed(newPost)
        .then((res) => {
          console.log(res);
          setNewPost('');
          setPosts([
            {
              id: res.id,
              name: res.name,
              text: res.text,
              comments: [],
              canDelete: res.canDelete,
              status: res.status,
              isApproved: res.isApproved,
            },
            ...posts,
          ]);
        })
        .catch((error) => {
          if (error.message === 'UNAUTHORIZED') {
            logout();
          } else {
            showSnackNotificationPopup({ status: 'FAILED', text: error.message });
          }
        })
        .finally(() => {
          setAddingPost(false);
        });
    }
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (commentText && commentText.trim()) {
      setAddingCommentId(postId);
      postFeedComment(postId, commentText)
        .then((res) => {
          console.log(res);
          setCommentInputs({ ...commentInputs, [postId]: '' });
          setPosts(
            posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: [
                      ...post.comments,
                      { name: res.name, text: res.text, id: res.id, canDelete: res.canDelete },
                    ],
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
        })
        .finally(() => {
          setAddingCommentId(null);
        });
    }
  };

  const handleDeletePost = (postId) => {
    setDeletingPostId(postId);
    deleteFeed(postId)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      })
      .finally(() => {
        setDeletingPostId(null);
      });
  };

  const handleApprovePost = (postId) => {
    setApprovingPostId(postId);
    postApproveFeed(postId)
      .then(() => {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, isApproved: true, status: 'approved' } : post)));
      })
      .catch((error) => {
        if (error.message === 'UNAUTHORIZED') {
          logout();
        } else {
          showSnackNotificationPopup({ status: 'FAILED', text: error.message });
        }
      })
      .finally(() => {
        setApprovingPostId(null);
      });
  };

  const handleDeleteComment = (postId, commentId) => {
    setDeletingCommentId(commentId);
    deleteFeedComment(commentId)
      .then(() => {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter((comment) => comment.id !== commentId),
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
      })
      .finally(() => {
        setDeletingCommentId(null);
      });
  };

  return (
    <div className={styles.feedContainer}>
      <div className={styles.newPostSection}>
        <textarea
          className={styles.textarea}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={t('feed.write.something')}
        />
        <button className={styles.addButton} onClick={handleAddPost} disabled={addingPost}>
          {addingPost && <span className={styles.downloadSpinner}></span>}
          {addingPost ? t('feed.posting') : t('feed.post')}
        </button>
      </div>
      <div className={styles.postsSection}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {posts.length === 0 && <div className={styles.placeholder}>{t('feed.no.posts')}</div>}
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${styles.postItem} ${
                  post.status === 'pending' || post.isApproved === false ? styles.pending : ''
                }`}
              >
                <div className={styles.postHeader}>
                  <strong>{post.name}</strong>
                  {post.canDelete && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                    >
                      {deletingPostId === post.id && <span className={styles.downloadSpinner}></span>}
                      {t('delete')}
                    </button>
                  )}
                  {post.isApproved === false && (
                    <button
                      className={styles.approveButton}
                      onClick={() => handleApprovePost(post.id)}
                      disabled={approvingPostId === post.id}
                    >
                      {approvingPostId === post.id && <span className={styles.downloadSpinner}></span>}
                      {t('approve')}
                    </button>
                  )}
                </div>
                <div className={styles.postText}>
                  {post.text}
                  {(post.status === 'pending' || post.isApproved === false) && (
                    <div className={styles.pendingText}>{t('waiting.admin.approval')}</div>
                  )}
                </div>
                <div className={styles.commentsSection}>
                  <ul className={styles.commentList}>
                    {post.comments.map((comment) => (
                      <li key={comment.id} className={styles.commentItem}>
                        <strong>{comment.name}:</strong> {comment.text}
                        {comment.canDelete && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            disabled={deletingCommentId === comment.id}
                          >
                            {deletingCommentId === comment.id && <span className={styles.downloadSpinner}></span>}
                            {t('delete')}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.newComment}>
                    <input
                      className={styles.commentInput}
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => handleCommentInput(post.id, e.target.value)}
                      placeholder={t('feed.write.comment')}
                    />
                    <button
                      className={styles.addCommentButton}
                      onClick={() => handleAddComment(post.id)}
                      disabled={addingCommentId === post.id}
                    >
                      {addingCommentId === post.id && <span className={styles.downloadSpinner}></span>}
                      {t('feed.comment')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
