import React from 'react';
import { Email, CalendarMonth } from '@mui/icons-material';
import type { StaffUser } from '../api/staffApi';
import './StaffDetailPopup.css';

interface StaffDetailPopupProps {
  member: StaffUser;
  onClose: () => void;
}

export const StaffDetailPopup: React.FC<StaffDetailPopupProps> = ({ member, onClose }) => {
  const getInitials = (first: string, last: string) =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

  const roleBadgeClass = `staff-popup-role-badge role-${member.role.toLowerCase()}`;

  const formattedDate = new Date(member.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="staff-popup-overlay" onClick={handleOverlayClick}>
      <div className="staff-popup-card">
        {/* Gradient banner */}
        <div className="staff-popup-banner">
          <button className="staff-popup-close-btn" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>

        {/* Avatar */}
        <div className="staff-popup-avatar-wrapper">
          {member.profilePictureUrl ? (
            <img
              src={member.profilePictureUrl}
              alt={`${member.firstName} ${member.lastName}`}
              className="staff-popup-avatar"
            />
          ) : (
            <div className="staff-popup-avatar-initials">
              {getInitials(member.firstName, member.lastName)}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="staff-popup-body">
          <h2 className="staff-popup-name">{`${member.firstName} ${member.lastName}`}</h2>
          <span className={roleBadgeClass}>{member.role}</span>

          <div className="staff-popup-info">
            {/* Email */}
            <div className="staff-popup-row">
              <span className="staff-popup-row-icon"><Email fontSize="small" /></span>
              <div className="staff-popup-row-content">
                <span className="staff-popup-row-label">Email</span>
                <span className="staff-popup-row-value">{member.email}</span>
              </div>
            </div>

            {/* Created */}
            <div className="staff-popup-row">
              <span className="staff-popup-row-icon"><CalendarMonth fontSize="small" /></span>
              <div className="staff-popup-row-content">
                <span className="staff-popup-row-label">Member Since</span>
                <span className="staff-popup-row-value">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
