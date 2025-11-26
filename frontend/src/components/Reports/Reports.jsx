import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./reports.styles.module.css";
import Button from "@mui/material/Button";
import ReportList from "../../data/report_list";
import { useNavigate } from "react-router-dom";
import ReportCard from "./Report_Card/ReportCard";

function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className={styles.reports_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Report Generation</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}></div>
        </div>
        {/* reports type displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <div className={styles.report_blocks_container}>
              {ReportList.map((item) => {
                return <ReportCard reportData={item} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
