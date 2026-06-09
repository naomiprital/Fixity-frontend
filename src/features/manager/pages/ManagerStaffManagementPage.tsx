import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PersonAdd, ExpandMore, ChevronRight } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  useStaffList,
  useCreateStaff,
  type CreateStaffPayload,
} from '../../staffManagement/api/staffApi';
import { StaffList } from '../../staffManagement/components/StaffList';
import { CreateStaffForm } from '../../staffManagement/components/CreateStaffForm';
import Loader from '@/shared/ui/Loader';
import '../../staffManagement/components/StaffManagement.css';

const ManagerStaffManagementPage = () => {
  const { data: workers = [], isLoading: isWorkersLoading } = useStaffList('Worker');
  const createStaffMutation = useCreateStaff();

  const [showAddForm, setShowAddForm] = useState(false);
  const [workersCollapsed, setWorkersCollapsed] = useState(false);

  const handleCreateStaff = (payload: CreateStaffPayload) => {
    createStaffMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Staff account created successfully');
        setShowAddForm(false);
      },
      onError: (err: any) => {
        console.log('Error creating staff account:', err);
        const responseData = err?.response?.data;
        const msg =
          responseData?.error ||
          responseData?.message ||
          err?.message ||
          err?.error ||
          'Failed to create staff account';
        toast.error(msg);
      },
    });
  };

  const creatorRole = 'Manager';

  return (
    <>
      <PageHeader title="Staff Management" />
      <div className="staff-management-container">
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
          </>
        )}
        <div className="staff-divider" />

        <div className="staff-lists">
          <h3 className="active-staff-header staff-section-header">
            <span>WORKERS ({isWorkersLoading ? '...' : workers.length})</span>
            <button
              onClick={() => setWorkersCollapsed((s) => !s)}
              className="toggle-collapse-btn"
              aria-label="toggle workers"
            >
              {workersCollapsed ? <ChevronRight /> : <ExpandMore />}
            </button>
          </h3>
          {isWorkersLoading ? (
            <div className="center-loader">
              <Loader />
            </div>
          ) : (
            !workersCollapsed && <StaffList staff={workers} />
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerStaffManagementPage;
