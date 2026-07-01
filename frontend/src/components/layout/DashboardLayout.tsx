import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AnimatedBackground from "../common/AnimatedBackground";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <AnimatedBackground />

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
