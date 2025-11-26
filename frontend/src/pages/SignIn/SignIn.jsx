import { useState } from "react";
import axiosInstance from "../../axios/axios";
import { useDispatch } from "react-redux";
import { signin } from "../../app/user.slice";
import styles from "./signin.styles.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import PlaceHolderImage from "../../assets/images/signin-cover.jpg";
import LogoBW from "../../assets/images/pharmatrix-1.png";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("unexpected error occured");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignInProcess = async () => {
    if (!email || !password) {
      setErrorMessage("Please provide valid email and password!");
      setError(true);
      return;
    }
    try {
      const authResponse = await axiosInstance.post("/clients/auth", {
        email,
        password,
      });
      if (authResponse.data && authResponse.data.access_token) {
        dispatch(signin(authResponse.data));
        setError(false);
        navigate("/dashboard/main");
      } else {
        setError(true);
        setErrorMessage("Invalid response from server.");
      }
    } catch (e) {
      if (e.response.data.error) {
        setErrorMessage(e.response.data.error);
      } else {
        setErrorMessage(e.response.data.message || "Server went offline!");
      }
      setError(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    // main page container -> full monitor size
    <div className={styles.signin_container}>
      <div className={styles.signin_content}>
        {/* first column -> resides the all input field */}
        <div className={styles.inputs_column}>
          <img
            src={LogoBW}
            alt="pharmatrix-black-white-logo"
            className={styles.bw_signin_logo}
          />

          <h1 className={styles.signin_heading}>Sign In</h1>
          <p className={styles.signin_tooltip}>
            use your credentials for login to the system.
          </p>

          <TextField
            label="Email"
            size="small"
            margin="dense"
            fullWidth
            color="secondary"
            style={{ margin: "10px 0" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            size="small"
            margin="dense"
            fullWidth
            color="secondary"
            style={{ margin: "10px 0" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            style={{ fontSize: "1em", fontWeight: "500", marginTop: "30px" }}
            onClick={() => handleSignInProcess()}
          >
            Sign In
          </Button>
          <p className={styles.alternate_text}>
            Having problems sign in?{" "}
            <Link href="#" color="primary">
              contact us
            </Link>
          </p>

          {error && (
            <Alert severity="error" style={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          )}
        </div>
        {/* second column -> resides placeholder image for interactiveness */}
        <div
          className={styles.placeholder_column}
          style={{ backgroundImage: `url(${PlaceHolderImage})` }}
        ></div>
      </div>
    </div>
  );
}

export default SignIn;
