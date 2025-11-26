import ROLES from "../../../config/auth_roles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import styles from "./user.styles.module.css";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Chip from "@mui/material/Chip";
import AddUsers from "../AddUsers/AddUsers";
import axiosInstance from "../../../axios/axios";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { toast } from "react-hot-toast";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import dayjs from "dayjs";

function UsersMain() {
  const gridRef = useGridApiRef();
  const boxStyles = {
    minWidth: "600px",
    minHeight: "600px",
    backgroundColor: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 3,
    border: "2px solid black",
  };

  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 110,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "telephone",
      headerName: "Telephone",
      width: 130,
    },
    {
      field: "joined_date",
      headerName: "Joined Date",
      width: 120,
    },
    {
      field: "user_role",
      headerName: "User Role",
      width: 140,
      renderCell: (params) => {
        const isStaff = params.value === "STAFF";
        return (
          <Chip
            size="small"
            label={isStaff ? "Staff" : "Admin"}
            variant="outlined"
            sx={{ width: "80px" }}
            color={isStaff ? "info" : "warning"}
          ></Chip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const isActive = params.value === "activated";
        return (
          <Chip
            sx={{ width: "80px" }}
            size="small"
            color={isActive ? "success" : "error"}
            label={isActive ? "Active" : "Inactive"}
            variant="outlined"
          >
            {isActive ? "Active" : "Inactive"}
          </Chip>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        const isActive = params.row.status === "activated";
        const id = params.row.id;

        return (
          <Button
            sx={{ zoom: ".8" }}
            variant="contained"
            size="small"
            color={isActive ? "error" : "success"}
            onClick={() => handleStatusToggle(id, isActive)}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        );
      },
    },
  ];

  const handleStatusToggle = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/clients/status/${id}`);
      toast.success(response.data.message);
      getUsers();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/clients/");
      console.log(response);
      setUsers(
        response.data.data.map((user) => {
          return {
            ...user,
            id: user._id,
            joined_date: dayjs(user.createdAt).format("DD MMM, YYYY"),
            user_role: Object.keys(ROLES).find(
              (key) => ROLES[key] === user.user_role
            ),
          };
        })
      );
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAsPdf = () => {
    gridRef.current.exportDataAsPrint();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles.users_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>
            User Accounts Management
          </span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* create user account */}
            <Button
              startIcon={<PersonIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                setOpenUserCreateModal(true);
              }}
            >
              Add New User
            </Button>
            {/* create user account */}
            <Button
              sx={{ ml: "20px" }}
              startIcon={<PictureAsPdfIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => exportAsPdf()}
            >
              Export as PDF
            </Button>
          </div>
        </div>
        {/* reports type displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress size="3rem" color="primary" />
            </div>
          ) : (
            <DataGrid
              apiRef={gridRef}
              sx={{ width: "100%", height: "100%" }}
              columns={columns}
              rows={users}
              disableRowSelectionOnClick
              checkboxSelection={true}
            />
          )}
        </div>
        <Modal
          open={openUserCreateModal}
          onClose={() => {
            setOpenUserCreateModal(false);
          }}
        >
          <Box sx={boxStyles}>
            <AddUsers />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default UsersMain;
