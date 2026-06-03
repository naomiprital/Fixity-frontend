import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PersonAdd } from '@mui/icons-material';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { toast } from 'react-toastify';
import { useStaffList, useCreateStaff } from '../../staffManagement/api/staffApi';
import { StaffList } from '../../staffManagement/components/StaffList';
import { CreateStaffForm } from '../../staffManagement/components/CreateStaffForm';
import Loader from '@/shared/ui/Loader';
import '../../staffManagement/components/StaffManagement.css';

const OfficialStaffManagementPage = () => {
  const { data: user } = useAuthUser();
  const { data: managers = [], isLoading: isManagersLoading } = useStaffList('Manager');
  const { data: workers = [], isLoading: isWorkersLoading } = useStaffList('Worker');
  const createStaffMutation = useCreateStaff();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateStaff = (payload: any) => {
    createStaffMutation.mutate(payload, {
      onSuccess: (created) => {
        toast.success('Staff account created successfully');
        setShowAddForm(false); // hide form (fields reset when unmounted)
      },
      onError: (err: any) => {
        console.log('Error creating staff account:', err);
        const msg = err.response?.data?.message || err.error || 'Failed to create staff account';
        toast.error(msg);
      },
    });
  };

  const creatorRole = (user?.role as 'Official' | 'Manager') || 'Official';

  return (
    <>
      <PageHeader title="Staff Management" />
      <div className="staff-management-container">
        {/* Create staff account button */}
        <button className="create-staff-trigger-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <PersonAdd /> Create New Staff Account
        </button>

        {showAddForm && (
          <>
            <CreateStaffForm
              creatorRole={creatorRole}
              onSubmit={handleCreateStaff}
              isLoading={createStaffMutation.isPending}
            />
            <div className="staff-divider" />
          </>
        )}

        {/* Active managers list */}
        <h3 className="active-staff-header" style={{ marginTop: '24px' }}>
          MANAGERS ({isManagersLoading ? '...' : managers.length})
        </h3>
        {isManagersLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
            <Loader />
          </div>
        ) : (
          <StaffList staff={managers} />
        )}

        {/* Active workers list */}
        <h3 className="active-staff-header" style={{ marginTop: '24px' }}>
          WORKERS ({isWorkersLoading ? '...' : workers.length})
        </h3>
        {isWorkersLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
            <Loader />
          </div>
        ) : (
          <StaffList staff={workers} />
        )}

        {/* Divider */}
      </div>
    </>
  );
};

export default OfficialStaffManagementPage;
