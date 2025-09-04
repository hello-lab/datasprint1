"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetailPage() {
  const { post_id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Fetch user profile for login
    fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' })
    })
      .then(res => res.json())
      .then(profileData => {
        setUsername(profileData?.user?.username || '');
      });
  }, []);

  useEffect(() => {
    if (!post_id) return;
    fetch(`/api/social?id=${post_id}`)
      .then(res => res.json())
      .then(data => {
        setPost(Array.isArray(data) && data.length > 0 ? data[0] : null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch post');
        setLoading(false);
      });
    // Fetch comments
    fetch(`/api/interaction/comment?id=${post_id}`)
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data.comments) ? data.comments : []);
      });
    // Fetch likes count and liked state
    fetch(`/api/interaction/like?id=${post_id}`)
      .then(res => res.json())
      .then(data => {
        setLikesCount(data.likes || 0);
      });
    // Fetch post to get likes array for toggle state
    fetch(`/api/social?id=${post_id}`)
      .then(res => res.json())
      .then(data => {
        const postData = Array.isArray(data) && data.length > 0 ? data[0] : null;
        let likesArr = [];
        try {
          likesArr = postData && postData.likes ? JSON.parse(postData.likes) : [];
          if (!Array.isArray(likesArr)) likesArr = [];
        } catch { likesArr = []; }
        setLiked(username && likesArr.includes(username));
      });
  }, [post_id, username, submitting]);

  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!username) {
      alert('Please log in to comment.');
      return;
    }
    if (!commentInput.trim()) return;
    setSubmitting(true);
    await fetch('/api/interaction/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post_id, username, comment: commentInput })
    });
    setCommentInput("");
    setSubmitting(false);
  };

  // Like toggle handler
  const handleLike = async () => {
    if (!username) {
      alert('Please log in to like posts.');
      return;
    }
    const res = await fetch('/api/interaction/like', {
      method: 'POST',
      body: JSON.stringify({ id: post_id, username }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      setLiked(data.likes.includes(username));
      setLikesCount(data.likes.length);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-6 text-center text-gray-500">Post not found.</div>;

  return (
    <div className="">
    <div className="p-4 mx-auto w-full  bg-white/90 rounded-3xl shadow-2xl sm:p-10 mb-8 flex flex-col items-start transition-transform duration-300 hover:scale-[1.01]">
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">{post.name}</h1>
      <div className="text-gray-700 mb-2">
        By: <span className="text-blue-900 cursor-pointer" onClick={() => router.push(`/app/users/${post.user_name}`)}>{post.user_name}</span>
      </div>
      <div className="mb-4" style={{color:"black"}}>{post.content}</div>
      {post.image_url && <img src={post.image_url} alt="Post" className="max-h-60 rounded-lg mb-4" />}
      <div className="flex items-center gap-4 mb-4">
        <button
          className={`like-btn px-3 py-1 rounded-full text-sm font-semibold ${liked ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={handleLike}
          style={{}}
        >
          {liked ? '♥' : '♡'} Like ({likesCount})
        </button>
      </div></div>
      <form onSubmit={handleCommentSubmit} className="flex mt-4 gap-2" style={{color:"black"}}>
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700"
            disabled={submitting || !commentInput.trim()}
          >
            Send
          </button>
        </form>
      <div className="mb-6 mt-4" style={{color:"black"}}>
        <h2 className="font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <div className="text-gray-400">No comments yet.</div>
        ) : (
          <ul className="space-y-2">
            {comments.map((c, i) => (
              <li key={i} className="bg-gray-100 rounded px-3 py-2">
                <span className="font-semibold text-blue-600 underline cursor-pointer" onClick={() => router.push(`/app/users/${c.username}`)}>{c.username}</span>: {c.comment}
              </li>
            ))}
          </ul>
        )}
        
      </div>
    </div>
  );
}
