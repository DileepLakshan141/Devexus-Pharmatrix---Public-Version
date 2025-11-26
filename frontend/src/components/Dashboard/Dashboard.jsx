import React from "react";
import styles from "./dashboard.styles.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className={styles.dashboard_container}>
      <Sidebar />
      <div className={styles.content_switcher}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
