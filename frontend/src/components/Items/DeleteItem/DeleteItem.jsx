import { useState } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import GppBadIcon from "@mui/icons-material/GppBad";
import axiosInstance from "../../../axios/axios";
import styles from "./delete_items.styles.module.css";
import Alert from "@mui/material/Alert";

function DeleteItem(props) {
  const { id, closeWindow } = props;
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteItem = async () => {
    try {
      const response = await axiosInstance.delete(`/items/${id}`);
      if (response) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
        setTimeout(() => {
          closeWindow();
        }, 2100);
      }
    } catch (error) {
      console.log(error.message || "issue occured while deleting the item");
    }
  };

  return (
    <div className={styles.di_main_container}>
      <div className={styles.di_headline}>Delete Item</div>
      <p className={styles.di_prompt_body}>
        You are about to delete the selected item(s). This action can not be
        undone. Are you sure you want to proceed?
      </p>
      <div className={styles.di_btn_container}>
        <Button
          startIcon={<DeleteIcon />}
          className={styles.di_btn}
          color="error"
          size="medium"
          variant="contained"
          onClick={() => deleteItem()}
        >
          Delete
        </Button>
        <Button
          startIcon={<GppBadIcon />}
          className={styles.di_btn}
          color="primary"
          size="medium"
          variant="contained"
          onClick={() => closeWindow()}
        >
          Cancel
        </Button>
      </div>
      {isSuccess && (
        <Alert severity="success" sx={{ mt: "20px" }}>
          Item deleted successfully!
        </Alert>
      )}
    </div>
  );
}

export default DeleteItem;
