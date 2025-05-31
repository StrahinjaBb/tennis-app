import { useState, useEffect } from 'react';
import { 
  getUsers, 
  updateUserRole, 
  updateUserPoints, 
  updateUserLeague, 
  deleteUser 
} from '../api/userApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsInput, setPointsInput] = useState({});
  const [error, setError] = useState(null);

  // Učitaj korisnike
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Handleri za ažuriranje
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      setError(`Failed to update role for user ${userId}`);
    }
  };

  const handleLeagueChange = async (userId, league) => {
    try {
      await updateUserLeague(userId, league);
      await loadUsers();
    } catch (err) {
      setError(`Failed to update league for user ${userId}`);
    }
  };

  const handlePointsSubmit = async (userId) => {
    const points = pointsInput[userId];
    if (!points) return;

    try {
      await updateUserPoints(userId, points);
      setPointsInput({ ...pointsInput, [userId]: '' });
      await loadUsers();
    } catch (err) {
      setError(`Failed to update points for user ${userId}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(`Failed to delete user ${userId}`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">League</th>
              <th className="py-3 px-4 border">Points</th>
              <th className="py-3 px-4 border">Add Points</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                
                {/* Role Select */}
                <td className="py-2 px-4 border">
                  <select
                    value={user.roleType}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">- Select -</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                    <option value="OBSERVER">OBSERVER</option>
                  </select>
                </td>
                
                {/* League Select */}
                <td className="py-2 px-4 border">
                  <select
                    value={user.league || ''}
                    onChange={(e) => handleLeagueChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">- Select -</option>
                    <option value="A">League A</option>
                    <option value="B">League B</option>
                  </select>
                </td>
                
                <td className="py-2 px-4 border">{user.points || 0}</td>
                
                {/* Points Input */}
                <td className="py-2 px-4 border">
                  <div className="flex">
                    <input
                      type="number"
                      value={pointsInput[user.id] || ''}
                      onChange={(e) => setPointsInput({
                        ...pointsInput,
                        [user.id]: e.target.value
                      })}
                      className="border rounded-l px-2 py-1 w-20"
                    />
                    <button
                      onClick={() => handlePointsSubmit(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600"
                    >
                      +
                    </button>
                  </div>
                </td>
                
                {/* Delete Button */}
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;