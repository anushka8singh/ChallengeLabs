import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/challenges': 'Challenges',
};

const TopBar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const label =
    Object.entries(routeLabels).find(([key]) => pathname.startsWith(key))?.[1] ?? 'ChallengeLabs';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{label}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-avatar" title={user?.name}>
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
