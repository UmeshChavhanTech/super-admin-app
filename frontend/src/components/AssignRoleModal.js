import React, { useState } from 'react';
import api from '../services/api';

const AssignRoleModal = ({ user, roles, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    setError('');

    try {
      await api.post('/superadmin/assign-role', {
        userId: user.id,
        roleId: parseInt(selectedRole)
      });
      
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Assign Role to {user.name}</h3>
          <button onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label>Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading || !selectedRole}>
              {loading ? 'Assigning...' : 'Assign Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;