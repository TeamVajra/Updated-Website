import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, getDoc, onSnapshot, setDoc, runTransaction, addDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import DroneLoader from '../components/ui/DroneLoader';
import FadeIn from '../components/FadeIn';
import ScrollZoomCard from '../components/ScrollZoomCard';
import './Blog.css';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const encodeEmail = (e) => encodeURIComponent(e).replace(/\./g, '%2E');

const BlogCard = ({ blog, id, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const slug = blog.slug || id;
  const likesDocRef = doc(db, "blogMeta", slug);
  const userLikesRef = user?.email ? doc(db, "blogMeta", slug, "userLikes", encodeEmail(user.email)) : null;
  const commentsColRef = collection(db, "blogComments_" + slug);

  useEffect(() => {
    // Listen for likes
    const unsubscribeLikes = onSnapshot(likesDocRef, (s) => {
      if (s.exists()) {
        setLikeCount(s.data().count || 0);
      }
    });

    // Listen for comments
    const qComments = query(commentsColRef, orderBy('time', 'asc'));
    const unsubscribeComments = onSnapshot(qComments, (snapshot) => {
      const comms = [];
      snapshot.forEach(ds => {
        comms.push({ id: ds.id, ...ds.data() });
      });
      setComments(comms);
    });

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [slug]);

  useEffect(() => {
    // Check if current user liked
    const checkLike = async () => {
      if (user?.email && userLikesRef) {
        const s = await getDoc(userLikesRef);
        setIsLiked(s.exists());
      } else {
        setIsLiked(false);
      }
    };
    checkLike();
  }, [user, slug]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    let currentUser = user;
    if (!currentUser) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        currentUser = res.user;
      } catch (err) {
        console.error('Sign in failed', err);
        return;
      }
    }

    if (!currentUser?.email) return;

    const uid = encodeEmail(currentUser.email);
    const uRef = doc(db, "blogMeta", slug, "userLikes", uid);

    try {
      await runTransaction(db, async (tx) => {
        const metaSnap = await tx.get(likesDocRef);
        if (!metaSnap.exists()) tx.set(likesDocRef, { count: 0 });
        const userSnap = await tx.get(uRef);
        const currentCount = metaSnap.exists() ? (metaSnap.data().count || 0) : 0;

        if (userSnap.exists()) {
          tx.update(likesDocRef, { count: Math.max(0, currentCount - 1) });
          tx.delete(uRef);
        } else {
          tx.update(likesDocRef, { count: currentCount + 1 });
          tx.set(uRef, { email: currentUser.email, name: currentUser.displayName, time: Date.now() });
        }
      });
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Toggle like error', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    let currentUser = user;
    if (!currentUser) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        currentUser = res.user;
      } catch (err) {
        console.error('Sign in failed', err);
        return;
      }
    }

    if (!currentUser?.email) return;

    try {
      await addDoc(commentsColRef, {
        author: currentUser.displayName || 'Anonymous',
        email: currentUser.email,
        text: newComment.trim(),
        time: Date.now()
      });
      setNewComment('');
    } catch (err) {
      console.error('Post comment error:', err);
    }
  };

  const sharePost = (e) => {
    e.stopPropagation();
    const url = window.location.origin + window.location.pathname + '#' + slug;
    if (navigator.share) {
      navigator.share({ title: "Team Vajra Blog", text: "Check out this blog", url }).catch(() => {});
    } else {
      alert(`Share this link: ${url}`);
    }
  };

  return (
    <div className="featured-block" id={slug}>
      <section className="featured-card" onClick={() => setIsExpanded(true)}>
        <div className="featured-image">
          <img src={blog.featuredImage || '/assets/blog-bg-drones.jpg'} alt={blog.title} />
        </div>
        <div className="featured-content">
          <div>
            <div className="featured-meta">{formatDate(blog.publishedAt)} · {blog.category || 'General'}</div>
            <div className="featured-title"><span>{blog.title || 'Untitled'}</span></div>
            <p className="featured-excerpt">{blog.excerpt || ''}</p>
            <div className="article-byline">
              <span className="by-prefix">~By</span>
              <a className="by-author" href={blog.authorLinkedIn || '#'} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                <h2>{blog.authorName || 'Team Vajra'}</h2>
              </a>
            </div>
          </div>
          <div className="card-bottom">
            <div>
              <div className="like-count-card"><span className="like-count">{likeCount}</span> likes</div>
              <div className="card-actions">
                <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike}>❤️ Like</button>
                <button className="share-link" onClick={sharePost}>Share</button>
                <button className="comment-link" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>Post a Comment</button>
              </div>
            </div>
            <div className="read-more-link">
              <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>READ MORE</button>
            </div>
          </div>
        </div>
      </section>

      {isExpanded && (
        <article className="blog-post" style={{ display: 'block' }}>
          <h2>{blog.title || 'Untitled'}</h2>
          <div className="blog-meta">Published: {formatDate(blog.publishedAt)} · Category: {blog.category || 'General'}</div>
          {blog.featuredImage && (
            <div className="blog-image-wrapper">
              <img src={blog.featuredImage} alt={blog.title} className="blog-image-inline" />
            </div>
          )}
          
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content || '' }}></div>
          
          <div className="article-byline">
            <span className="by-prefix">~By</span>
            <a className="by-author" href={blog.authorLinkedIn || '#'} target="_blank" rel="noopener noreferrer">
              <h2>{blog.authorName || 'Team Vajra'}</h2>
            </a>
          </div>

          <div className="engagement-bar">
            <div className="engagement-buttons">
              <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike}>❤️ Like</button>
              <button className="share-btn" onClick={sharePost}>🔗 Share</button>
            </div>
            <div className="like-count"><span>{likeCount}</span> likes</div>
          </div>

          <div className="comments-section">
            <h4>Comments</h4>
            <p className="user-status" style={{ fontSize: '14px', color: '#f7c275', marginTop: '5px' }}>
              {user ? `Logged in as ${user.displayName || user.email}` : 'Not logged in'}
            </p>
            <form className="comment-form" onSubmit={handleComment}>
              <textarea className="comment-input" placeholder="Share your thoughts..." value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
              <button type="submit">Post Comment</button>
            </form>
            <ul className="comment-list">
              {comments.map(c => (
                <li key={c.id}>
                  <strong>{c.author || 'Anonymous'}</strong>: {c.text || ''}
                  <span className="comment-timestamp">{new Date(c.time).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="back-row">
            <div className="back-to-top">
              <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>↑ Back to top</a>
            </div>
            <div className="read-less">
              <button className="read-less-btn" onClick={() => setIsExpanded(false)}>READ LESS</button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const fetchedBlogs = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === 'published') {
            fetchedBlogs.push({ id: docSnap.id, ...data });
          }
        });
        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleSignOut = async () => {
    await logout();
  };

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign in failed:', err);
      alert(`Google Sign-In Error: ${err.message || 'Popup closed or blocked'}\n\nPlease ensure popup blockers are disabled and your domain is authorized in Firebase Console.`);
    }
  };

  return (
    <div className="page-wrap" id="top" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95)), url("/assets/blog-bg-drones.jpg")`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      minHeight: '100vh',
      maxWidth: 'none',
      paddingTop: '40px',
      marginTop: 0
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <FadeIn>
          <div className="page-title">
            <div>
              <h1>Flight Path: The Official Team Vajra Blog</h1>
              <p>Race recaps, build logs, and behind-the-scenes stories from the Team Vajra hangar.</p>
            </div>
            <div className="auth-buttons">
              {!user ? (
                <button onClick={handleSignIn} className="member-login-link" style={{ background: 'transparent' }}>
                  Sign in with Google
                </button>
              ) : (
                <div id="userSignedIn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="signed-in-name">👤 {user.displayName || user.email}</span>
                  <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
                </div>
              )}
              <Link to="/login" className="member-login-link">✍️ Member Login</Link>
            </div>
          </div>
        </FadeIn>

        <div className="featured-label">Featured</div>

        {loading ? (
          <DroneLoader fullScreen={false} message="Fetching latest logs..." />
        ) : blogs.length === 0 ? (
          <div className="loading-blogs">
            <p>No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          blogs.map((blog, i) => (
            <ScrollZoomCard key={blog.id} delay={0}>
              <BlogCard blog={blog} id={blog.id} user={user} />
            </ScrollZoomCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Blog;
