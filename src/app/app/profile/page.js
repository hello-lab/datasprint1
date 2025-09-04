'use client'

import { useEffect, useState } from 'react';
import { FaRupeeSign, FaWalking, FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'value' }) // Adjust the body as needed
            });
            const data = await res.json();
            
            console.log("hey"+data+"ooi")
            setUser(data.user);
        };

        const fetchTransactions = async () => {
            const res = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            
            console.log(data.trans)
            setTransactions(data.trans.reverse());
        };

        fetchProfile();
        fetchTransactions();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-green-100 animate-fadeIn">
                <div className="text-xl text-indigo-700 font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-green-100 p-4 animate-fadeIn">
    <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 flex flex-col items-center transition-transform duration-300 hover:scale-[1.01]">
      <img
        src="/profile.jpg"
        alt="Profile"
        className="w-28 h-28 rounded-full shadow-xl border-4 border-indigo-300 mb-4 object-cover hover:shadow-2xl transition-shadow duration-300"
      />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 mb-2 tracking-tight drop-shadow">{user.username}</h1>
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns:"repeat(3,1fr)" , gridTemplateRows:"repeat(2,1fr)",gap:'16px'}}>
        <div style={{ gridColumn: "span 2" }} className="flex-1 flex flex-col items-center bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
          <div  className="flex items-center justify-center gap-2 text-lg text-yellow-600 font-medium mb-1">
            Department
          </div>
          <div className="text-2xl font-bold text-yellow-800">{user.team ?? '-'}</div>
        </div>
        <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center gap-2 text-lg text-blue-600 font-medium mb-1">
            Balance
          </div>
          <div className="text-2xl font-bold text-blue-800"><img src="/coin.png" alt="Rupee" height="30px" width="30px" className='inline-block'/>  {user.balance}</div>
        </div>
        <div className="flex-1 flex flex-col items-center bg-gradient-to-br from-green-100 to-green-50 rounded-xl px-4 py-3 text-center shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center gap-2 text-lg text-green-600 font-medium mb-1">
            <FaWalking className="inline-block text-green-500 text-xl" /> Step Count
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
      <button
        onClick={async () => {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/';
        }}
        className="mt-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow flex items-center gap-2 transition-all duration-200"
      >
        <FaSignOutAlt className="inline-block text-lg" /> Logout
      </button>
    </div>
    <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-xl p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-4">Transaction History</h2>
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base text-gray-700">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-blue-100">
                <th className="py-2 px-4 font-semibold text-indigo-700">#</th>
                <th className="py-2 px-4 font-semibold text-blue-700">Amount</th>
                <th className="py-2 px-4 font-semibold text-green-700">Type</th>
                <th className="py-2 px-4 font-semibold text-indigo-700">Date</th>
                <th className="py-2 px-4 font-semibold text-pink-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={`transition-colors duration-200 ${
                    transaction.type === 'deposit'
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <td className="py-2 px-4 font-semibold">{index + 1}</td>
                  <td className="py-2 px-4">{transaction.amount}</td>
                  <td className={`py-2 px-4 capitalize font-semibold ${transaction.type === 'deposit' ? 'text-green-700' : 'text-red-700'}`}>{transaction.type}</td>
                  <td className="py-2 px-4">{new Date(transaction.date).toLocaleString()}</td>
                  <td className="py-2 px-4">{transaction.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No transactions available.</div>
      )}
    </div>
  </div>
)};

export default ProfilePage;