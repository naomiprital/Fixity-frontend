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
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './Navbar.css';
import { PagesEnum } from '@/enums/PagesEnum';
import { capitalizeFirstLetter } from '@/utils/utilsFunctions';
import type { AuthResponse } from '@/features/auth/api/authApi';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Detect role from localStorage
  const authDataString = localStorage.getItem('fixity.auth');
  let userRole = '';
  
  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString) as AuthResponse;
      userRole = authData.user?.role || '';
    } catch (e) {}
  }
  
  const isWorker = userRole.toLowerCase() === 'worker';
  const isManagerOrOfficial = userRole === 'Manager' || userRole === 'Official';

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

  if (isWorker) {
    return (
      <nav className="bottom-navbar">
        <NavItem page="worker/pool" filledIcon={Explore} outlinedIcon={ExploreOutlined} label="Pool" />
        <NavItem page="worker/my-tasks" filledIcon={TaskAlt} outlinedIcon={TaskAltOutlined} label="My Tasks" />
        <NavItem page="profile" filledIcon={Person} outlinedIcon={PersonOutlined} label="Profile" />
      </nav>
    );
  }

  return (
    <nav className="bottom-navbar">
      <NavItem page={PagesEnum.HOME} filledIcon={Home} outlinedIcon={HomeOutlined} label="Home" />

      {isManagerOrOfficial ? (
        <NavItem page={PagesEnum.MANAGER_DASHBOARD} filledIcon={Dashboard} outlinedIcon={DashboardOutlined} label="Manager" />
      ) : (
        <div className="nav-fab-container">
          <button className="nav-fab" onClick={() => navigate(`/${PagesEnum.CREATE}`)}>
            <Add fontSize="large" />
          </button>
        </div>
      )}

      <NavItem page={PagesEnum.REPORTS} filledIcon={Assignment} outlinedIcon={AssignmentOutlined} label="Reports" />
      <NavItem page={PagesEnum.PROFILE} filledIcon={Person} outlinedIcon={PersonOutlined} label="Profile" />
    </nav>
  );
};

export default Navbar;
