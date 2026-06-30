import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">

      <Sidebar
        open={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="main-content">

        <TopBar
          toggleSidebar={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
