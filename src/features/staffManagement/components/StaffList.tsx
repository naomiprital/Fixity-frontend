import React from 'react';
import { StaffListItem } from './StaffListItem';
import type { StaffUser } from '../api/staffApi';
import './Stafflist.css';

interface StaffListProps {
  staff: StaffUser[];
}

export const StaffList: React.FC<StaffListProps> = ({ staff }) => {
  if (staff.length === 0) {
    return (
      <div className="staff-list-empty">
        <p>No active staff members found.</p>
      </div>
    );
  }

  return (
    <div className="staff-list">
      {staff.map((member) => (
        <StaffListItem key={member.userId} member={member} />
      ))}
    </div>
  );
};
