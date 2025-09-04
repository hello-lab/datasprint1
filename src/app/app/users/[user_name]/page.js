"use client";
import { FaRupeeSign, FaWalking, FaSignOutAlt } from 'react-icons/fa';
import { use, useEffect, useState } from "react";

export default function UserPage({ params }) {
    // Unwrap params if it's a Promise (Next.js 14+)
    const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
    const { user_name, teamname } = unwrappedParams;
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserAndChallenges() {
            try {
                const res = await fetch(`/api/users?name=${user_name}`);
                if (!res.ok) throw new Error("Failed to fetch user");
                const userData = await res.json();
                setUser(userData);
                // Fetch challenges for username and teamname
                const params = new URLSearchParams();
                params.append('username', user_name);
                if (userData.team) params.append('teamname', userData.team);
                const chalRes = await fetch(`/api/challenges?${params.toString()}`);
                if (chalRes.ok) {
                    const chalData = await chalRes.json();
                    setChallenges(chalData);
                } else {
                    setChallenges([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserAndChallenges();
    }, [user_name]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found.</div>;

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-green-100 p-4 animate-fadeIn'>
        <div className="w-full max-w-[80vw] bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 flex flex-col items-center transition-transform duration-300 hover:scale-[1.01]"
                  style={{ backdropFilter: 'blur(10px)' }}>
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-28 h-28 rounded-full shadow-xl border-4 border-indigo-300 mb-4 object-cover hover:shadow-2xl transition-shadow duration-300"
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 mb-2 tracking-tight drop-shadow">{user.username}</h1>
              <div style={{ width: '100%', display: 'flex', flexDirection:"row",flexWrap:"wrap",gap:'16px'}}>
                <div style={{ gridColumn: "span 2" }} className="flex-1 flex flex-col items-center bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
                  <div  className="flex items-center justify-center gap-2 text-lg text-yellow-600 font-medium mb-1">
                    Department
                  </div>
                  <div className="text-2xl font-bold text-yellow-800">{user.team ?? '-'}</div>
                </div>
                <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-green-100 to-green-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center gap-2 text-lg text-green-600 font-medium mb-1">
                    <FaWalking className="inline-block text-green-500 text-xl" /> Steps
                  </div>
                  <div className="text-2xl font-bold text-green-800">{user.stepcount ?? 0}</div>
                </div>
                <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-red-100 to-red-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center gap-2 text-lg text-red-600 font-medium mb-1">
                    Pushups
                  </div>
                  <div className="text-2xl font-bold text-red-800">{user.pushup ?? 0}</div>
                </div>
                <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center gap-2 text-lg text-purple-600 font-medium mb-1">
                    Squats
                  </div>
                  <div className="text-2xl font-bold text-purple-800">{user.squat ?? 0}</div>
                </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 mt-8 mb-4 tracking-tight drop-shadow">Challenge Progress</h2>
                {challenges.filter(challenge => challenge.clear).length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No completed challenges found.</div>
                ) : (
                    <ul className="space-y-6 w-full">
                        {challenges.filter(challenge => challenge.clear).map((challenge) => (
                            <li key={challenge.id || challenge.title} className="p-4 rounded-xl shadow bg-gradient-to-br from-indigo-50 to-green-50">
                                <div className="font-bold text-lg text-indigo-700 mb-2">{challenge.title}</div>
                                <div className="text-green-700 font-semibold mb-2">Task Accomplished</div>
                                <ul className="text-gray-700 text-base ml-4 list-disc">
                                  {challenge.steps > 0 && <li>Steps: {challenge.steps}</li>}
                                  {challenge.squats > 0 && <li>Squats: {challenge.squats}</li>}
                                  {challenge.pushups > 0 && <li>Pushups: {challenge.pushups}</li>}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
                  </div></div>
    );
}