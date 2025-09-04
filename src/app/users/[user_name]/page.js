"use client";
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage({ params }) {
  // Unwrap params if it's a Promise (Next.js 14+)
  const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
  const username = unwrappedParams?.user_name;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/users?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch user');
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div className="p-8 text-center">Loading user...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!user) return <div className="p-8 text-center">User not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-10">
      <h1 className="text-3xl font-bold text-indigo-800 mb-4">{user.username}</h1>
      <ul className="text-lg text-gray-700 space-y-2">
        {Object.entries(user).map(([key, value]) => (
          <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
        ))}
      </ul>
    </div>
  );
}
