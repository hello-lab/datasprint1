"use client"

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [heads, setHeads] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      toast.error('Error fetching users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditValues({
      balance: user.balance,
      stepcount: user.stepcount
    });
  };

  const handleSave = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          updates: editValues
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditValues({});
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Username', 'Email', 'Balance', 'Max Steps', 'Days Logged', 'Total Transactions', 'Total Deposits', 'Total Withdrawals','Step Count','Squat Count','Pushup Count','Team'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.username,
        user.user_email || 'N/A',
        user.balance,
        user.max_steps,
        user.days_logged,
        user.total_transactions,
        user.total_deposits,
        user.total_withdrawals,
        user.stepcount,
        user.squatcount,
        user.pushupcount,
        user.team || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Admin Header */}
      

      <div className="max-w-7xl mx-auto p-6">
        

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(u => u.days_logged > 0).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Deposits</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹{users.reduce((sum, user) => sum + user.total_deposits, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Withdrawals</h3>
            <p className="text-3xl font-bold text-red-600">
              ₹{users.reduce((sum, user) => sum + user.total_withdrawals, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}