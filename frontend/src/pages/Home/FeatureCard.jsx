import styles from "./fc.style.module.css";

function FeatureCard(props) {
  const { featureData } = props;
  const { image, headline, description } = featureData;
  return (
    <div className={styles.feature_card_container}>
      {/* fc image container */}
      <div className={styles.fc_image_container}>
        <img src={image} className={styles.fc_img} />
      </div>
      {/* fc heading */}
      <h3 className={styles.fc_headline}>{headline}</h3>
      {/* fc description */}
      <p className={styles.fc_description}>{description}</p>
    </div>
  );
}

export default FeatureCard;
