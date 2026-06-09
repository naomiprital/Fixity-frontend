import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { StaffListItem } from './StaffListItem';
import { StaffDetailPopup } from './StaffDetailPopup';
import type { StaffUser } from '../api/staffApi';
import { useDeleteStaff } from '../api/staffApi';
import './Stafflist.css';

interface StaffListProps {
  staff: StaffUser[];
}

export const StaffList: React.FC<StaffListProps> = ({ staff }) => {
  const [selectedMember, setSelectedMember] = useState<StaffUser | null>(null);
  const deleteStaffMutation = useDeleteStaff();

  const handleDelete = (userId: number) => {
    deleteStaffMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('Staff account deleted successfully');
        setSelectedMember(null);
      },
      onError: (err: any) => {
        const responseData = err?.response?.data;
        const msg =
          responseData?.error ||
          responseData?.message ||
          err?.message ||
          'Failed to delete staff account';
        toast.error(msg);
      },
    });
  };

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
          onDelete={handleDelete}
          isDeleting={deleteStaffMutation.isPending}
        />
      )}
    </>
  );
};
