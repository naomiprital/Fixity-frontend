import React, { useState } from 'react';
import { StaffListItem } from './StaffListItem';
import { StaffDetailPopup } from './StaffDetailPopup';
import type { StaffUser } from '../api/staffApi';
import './Stafflist.css';

interface StaffListProps {
  staff: StaffUser[];
}

export const StaffList: React.FC<StaffListProps> = ({ staff }) => {
  const [selectedMember, setSelectedMember] = useState<StaffUser | null>(null);

  if (staff.length === 0) {
    return (
      <div className="staff-list-empty">
        <p>No active staff members found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="staff-list">
        {staff.map((member) => (
          <StaffListItem
            key={member.userId}
            member={member}
            onClick={setSelectedMember}
          />
        ))}
      </div>

      {selectedMember && (
        <StaffDetailPopup
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};
