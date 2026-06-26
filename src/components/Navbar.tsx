import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  Home,
  AssignmentOutlined,
  Assignment,
  PersonOutlined,
  Person,
  Add,
  Dashboard,
  DashboardOutlined,
  Explore,
  ExploreOutlined,
  TaskAlt,
  TaskAltOutlined,
  InsightsOutlined,
  Insights,
  Groups,
  GroupsOutlined,
  Map,
  MapOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './Navbar.css';
import { PagesEnum } from '@/enums/PagesEnum';
import { capitalizeFirstLetter } from '@/utils/utilsFunctions';
import { useAuthUser } from '@/features/auth/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: user } = useAuthUser();
  const userRole = user?.role || '';

  const NavItem = ({
    page,
    filledIcon,
    outlinedIcon,
    label,
  }: {
    page: string;
    filledIcon: any;
    outlinedIcon: any;
    label?: string;
  }) => {
    const path = `/${page}`;
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    const color = isActive ? theme.palette.primary.main : theme.palette.text.disabled;
    const Icon = isActive ? filledIcon : outlinedIcon;

    return (
      <div className="nav-item" onClick={() => navigate(path)}>
        <Icon style={{ color }} fontSize="large" />
        <span style={{ color }}>{label || capitalizeFirstLetter(page)}</span>
      </div>
    );
  };

  const navConfigs: Record<string, any[]> = {
    Worker: [
      { page: PagesEnum.WORKER_POOL, filledIcon: Explore, outlinedIcon: ExploreOutlined, label: 'Pool' },
      { page: PagesEnum.WORKER_TASKS, filledIcon: TaskAlt, outlinedIcon: TaskAltOutlined, label: 'My Tasks' },
      { page: PagesEnum.PROFILE, filledIcon: Person, outlinedIcon: PersonOutlined, label: 'Profile' },
    ],
    Manager: [
      { page: PagesEnum.MANAGER_HOME, filledIcon: Map, outlinedIcon: MapOutlined, label: 'Map' },
      { page: PagesEnum.MANAGER_DASHBOARD, filledIcon: Dashboard, outlinedIcon: DashboardOutlined, label: 'Manager' },
      { page: PagesEnum.MANAGER_REPORTS, filledIcon: Assignment, outlinedIcon: AssignmentOutlined, label: 'Reports' },
      { page: PagesEnum.MANAGER_STAFF, filledIcon: Groups, outlinedIcon: GroupsOutlined, label: 'Staff' },
      { page: PagesEnum.PROFILE, filledIcon: Person, outlinedIcon: PersonOutlined, label: 'Profile' },
    ],
    Official: [
      { page: PagesEnum.OFFICIAL_DASHBOARD, filledIcon: Insights, outlinedIcon: InsightsOutlined, label: 'Dashboard' },
      { page: PagesEnum.MAP, filledIcon: Map, outlinedIcon: MapOutlined, label: 'Map' },
      { page: PagesEnum.OFFICIAL_STAFF, filledIcon: Groups, outlinedIcon: GroupsOutlined, label: 'Staff' },
      { page: PagesEnum.PROFILE, filledIcon: Person, outlinedIcon: PersonOutlined, label: 'Profile' },
    ],
    Citizen: [
      { page: PagesEnum.CITIZEN_HOME, filledIcon: Home, outlinedIcon: HomeOutlined, label: 'Home' },
      { isCreateReportFab: true },
      { page: PagesEnum.CITIZEN_REPORTS, filledIcon: Assignment, outlinedIcon: AssignmentOutlined, label: 'Reports' },
      { page: PagesEnum.PROFILE, filledIcon: Person, outlinedIcon: PersonOutlined, label: 'Profile' },
    ],
    HR: [
      { page: PagesEnum.MAP, filledIcon: Map, outlinedIcon: MapOutlined, label: 'Map' },
      { page: PagesEnum.HR_STAFF, filledIcon: Groups, outlinedIcon: GroupsOutlined, label: 'Staff' },
      { page: PagesEnum.PROFILE, filledIcon: Person, outlinedIcon: PersonOutlined, label: 'Profile' },
    ],
  };

  const currentRole = capitalizeFirstLetter(userRole) || 'Citizen';
  const currentNavItems = navConfigs[currentRole] || navConfigs.Citizen;

  return (
    <nav className="bottom-navbar">
      {currentNavItems.map((item, index) => {
        if (item.isCreateReportFab) {
          return (
            <div key="fab" className="nav-fab-container">
              <button className="nav-fab" onClick={() => navigate(`/${PagesEnum.CITIZEN_CREATE}`)}>
                <Add fontSize="large" />
              </button>
            </div>
          );
        }

        return (
          <NavItem
            key={item.page || index}
            page={item.page}
            filledIcon={item.filledIcon}
            outlinedIcon={item.outlinedIcon}
            label={item.label}
          />
        );
      })}
    </nav>
  );
};

export default Navbar;