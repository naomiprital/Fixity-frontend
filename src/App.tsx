import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthPage } from './features/auth/pages/AuthPage/AuthPage';
import HomePage from './features/reports/pages/HomePage/HomePage';
import MyReportsPage from './features/reports/pages/ReportsPage/MyReportsPage';
import ProfilePage from './features/profile/pages/ProfilePage/ProfilePage';
import CreateReportPage from './features/reports/pages/CreateReportPage/CreateReportPage';
import { WorkerTasksView } from './features/worker/pages/WorkerTasksView';
import { ProtectedRoute } from './components/ProtectedRoute';
import ManagerDashboardPage from './features/manager/pages/ManagerDashboardPage/ManagerDashboardPage';
import StaffManagement from './features/official/pages/StaffManagement';
import OfficialDashboard from './features/official/pages/OfficialDashboard';
import { PagesEnum } from './enums/PagesEnum';

const App = () => {
  const appLocation = useLocation();
  const isAuthPage = appLocation.pathname === '/';
  return (
    <div className="app-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthPage />} />

          {/* Shared Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={`/${PagesEnum.PROFILE}`} element={<ProfilePage />} />
          </Route>

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Citizen']} />}>
            <Route path={`/${PagesEnum.CITIZEN_HOME}`} element={<HomePage />} />
            <Route path={`/${PagesEnum.CITIZEN_REPORTS}`} element={<MyReportsPage />} />
            <Route path={`/${PagesEnum.CITIZEN_CREATE}`} element={<CreateReportPage />} />
          </Route>

          {/* Worker Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path={`/${PagesEnum.WORKER_POOL}`} element={<WorkerTasksView mode="pool" />} />
            <Route path={`/${PagesEnum.WORKER_TASKS}`} element={<WorkerTasksView mode="myTasks" />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
            <Route path={`/${PagesEnum.MANAGER_HOME}`} element={<HomePage />} />
            <Route path={`/${PagesEnum.MANAGER_REPORTS}`} element={<MyReportsPage />} />
            <Route path={`/${PagesEnum.MANAGER_DASHBOARD}`} element={<ManagerDashboardPage />} />
          </Route>

          {/* Official Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Official']} />}>
            <Route path={`/${PagesEnum.OFFICIAL_DASHBOARD}`} element={<OfficialDashboard />} />
            <Route path={`/${PagesEnum.OFFICIAL_STAFF}`} element={<StaffManagement />} />
          </Route>

          {/* Shared Map Route (Manager & Official) */}
          <Route element={<ProtectedRoute allowedRoles={['Manager', 'Official']} />}>
            <Route path={`/${PagesEnum.MAP}`} element={<HomePage />} />
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
