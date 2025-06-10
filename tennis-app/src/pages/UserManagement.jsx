import { useState, useEffect } from 'react';
import { 
  getUsers, 
  updateUserRole, 
  updateUserPoints, 
  updateUserLeague, 
  deleteUser, 
} from '../api/userApi';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsInput, setPointsInput] = useState({});
  const [matchesInput, setMatchesInput] = useState({});
  const [error, setError] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      maxWidth: '90%',
      borderRadius: '12px',
      border: 'none',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      background: 'white',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      setError(`Failed to update role for user ${userId}`);
      console.error('Error updating role:', err);
    }
  };

  const handleLeagueChange = async (userId, league) => {
    try {
      await updateUserLeague(userId, league);
      await loadUsers();
    } catch (err) {
      setError(`Failed to update league for user ${userId}`);
      console.error('Error updating league:', err);
    }
  };

  const handlePointsSubmit = async (userId) => {
    const points = pointsInput[userId];
    if (!points || isNaN(points)) return;

    try {
      await updateUserPoints(userId, parseInt(points));
      setPointsInput({ ...pointsInput, [userId]: '' });
      await loadUsers();
    } catch (err) {
      setError(`Failed to update points for user ${userId}`);
      console.error('Error updating points:', err);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete);
      await loadUsers();
      setDeleteModalIsOpen(false);
    } catch (err) {
      setError(`Failed to delete user ${userToDelete}`);
      console.error('Error deleting user:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all system users</p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">League</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Matches</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Add Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.roleType}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">- Select -</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="OBSERVER">OBSERVER</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.league || ''}
                        onChange={(e) => handleLeagueChange(user.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">- Select -</option>
                        <option value="A">League A</option>
                        <option value="B">League B</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {user.points || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {user.matches || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex">
                        <input
                          type="number"
                          value={pointsInput[user.id] || ''}
                          onChange={(e) => setPointsInput({
                            ...pointsInput,
                            [user.id]: e.target.value
                          })}
                          className="block w-20 pl-3 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Points"
                        />
                        <button
                          onClick={() => handlePointsSubmit(user.id)}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-blue-500 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => confirmDelete(user.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={() => setDeleteModalIsOpen(false)}
          style={modalStyles}
          contentLabel="Confirm Deletion"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Deletion</h2>
          <p className="mb-6 text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModalIsOpen(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete User
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;