import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PersonAdd, ExpandMore, ChevronRight } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  useStaffList,
  useCreateStaff,
  useDeleteStaff,
  type CreateStaffPayload,
} from '../../staffManagement/api/staffApi';
import { StaffList } from '../../staffManagement/components/StaffList';
import { CreateStaffForm } from '../../staffManagement/components/CreateStaffForm';
import Loader from '@/shared/ui/Loader';
import '../../staffManagement/components/StaffManagement.css';

const HRStaffManagementPage = () => {
  const { data: hrList = [], isLoading: isHrLoading } = useStaffList('HR');
  const { data: officials = [], isLoading: isOfficialsLoading } = useStaffList('Official');
  const { data: managers = [], isLoading: isManagersLoading } = useStaffList('Manager');
  const { data: workers = [], isLoading: isWorkersLoading } = useStaffList('Worker');
  
  const createStaffMutation = useCreateStaff();
  const deleteStaffMutation = useDeleteStaff();

  const [showAddForm, setShowAddForm] = useState(false);
  const [hrCollapsed, setHrCollapsed] = useState(false);
  const [officialsCollapsed, setOfficialsCollapsed] = useState(false);
  const [managersCollapsed, setManagersCollapsed] = useState(false);
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

  const handleDeleteStaff = (userId: number) => {
    deleteStaffMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('Staff account deleted successfully');
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

  return (
    <>
      <PageHeader title="Staff Management" />
      <div className="staff-management-container">
        <div className="staff-sticky-header">
          {/* Create staff account button */}
          <button className="create-staff-trigger-btn" onClick={() => setShowAddForm(!showAddForm)}>
            <PersonAdd /> Create New Staff Account
          </button>

          {showAddForm && (
            <CreateStaffForm
              allowedRoles={['Manager', 'Worker']}
              onSubmit={handleCreateStaff}
              isLoading={createStaffMutation.isPending}
            />
          )}
          <div className="staff-divider" />
        </div>

        {/* Scrollable lists area */}
        <div className="staff-lists">
          {/* HR section */}
          <h3 className="active-staff-header staff-section-header">
            <span>HR ({isHrLoading ? '...' : hrList.length})</span>
            <button
              onClick={() => setHrCollapsed((s) => !s)}
              className="toggle-collapse-btn"
              aria-label="toggle hr"
            >
              {hrCollapsed ? <ChevronRight /> : <ExpandMore />}
            </button>
          </h3>
          {isHrLoading ? (
            <div className="center-loader">
              <Loader />
            </div>
          ) : (
            !hrCollapsed && (
              <StaffList 
                staff={hrList} 
                isDeleting={deleteStaffMutation.isPending} 
              />
            )
          )}

          {/* Officials section */}
          <h3 className="active-staff-header staff-section-header">
            <span>OFFICIALS ({isOfficialsLoading ? '...' : officials.length})</span>
            <button
              onClick={() => setOfficialsCollapsed((s) => !s)}
              className="toggle-collapse-btn"
              aria-label="toggle officials"
            >
              {officialsCollapsed ? <ChevronRight /> : <ExpandMore />}
            </button>
          </h3>
          {isOfficialsLoading ? (
            <div className="center-loader">
              <Loader />
            </div>
          ) : (
            !officialsCollapsed && (
              <StaffList 
                staff={officials} 
                isDeleting={deleteStaffMutation.isPending} 
              />
            )
          )}

          {/* Managers section */}
          <h3 className="active-staff-header staff-section-header">
            <span>MANAGERS ({isManagersLoading ? '...' : managers.length})</span>
            <button
              onClick={() => setManagersCollapsed((s) => !s)}
              className="toggle-collapse-btn"
              aria-label="toggle managers"
            >
              {managersCollapsed ? <ChevronRight /> : <ExpandMore />}
            </button>
          </h3>
          {isManagersLoading ? (
            <div className="center-loader">
              <Loader />
            </div>
          ) : (
            !managersCollapsed && (
              <StaffList 
                staff={managers} 
                onDelete={handleDeleteStaff} 
                isDeleting={deleteStaffMutation.isPending} 
              />
            )
          )}

          {/* Workers section */}
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
            !workersCollapsed && (
              <StaffList 
                staff={workers} 
                onDelete={handleDeleteStaff} 
                isDeleting={deleteStaffMutation.isPending} 
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default HRStaffManagementPage;
