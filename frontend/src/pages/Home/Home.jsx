import styles from "./home.styles.module.css";
import ChromeBox from "../../assets/images/chrome-box.png";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import feature_data from "../../data/feature_list";
import FeatureCard from "./FeatureCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.main_container}>
      {/* hero section */}
      <div className={styles.hero_section}>
        <div className={styles.hs_content_container}>
          {/* header */}
          <div className={styles.header_row}>
            <ol className={styles.header_links}>
              <li>Home</li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#demo">Demo</a>
              </li>
            </ol>
          </div>
          {/* hero content */}
          <div className={styles.hs_content}>
            <h2 className={styles.hs_sub_heading}>
              streamline your pharmacy operations with
              <h1 className={styles.hs_main_heading}>pharmatrix</h1>
            </h2>

            <p className={styles.hs_support_text}>
              A modern, cloud-based management system designed to enhance
              efficiency, reduce errors, and maximize profitability for
              pharmacies of all sizes.
            </p>

            {/* btns container */}
            <div className={styles.hs_btn_contaienr}>
              <Button
                sx={{ borderRadius: "30px", width: "180px", height: "50px" }}
                variant="contained"
                onClick={() => navigate("/signin")}
              >
                Get Started
              </Button>
              <Button
                sx={{
                  borderRadius: "30px",
                  width: "180px",
                  height: "50px",
                  color: "white",
                  borderColor: "white",
                  border: "2px solid white",
                  ml: "20px",
                }}
                variant="outlined"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.hs_placeholder_cont}>
          <img
            src={ChromeBox}
            alt="chromium-boxes-3d"
            className={styles.chrome_box_img}
          />
        </div>
      </div>
      {/* features section */}
      <div className={styles.features_section} id="features">
        <h2 className={styles.fs_headline}>
          core features of <p className={styles.fs_hard_text}>pharmatrix</p>
        </h2>
        <div className={styles.fs_content_container}>
          {feature_data.map((feature, index) => {
            return <FeatureCard key={index} featureData={feature} />;
          })}
        </div>
      </div>
      {/* demo section */}
      <div className={styles.demo_section} id="demo">
        <h1 className={styles.ds_headline}>
          Ready to Elevate Your Pharmacy Management?
        </h1>
        <p className={styles.ds_description}>
          Join the growing network of pharmacies transforming their operations
          with Pharmatrix. Our intuitive, cloud-based solution boosts
          efficiency, reduces errors, and drives profitability, allowing you to
          focus on what matters most: patient care.
        </p>

        <Alert
          severity="warning"
          sx={{ mt: "20px", mb: "20px", width: "100%", maxWidth: "700px" }}
        >
          {" "}
          For the best demo experience, we recommend using a{" "}
          <b>desktop or laptop</b>. This web application is optimized for larger
          screens to provide a smoother, more responsive experience.
          <br />
          <br />
          <b>Login Credentials</b>
          <br />
          <b>Email:</b> pharmatrix141staff@gmail.com <br /> <b>Password:</b>{" "}
          pharma@staff1122
        </Alert>
        <div className={styles.ds_btn_container}>
          <Button
            variant="contained"
            sx={{ width: "150px" }}
            onClick={() => navigate("/signin")}
          >
            Start Demo
          </Button>
          <Button variant="outlined" sx={{ width: "150px", ml: "20px" }}>
            Contact Sales
          </Button>
        </div>
      </div>
      {/* footer section */}
      <div className={styles.footer_section}>
        <p className={styles.footer_text}>
          © 2025 <b>Pharmatrix</b>. All rights reserved.
        </p>
        <p className={styles.footer_credit}>
          Developed by{" "}
          <a
            href="https://dileepthedev.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dileep Lakshan
          </a>
        </p>
      </div>
    </div>
  );
}

export default Home;
