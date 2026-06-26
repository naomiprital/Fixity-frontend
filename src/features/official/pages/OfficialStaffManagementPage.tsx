import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { useStaffList } from '../../staffManagement/api/staffApi';
import { StaffList } from '../../staffManagement/components/StaffList';
import Loader from '@/shared/ui/Loader';
import '../../staffManagement/components/StaffManagement.css';

const OfficialStaffManagementPage = () => {
  const { data: hrList = [], isLoading: isHrLoading } = useStaffList('HR');
  const { data: managers = [], isLoading: isManagersLoading } = useStaffList('Manager');
  const { data: workers = [], isLoading: isWorkersLoading } = useStaffList('Worker');

  const [hrCollapsed, setHrCollapsed] = useState(false);
  const [managersCollapsed, setManagersCollapsed] = useState(false);
  const [workersCollapsed, setWorkersCollapsed] = useState(false);

  return (
    <>
      <PageHeader title="Staff Management" />
      <div className="staff-management-container">
        <div className="staff-lists">
          {/* Active HR list */}
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
            !hrCollapsed && <StaffList staff={hrList} />
          )}

          {/* Active managers list */}
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
            !managersCollapsed && <StaffList staff={managers} />
          )}

          {/* Active workers list */}
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

export default OfficialStaffManagementPage;
