import { Menu, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
  toggleSidebar: () => void;
}

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/challenges": "Challenges",
  "/completed": "Completed",
};

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const label =
    Object.entries(routeLabels).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "ChallengeLabs";

  return (
    <header className="topbar">

     <div className="topbar-left">

  <button
    className="sidebar-toggle-btn"
    onClick={toggleSidebar}
    aria-label="Toggle Sidebar"
  >
    <Menu size={20} />
  </button>

  <div className="topbar-brand">

    <div className="topbar-brand-icon">
      <Zap size={18} />
    </div>

    <span className="topbar-brand-text">
      ChallengeLabs
    </span>

  </div>

</div>

      <div className="topbar-right">
        <div
          className="topbar-avatar"
          title={user?.name}
        >
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>

    </header>
  );
};

export default TopBar;
