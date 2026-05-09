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

  const authDataString = localStorage.getItem('fixity.auth');
  let userRole = '';
  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString) as AuthResponse;
      userRole = authData.user?.role || '';
    } catch (e) {}
  }
  const isManagerOrOfficial = userRole === 'Manager' || userRole === 'Official';

  const NavItem = ({
    page,
    filledIcon,
    outlinedIcon,
    label,
  }: {
    page: PagesEnum;
    filledIcon: any;
    outlinedIcon: any;
    label?: string;
  }) => {
    const path = `/${page}`;
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    const color = isActive ? theme.palette.primary.main : theme.palette.text.disabled;
    const Icon = isActive ? filledIcon : outlinedIcon;
    const displayLabel = label || capitalizeFirstLetter(page);

    return (
      <div className="nav-item" onClick={() => navigate(path)}>
        <Icon style={{ color }} fontSize="large" />
        <span style={{ color }}>{displayLabel}</span>
      </div>
    );
  };

  return (
    <nav className="bottom-navbar">
      <NavItem page={PagesEnum.HOME} filledIcon={Home} outlinedIcon={HomeOutlined} />

      {isManagerOrOfficial ? (
        <NavItem page={PagesEnum.MANAGER_DASHBOARD} filledIcon={Dashboard} outlinedIcon={DashboardOutlined} label="Manager" />
      ) : (
        <div className="nav-fab-container">
          <button className="nav-fab" onClick={() => navigate(`/${PagesEnum.CREATE}`)}>
            <Add fontSize="large" />
          </button>
        </div>
      )}

      <NavItem page={PagesEnum.REPORTS} filledIcon={Assignment} outlinedIcon={AssignmentOutlined} />
      <NavItem page={PagesEnum.PROFILE} filledIcon={Person} outlinedIcon={PersonOutlined} />
    </nav>
  );
};

export default Navbar;
