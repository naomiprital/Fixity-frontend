import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  Home,
  AssignmentOutlined,
  Assignment,
  PersonOutlined,
  Person,
  Add,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './Navbar.css';
import { PagesEnum } from '../enums/PagesEnum';
import { capitalizeFirstLetter } from '../utils/utilsFunctions';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();

  const NavItem = ({
    page,
    filledIcon,
    outlinedIcon,
  }: {
    page: PagesEnum;
    filledIcon: any;
    outlinedIcon: any;
  }) => {
    const path = `/${page}`;
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    const color = isActive ? theme.palette.primary.main : theme.palette.text.disabled;
    const Icon = isActive ? filledIcon : outlinedIcon;

    return (
      <div className="nav-item" onClick={() => navigate(path)}>
        <Icon style={{ color }} fontSize="large" />
        <span style={{ color }}>{capitalizeFirstLetter(page)}</span>
      </div>
    );
  };

  return (
    <nav className="bottom-navbar">
      <NavItem page={PagesEnum.HOME} filledIcon={Home} outlinedIcon={HomeOutlined} />

      <div className="nav-fab-container">
        <button className="nav-fab" onClick={() => navigate(`/${PagesEnum.CREATE}`)}>
          <Add fontSize="large" />
        </button>
      </div>

      <NavItem page={PagesEnum.REPORTS} filledIcon={Assignment} outlinedIcon={AssignmentOutlined} />
      <NavItem page={PagesEnum.PROFILE} filledIcon={Person} outlinedIcon={PersonOutlined} />
    </nav>
  );
};

export default Navbar;
