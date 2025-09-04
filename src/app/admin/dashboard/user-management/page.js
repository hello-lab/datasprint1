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
const importFromExcel = async (event) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ' .csv';
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch('/api/admin/onboarding', {
            method: 'PUT',
            body: formData
          });
          const data = await response.json();
          if (data.success) {
            toast.success('Users imported successfully');
            fetchUsers();
          } else {
            toast.error(data.error || 'Failed to import users');
          }
        } catch (error) {
          toast.error('Error importing users');
          console.error(error);
        }
      }
    };
    fileInput.click();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Username', 'Email', 'Balance', 'Max Steps', 'Days Logged', 'Total Transactions', 'Total Deposits', 'Total Withdrawals','Step Count','Squat Count','Pushup Count','Team'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.username,
        user.email || 'N/A',
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
      
      
      {/* Admin Header */}
      

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">User Management</h2>
                <p className="text-gray-600">Manage users and view participation data</p>
              </div>
              <button
                onClick={importFromExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                📊 Import from CSV
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                📊 Export to CSV
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Total Users: {users.length} | Last Updated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Step Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Pushup Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Squat Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Max Steps
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Days Logged
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Total Transactions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Total Deposits
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Total Withdrawals
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {user.id}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-b">
                      {user.username}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {user.email || 'Not provided'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b font-medium">
                      {editingUser === user.id ? (
                        <input
                          type="number"
                          value={editValues.balance}
                          onChange={(e) => setEditValues({...editValues, balance: parseInt(e.target.value)})}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        `${user.balance.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {user.team ||"N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {editingUser === user.id ? (
                        <input
                          type="number"
                          value={editValues.stepcount}
                          onChange={(e) => setEditValues({...editValues, stepcount: parseInt(e.target.value)})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        user.stepcount.toLocaleString()
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {editingUser === user.id ? (
                        <input
                          type="number"
                          value={editValues.squatcount}
                          onChange={(e) => setEditValues({...editValues, squatcount: parseInt(e.target.value)})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        user.squatcount.toLocaleString()
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {editingUser === user.id ? (
                        <input
                          type="number"
                          value={editValues.pushupcount}
                          onChange={(e) => setEditValues({...editValues, stepcount: parseInt(e.target.value)})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        user.pushupcount.toLocaleString()
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-blue-600 border-b font-medium">
                      {user.max_steps.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {user.days_logged}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-b">
                      {user.total_transactions}
                    </td>
                    <td className="px-4 py-4 text-sm text-green-600 border-b font-medium">
                      ₹{user.total_deposits.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-600 border-b font-medium">
                      ₹{user.total_withdrawals.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm border-b">
                      {editingUser === user.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        
      </div>
    </div>
  );
}