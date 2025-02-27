// src/Pages/GuideViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlobalStyle from '../Styles/GlobalStyle';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  orderBy, 
  query,
  updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import Step7 from '../Steps/Step7';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const GuideViewPage = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterStats, setCharacterStats] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null
  const currentUser = auth.currentUser;

  // Fetch guide data once
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guideDoc = await getDoc(doc(db, 'guides', guideId));
        if (guideDoc.exists()) {
          setGuideData({ id: guideDoc.id, ...guideDoc.data() });
        } else {
          console.error('Guide not found');
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [guideId]);

  // Subscribe to comments and store them in state
  useEffect(() => {
    if (!guideId) return;
    const commentsRef = collection(db, 'guides', guideId, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsArray = [];
      snapshot.forEach((doc) => {
        commentsArray.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsArray);
    });
    return () => unsubscribe();
  }, [guideId]);

  const handleSubmitComment = async () => {
    if (!currentUser) {
      alert('Please sign in to comment.');
      return;
    }
    if (!newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }
    try {
      const commentsRef = collection(db, 'guides', guideId, 'comments');
      await addDoc(commentsRef, {
        username: currentUser.displayName || 'Anonymous',
        text: newComment,
        timestamp: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error submitting comment. Please try again.');
    }
  };

  // Handle like/dislike functionality
  const handleVote = async (voteType) => {
    if (!currentUser) {
      alert('Please sign in to vote.');
      return;
    }
    const guideRef = doc(db, 'guides', guideId);
    let newUpVotes = guideData.upVotes || 0;
    let newDownVotes = guideData.downVotes || 0;

    if (userVote === voteType) {
      // Remove vote
      if (voteType === 'like') {
        newUpVotes--;
      } else {
        newDownVotes--;
      }
      setUserVote(null);
    } else if (userVote && userVote !== voteType) {
      // Change vote
      if (userVote === 'like') {
        newUpVotes--;
        newDownVotes++;
      } else {
        newDownVotes--;
        newUpVotes++;
      }
      setUserVote(voteType);
    } else {
      // No previous vote
      if (voteType === 'like') {
        newUpVotes++;
      } else {
        newDownVotes++;
      }
      setUserVote(voteType);
    }
    try {
      await updateDoc(guideRef, {
        upVotes: newUpVotes,
        downVotes: newDownVotes,
      });
      // Optionally update local guideData state to reflect changes immediately:
      setGuideData((prev) => ({
        ...prev,
        upVotes: newUpVotes,
        downVotes: newDownVotes,
      }));
    } catch (error) {
      console.error('Error updating vote:', error);
      alert('Error processing vote. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!guideData) return <p>Guide not found.</p>;

  // Inline style for like/dislike buttons
  const iconButtonStyle = {
    background: '#2f2f2f',
    border: 'none',
    color: '#FFD700',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ background: '#000', minHeight: '100vh' }}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1200px',
            padding: '2rem',
            background: '#111',
            color: '#FFD700',
            minHeight: '100vh'
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#555',
              color: '#FFD700',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back to Guides
          </button>

          {/* Like/Dislike Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button style={iconButtonStyle} onClick={() => handleVote('like')}>
              <FaThumbsUp /> {guideData.upVotes || 0}
            </button>
            <button style={iconButtonStyle} onClick={() => handleVote('dislike')}>
              <FaThumbsDown /> {guideData.downVotes || 0}
            </button>
          </div>

          <Step7 
            guideData={guideData} 
            characterStats={characterStats} 
            hideBottomButtons={true} 
          />

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ textAlign: 'center' }}>Add a Comment</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  width: '80%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #333',
                  marginRight: '0.5rem',
                  background: '#222',
                  color: '#FFD700'
                }}
              />
              <button
                onClick={handleSubmitComment}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  background: '#4CAF50',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
            </div>

            {/* Display comments */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ textAlign: 'center' }}>Comments ({comments.length})</h3>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      borderTop: '1px solid #FFD700',
                      padding: '0.5rem 0',
                      marginTop: '0.5rem'
                    }}
                  >
                    <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                      {comment.username || 'Anonymous'}
                      <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', color: '#ccc' }}>
                        {comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : ''}
                      </span>
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'gray' }}>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideViewPage;
