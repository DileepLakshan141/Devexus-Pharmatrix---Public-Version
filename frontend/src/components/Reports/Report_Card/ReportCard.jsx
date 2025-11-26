import React from "react";
import styles from "./rc.styles.module.css";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";

function ReportCard(props) {
  const { reportData } = props;
  const navigate = useNavigate();
  return (
    <div className={styles.rc_container}>
      <div className={styles.rc_img_container}>
        <img src={reportData.image} className={styles.rc_image} />
      </div>
      <h4 className={styles.rc_headline}>{reportData.title}</h4>
      <p className={styles.rc_description}>{reportData.description}</p>
      <Button
        startIcon={<PictureAsPdfIcon />}
        size="small"
        variant="contained"
        sx={{ mt: "20px", margin: "20px auto 0 auto" }}
        onClick={() => navigate(`${reportData.link}`)}
      >
        Generate Report
      </Button>
    </div>
  );
}

export default ReportCard;
