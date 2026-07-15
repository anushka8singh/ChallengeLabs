import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChallengePage from './pages/ChallengePage';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import LabWorkspacePage from './pages/LabWorkspacePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCreateChallengePage from './pages/AdminCreateChallengePage';
import AdminChallengeTasksPage from './pages/AdminChallengeTasksPage';
import AdminCreateTaskPage from './pages/AdminCreateTaskPage';
import AdminEditChallengePage from './pages/AdminEditChallengePage';
import AdminEditTaskPage from './pages/AdminEditTaskPage';
import CompletedChallengesPage from './pages/CompletedChallengesPage';
import LandingPage from './pages/LandingPage';
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface-3)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--surface-3)' } },
            error:   { iconTheme: { primary: 'var(--error)',   secondary: 'var(--surface-3)' } },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Lab workspace — full screen, no sidebar */}
            <Route path="/lab/:sessionId" element={<LabWorkspacePage />} />

            {/* Dashboard shell with sidebar */}
            <Route element={<DashboardLayout />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/challenges" element={<ChallengePage />} />
  <Route path="/challenges/:slug" element={<ChallengeDetailsPage />} />
  <Route
  path="/completed"
  element={<CompletedChallengesPage />}
/>
  <Route path="/admin" element={<AdminDashboardPage />} />
  <Route path="/admin/challenges/new" element={<AdminCreateChallengePage />} />
  <Route path="/admin/challenges/:challengeId/tasks" element={<AdminChallengeTasksPage />} />
  <Route path="/admin/challenges/:challengeId/tasks/new" element={<AdminCreateTaskPage />} />
  <Route
  path="/admin/challenges/:challengeId/edit"
  element={<AdminEditChallengePage />}
/>
<Route
  path="/admin/tasks/:taskId/edit"
  element={<AdminEditTaskPage />}
/>

</Route>

          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
