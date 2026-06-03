import React, { useState } from 'react';
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
  const defaultRole = creatorRole === 'Official' ? 'Manager' : 'Worker';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role: defaultRole,
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

        {/* role is assigned automatically based on creator role; selection removed */}

        <button
          type="submit"
          disabled={isLoading || !firstName.trim() || !lastName.trim() || !email.trim()}
          className="form-submit-btn"
        >
          {isLoading ? 'Creating Account...' : 'Send Credentials'}
        </button>
      </form>
    </div>
  );
};
