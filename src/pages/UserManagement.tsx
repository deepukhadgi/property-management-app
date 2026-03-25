import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppDataContext';
import { ShieldAlert, Trash2, Key } from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
  password?: string;
}

export default function UserManagement() {
  const { role } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Facility');
  const [error, setError] = useState('');

  const fetchUsers = () => {
    const saved = localStorage.getItem('mock_users');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      setUsers([
        { id: 1, username: 'superuser', password: 'Qw3rty@123', role: 'Superuser' },
        { id: 2, username: 'admin', password: 'admin123', role: 'Admin' },
        { id: 3, username: 'facility', password: 'facility123', role: 'Facility' }
      ]);
    }
  };

  useEffect(() => {
    if (role === 'Superuser') fetchUsers();
  }, [role]);

  const syncToLocal = (updatedUsers: User[]) => {
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    
    if (users.find(u => u.username === newUsername)) {
      setError('Username already exists!');
      return;
    }

    const newUser: User = { id: Date.now(), username: newUsername, password: newPassword, role: newRole };
    syncToLocal([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    setError('');
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    syncToLocal(users.filter(u => u.id !== id));
  };

  const handlePasswordChange = (id: number) => {
    const pwd = window.prompt('Enter new password for user:');
    if (!pwd) return;
    const updated = users.map(u => u.id === id ? { ...u, password: pwd } : u);
    syncToLocal(updated);
    alert('Password updated in local memory successfully!');
  };

  if (role !== 'Superuser') {
    return <div className="p-8 text-center text-red-600">Access Denied. Superuser only.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <ShieldAlert className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Superuser control panel for access and roles.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Account</h2>
        <form onSubmit={handleCreateUser} className="space-y-4 shadow-sm p-4 border border-gray-100 rounded-lg">
          {error && <p className="text-red-600 px-3 py-2 bg-red-50 rounded-md text-sm font-medium">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white">
              <option value="Facility">Facility (Cleaning Only)</option>
              <option value="Admin">Admin (Full Editing)</option>
              <option value="Superuser">Superuser (Everything)</option>
            </select>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 shadow transition-colors">Generate Credentials</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <th className="p-4 w-16">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-500">#{u.id}</td>
                <td className="p-4 text-sm font-semibold text-gray-900">{u.username}</td>
                <td className="p-4 text-sm text-gray-600">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${u.role === 'Superuser' ? 'bg-purple-100 text-purple-700' : u.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handlePasswordChange(u.id)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100" title="Change Password">
                    <Key className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete User">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">No users populated yet...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
