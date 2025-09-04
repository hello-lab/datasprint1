"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    comments: '[]',
    likes: 0,
    user_name: '',
    content: '',
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

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
    fetch('/api/social')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch posts');
        setPosts([]);
        setLoading(false);
      });
  }, [submitting]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Fetch username from auth/profile
      const profileRes = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' })
      });
      const profileData = await profileRes.json();
      const username = profileData?.user?.username || '';
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_name: username })
      });
      setForm({ name: '', comments: '[]', likes: 0, user_name: '', content: '', image_url: '' });
      setShowForm(false);
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  // Like toggle handler
  const handleLike = async (postId, likesStr) => {
    if (!username) {
      alert('Please log in to like posts.');
      return;
    }
    const res = await fetch('/api/interaction/like', {
      method: 'POST',
      body: JSON.stringify({ id: postId, username }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      setPosts(posts => posts.map(post =>
        post.id === postId ? { ...post, likes: JSON.stringify(data.likes) } : post
      ));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Social Forum</h1>
      <button
        className="mb-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700"
        onClick={() => setShowForm(v => !v)}
      >
        {showForm ? 'Cancel' : 'Add Post'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-xl shadow space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            placeholder="Post Title"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            name="content"
            placeholder="What's on your mind?"
            value={form.content}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="image_url"
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
      {loading ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet.</div>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => {
            let likesArr = [];
            try {
              likesArr = JSON.parse(post.likes);
              if (!Array.isArray(likesArr)) likesArr = [];
            } catch { likesArr = []; }
            const liked = username && likesArr.includes(username);
            return (
              <li key={post.id} className="p-4 rounded-xl shadow bg-gradient-to-br from-indigo-50 to-green-50 cursor-pointer hover:bg-indigo-100"
                onClick={e => {
                  // Prevent click if like button is clicked
                  if (e.target.closest('.like-btn')) return;
                  router.push(`/app/socials/${post.id}`);
                }}
              >
                <div className="font-bold text-lg text-indigo-700 mb-1">{post.name}</div>
                <div className="text-gray-700 mb-2">By: {post.user_name}</div>
                <div className="mb-2">{post.content}</div>
                {post.image_url && <img src={post.image_url} alt="Post" className="max-h-60 rounded-lg mb-2" />}
                <button
                  className={`like-btn px-3 py-1 rounded-full text-sm font-semibold mr-2 ${liked ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={e => { e.stopPropagation(); handleLike(post.id, post.likes); }}
                >
                  {liked ? '♥' : '♡'} Like ({likesArr.length})
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
