import styles from "./insights.styles.module.css";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

function InsightBox(props) {
  const { icon, name, value, state, percentage, prog_indicator } = props;
  return (
    <div className={styles.insight_box_container}>
      <div className={styles.card_details}>
        <span className={styles.insight_icon}>{icon}</span>
        <span className={styles.insight_name}>{name}</span>
      </div>
      <div className={styles.valuation_container}>
        <span className={styles.insight_value}>{value}</span>
        {prog_indicator ? (
          <div
            className={`${state ? `${styles.profit}` : `${styles.loss}`} ${
              styles.percentage_cont
            }`}
          >
            {state ? <TrendingUpIcon /> : <TrendingDownIcon />}
            <span className={styles.insight_percentage}>{percentage}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default InsightBox;
