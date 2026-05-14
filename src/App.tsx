import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthPage } from './features/auth/pages/AuthPage/AuthPage';
import HomePage from './features/auth/pages/HomePage/HomePage';
import MyReportsPage from './features/auth/pages/ReportsPage/MyReportsPage';
import ProfilePage from './features/auth/pages/ProfilePage/ProfilePage';
import CreateReportPage from './features/auth/pages/CreateReportPage/CreateReportPage';
import { WorkerTasksView } from './features/worker/pages/WorkerTasksView';
import { ProtectedRoute } from './components/ProtectedRoute';
import ManagerDashboardPage from './features/manager/pages/ManagerDashboardPage/ManagerDashboardPage';
import StaffManagement from './features/pages/OfficialPages/StaffManagement';
import OfficialDashboard from './features/pages/OfficialPages/OfficialDashboard';
import { PagesEnum } from './enums/PagesEnum';

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';
  return (
    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Shared Citizen & Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Citizen', 'Manager']} />}>
            <Route path={`/${PagesEnum.REPORTS}`} element={<MyReportsPage />} />
          </Route>

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Citizen']} />}>
            <Route path={`/${PagesEnum.HOME}`} element={<HomePage />} />
            <Route path={`/${PagesEnum.CREATE}`} element={<CreateReportPage />} />
          </Route>

          {/* Worker Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path={`/${PagesEnum.WORKER_POOL}`} element={<WorkerTasksView mode="pool" />} />
            <Route path={`/${PagesEnum.WORKER_TASKS}`} element={<WorkerTasksView mode="myTasks" />} />
          </Route>

          {/* Shared Manager & Official Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Manager', 'Official']} />}>
            <Route path={`/${PagesEnum.MAP}`} element={<HomePage />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
            <Route path={`/${PagesEnum.MANAGER_DASHBOARD}`} element={<ManagerDashboardPage />} />
          </Route>

          {/* Official Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Official']} />}>
            <Route path={`/${PagesEnum.OFFICIAL_DASHBOARD}`} element={<OfficialDashboard />} />
            <Route path={`/${PagesEnum.OFFICIAL_STAFF}`} element={<StaffManagement />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Navbar />}
    </div>
  );
};

export default App;
