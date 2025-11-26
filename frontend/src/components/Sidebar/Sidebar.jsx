import React, { useEffect, useState } from "react";
import styles from "./sidebar.styles.module.css";
import Logo from "../../assets/images/pharmatrix-1.png";
import { signout } from "../../app/user.slice.js";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// icons
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// links
import { sidebar_data } from "../../data/sidebar.data.jsx";
import IconButton from "@mui/material/IconButton";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Tooltip from "@mui/material/Tooltip";
import axiosInstance from "../../axios/axios.js";
import { toast } from "react-hot-toast";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [sideBarActivated, setSideBarActivated] = useState(true);

  const toaster_styles = {
    border: "1px solid #2c3e50",
    borderRadius: "4px",
    paddingTop: "5px",
    color: "#2c3e50",
  };

  const toaster_icon_styles = {
    primary: "#2c3e50",
    secondary: "#FFFAEE",
  };

  const logoutHandler = async () => {
    try {
      const response = await axiosInstance.get("/clients/signout");
      console.log("Logout response:", response);

      if (response.status === 204 || response.status === 200) {
        navigate("/signin");
        dispatch(signout());
        toast.success("Logout Successful!", {
          style: toaster_styles,
          iconTheme: toaster_icon_styles,
        });
      } else {
        toast.error(`Unexpected status: ${response.status}`, {
          style: toaster_styles,
          iconTheme: toaster_icon_styles,
        });
      }
    } catch (e) {
      console.error("Logout error (caught):", e);
      toast.error(e.message, {
        style: toaster_styles,
        iconTheme: toaster_icon_styles,
      });
    }
  };

  useEffect(() => {
    const button = document.getElementById("toggler_button");
    const handleClick = () => {
      setSideBarActivated((prev) => !prev);
    };

    if (button) {
      button.addEventListener("click", handleClick);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.sidebar_container} ${
        sideBarActivated ? styles.activate_sidebar : ""
      }`}
      id="sidebar_container"
    >
      <div
        className={`${styles.toggler_button} ${
          sideBarActivated ? styles.toggle_sidebar : ""
        }`}
        id="toggler_button"
      >
        <ArrowForwardIosIcon fontSize="small" className={styles.toggler_icon} />
      </div>
      {/* company logo */}
      <div className={styles.sidebar_logo}>
        <img
          src={Logo}
          alt="pharmatrix-logo"
          className={styles.sidebar_logo_img}
        />
      </div>
      {/* link container */}
      <div className={styles.sidebar_link_container}>
        {sidebar_data.map((section, index) => (
          <div key={index}>
            <div className={styles.sidebar_section_name}>
              <div className={styles.main_section}>{section.section_name}</div>
            </div>
            {section.sub_sections.map((sublink, subIndex) => (
              <div key={subIndex} className={styles.sub_section_container}>
                <div
                  className={`${styles.sidebar_link_cont_box} ${
                    location.pathname.startsWith(`/dashboard/${sublink.link}`)
                      ? styles.selected_link_cont_box
                      : ""
                  } ${sideBarActivated ? styles.active_cont_box : ""}`}
                  onClick={() => navigate(sublink.link)}
                >
                  {sublink.icon}
                  {sideBarActivated && (
                    <span className={styles.sidebar_link_name}>
                      {sublink.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* logout button */}
        <Tooltip title="Logout From Application">
          <IconButton
            color="primary"
            sx={{ mt: "50px" }}
            onClick={() => logoutHandler()}
          >
            <MeetingRoomIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;
