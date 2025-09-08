import { useEffect, useState } from 'react';
import AssignRoleModal from '../components/AssignRoleModal';
import UserModal from '../components/UserModal';
import api from '../services/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage]);

  // ✅ Helper: get token and set headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(
        `/superadmin/users?page=${currentPage}&limit=10`,
        getAuthHeaders()
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/superadmin/roles', getAuthHeaders());
      setRoles(response.data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/superadmin/users/${userId}`, getAuthHeaders());
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users Management</h2>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id || user._id}>
              <td>{user.id || user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.Roles?.map((role) => role.name).join(', ') || 'No roles'}</td>
              <td>
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
              </td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleAssignRole(user)}>Assign Role</button>
                <button
                  onClick={() => handleDeleteUser(user.id || user._id)}
                  className="danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onSave={fetchUsers}
        />
      )}

      {showRoleModal && (
        <AssignRoleModal
          user={selectedUser}
          roles={roles}
          onClose={() => setShowRoleModal(false)}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};

export default Users;
