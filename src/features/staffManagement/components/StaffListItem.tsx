import React from 'react';
import type { StaffUser } from '../api/staffApi';
import './StaffListItem.css';

interface StaffListItemProps {
  member: StaffUser;
  onClick?: (member: StaffUser) => void;
}

export const StaffListItem: React.FC<StaffListItemProps> = ({ member, onClick }) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="staff-card" onClick={() => onClick?.(member)} style={{ cursor: 'pointer' }}>
      <div className="staff-avatar-container">
        {member.profilePictureUrl ? (
          <img
            src={member.profilePictureUrl}
            alt={`${member.firstName} ${member.lastName}`}
            className="staff-avatar"
          />
        ) : (
          <div className="staff-avatar-placeholder">
            {getInitials(member.firstName, member.lastName)}
          </div>
        )}
      </div>

      <div className="staff-details">
        <h4 className="staff-name">{`${member.firstName} ${member.lastName}`}</h4>
        <p className="staff-subtitle">{member.email}</p>
      </div>
    </div>
  );
};
