import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { useStaffList } from '../../staffManagement/api/staffApi';
import { StaffList } from '../../staffManagement/components/StaffList';
import Loader from '@/shared/ui/Loader';
import '../../staffManagement/components/StaffManagement.css';

const ManagerStaffManagementPage = () => {
  const { data: workers = [], isLoading: isWorkersLoading } = useStaffList('Worker');
  const [workersCollapsed, setWorkersCollapsed] = useState(false);

  return (
    <>
      <PageHeader title="Staff Management" />
      <div className="staff-management-container">
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
