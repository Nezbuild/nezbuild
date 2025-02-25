// src/Pages/GuideViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlobalStyle from '../Styles/GlobalStyle';
import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Step7 from '../Steps/Step7';

const GuideViewPage = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterStats, setCharacterStats] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const currentUser = auth.currentUser;

  // Fetch the guide data
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

  // Subscribe to comments from the guide's subcollection
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

  if (loading) return <p>Loading...</p>;
  if (!guideData) return <p>Guide not found.</p>;

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
          {/* Back Button */}
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

          {/* Render the guide preview (Step7) in read-only mode */}
          <Step7 guideData={guideData} characterStats={characterStats} readOnly={true} />

          {/* Comment Form */}
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
            {/* Optionally, you can render comments here, but if Step7 already displays comments, this may be redundant. */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideViewPage;
