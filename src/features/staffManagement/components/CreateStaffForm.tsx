import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import type { CreateStaffPayload } from '../api/staffApi';
import './CreateStaffForm.css';

interface CreateStaffFormProps {
  allowedRoles: ('Manager' | 'Worker' | 'Official' | 'HR')[];
  onSubmit: (payload: CreateStaffPayload) => void;
  isLoading: boolean;
  error?: string | null;
}

export const CreateStaffForm: React.FC<CreateStaffFormProps> = ({
  allowedRoles,
  onSubmit,
  isLoading,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // If there's only one role, default to it, otherwise empty
  const [role, setRole] = useState<'Manager' | 'Worker' | 'Official' | 'HR' | ''>(
    allowedRoles.length === 1 ? allowedRoles[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !role) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
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

        {allowedRoles.length > 1 && (
          <div className="form-group">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
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
              {allowedRoles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
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
