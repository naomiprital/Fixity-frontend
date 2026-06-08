import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import type { CreateStaffPayload } from '../api/staffApi';
import './CreateStaffForm.css';

interface CreateStaffFormProps {
  creatorRole: 'Official' | 'Manager';
  onSubmit: (payload: CreateStaffPayload) => void;
  isLoading: boolean;
  error?: string | null;
}

export const CreateStaffForm: React.FC<CreateStaffFormProps> = ({
  creatorRole,
  onSubmit,
  isLoading,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Manager' | 'Worker' | ''>(creatorRole === 'Official' ? '' : 'Worker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role: role as 'Manager' | 'Worker',
    });
  };

  return (
    <div className="create-staff-card">
      <h3 className="create-staff-title">ADDING NEW USER...</h3>

      <form onSubmit={handleSubmit} className="create-staff-form">
        <div className="form-row">
          <div className="form-group half-width">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>
          <div className="form-group half-width">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Official Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {creatorRole === 'Official' && (
          <div className="form-group">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as 'Manager' | 'Worker')}
              disabled={isLoading}
              displayEmpty
              className="form-input form-select"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                padding: 0
              }}
              inputProps={{
                style: { padding: '14px 16px', height: 'auto' }
              }}
            >
              <MenuItem value="" disabled>Select Role</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Worker">Worker</MenuItem>
            </Select>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !firstName.trim() || !lastName.trim() || !email.trim() || !role}
          className="form-submit-btn"
        >
          {isLoading ? 'Creating Account...' : 'Send Credentials'}
        </button>
      </form>
    </div>
  );
};
