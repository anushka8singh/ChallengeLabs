import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  LogOut,
  Zap,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/challenges',
    label: 'Challenges',
    icon: BookOpen,
  },
  {
    to: '/completed',
    label: 'Completed',
    icon: CheckCircle2,
  },
];

interface SidebarProps{
    open:boolean;
    closeSidebar:()=>void;
}

const Sidebar = ({
    open,
}:SidebarProps)=>{
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
   <aside
    className={`sidebar ${
        open
            ? ""
            : "sidebar--hidden"
    }`}
>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={18} className="text-purple-400" />
        </div>
        <span className="sidebar-logo-text">ChallengeLabs</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
       {isAdmin && (
  <>
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        `sidebar-nav-item ${
          isActive ? "sidebar-nav-item--active" : ""
        }`
      }
    >
      <ShieldCheck size={16} />
      <span>Admin</span>
    </NavLink>

    <NavLink
      to="/admin/users"
      className={({ isActive }) =>
        `sidebar-nav-item ${
          isActive ? "sidebar-nav-item--active" : ""
        }`
      }
    >
      <Users size={16} />
      <span>Users</span>
    </NavLink>
  </>
)}
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name ?? 'User'}</p>
            <p className="sidebar-user-email">{user?.email ?? ''}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout" title="Sign out">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
