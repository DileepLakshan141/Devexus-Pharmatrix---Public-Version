import { useState } from "react";
import style from "./ds.styles.module.css";
import Button from "@mui/material/Button";
import axiosInstance from "../../../axios/axios";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import GppBadIcon from "@mui/icons-material/GppBad";

function DeleteSupplier(props) {
  const { closeModal, id } = props;
  const [showAlert, setShowAlert] = useState(false);

  const deleteSupplier = async () => {
    try {
      const response = axiosInstance.delete(`/suppliers/${id}`);
      if (response) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.ds_container}>
      <h2>Confirm Delete?</h2>
      <hr />
      <p className={style.ds_prompt_body}>
        You are about to delete the selected supplier(s). This action can not be
        undone. Are you sure you want to proceed?
      </p>
      <div className={style.ds_btn_container}>
        <Button
          startIcon={<DeleteIcon />}
          className={style.ds_btn}
          color="error"
          size="medium"
          variant="contained"
          onClick={deleteSupplier}
        >
          Delete
        </Button>
        <Button
          startIcon={<GppBadIcon />}
          className={style.ds_btn}
          color="primary"
          size="medium"
          variant="contained"
          onClick={closeModal}
        >
          Cancel
        </Button>
      </div>

      {showAlert && (
        <Alert variant="outlined" severity="success" className={style.ds_alert}>
          Record deleted successfully!
        </Alert>
      )}
    </div>
  );
}

export default DeleteSupplier;
