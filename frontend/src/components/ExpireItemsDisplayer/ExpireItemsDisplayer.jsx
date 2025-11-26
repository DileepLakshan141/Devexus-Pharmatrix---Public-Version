import { useState, useEffect } from "react";
import styles from "./eid.styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../../axios/axios";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

function ExpireItemsDisplayer() {
  const [loading, setLoading] = useState();
  const [expireAlerts, setExpireAlerts] = useState([]);
  const [writeOffModalOpen, setWriteOffModalOpen] = useState(false);
  const gridRef = useGridApiRef();

  const closeWriteOffModal = () => {
    setWriteOffModalOpen(false);
  };

  const openWriteOffModal = () => {
    setWriteOffModalOpen(true);
  };

  const writeOffStocks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory/writeoff");
      if (response.data) {
        toast.success(response.data.message);
      }
      setTimeout(() => {
        fetchExpireAlerts();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
      closeWriteOffModal();
    }
  };

  const boxStyles = {
    width: "500px",
    padding: "20px 10px",
    backgroundColor: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  };

  const exportAsPdf = () => {
    gridRef.current.exportDataAsPrint();
  };

  const columns = [
    {
      field: "id",
      headerName: "Batch No",
      width: 180,
    },
    {
      field: "date",
      headerName: "Purchase Date",
      width: 140,
    },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 180,
    },
    {
      field: "unit_received",
      headerName: "Unit",
      width: 80,
    },
    {
      field: "qty_received",
      headerName: "Qty",
      width: 100,
    },
    {
      field: "base_qty",
      headerName: "Base Qty",
      width: 100,
    },
    {
      field: "qty_sold",
      headerName: "Sold Qty",
      width: 100,
    },
    {
      field: "expiry_date",
      headerName: "Expire Date",
      width: 130,
    },
  ];

  const fetchExpireAlerts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory/expire-alerts");
      if (response.data) {
        console.log(response.data);
        setExpireAlerts(
          response.data.data.map((record) => {
            return {
              ...record,
              id: record.batch_no,
              date: dayjs(record.createdAt).format("DD MMM, YYYY"),
              expiry_date: dayjs(record.expiry_date).format("DD MMM, YYYY"),
              item_name: record.item_id.name,
            };
          })
        );
      }
    } catch (error) {
      toast.error(
        error.data?.message || "Error occurred while retrieving the data!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpireAlerts();
  }, []);

  return (
    <div className={styles.reports_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Expire Alerts</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* remove expired items */}
            <Button
              sx={{ mr: "20px" }}
              startIcon={<RemoveShoppingCartIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                openWriteOffModal();
              }}
            >
              Remove Expired Batches
            </Button>
            {/* export as pdf */}
            <Button
              className={styles.top_btn}
              startIcon={<PictureAsPdfIcon />}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                exportAsPdf();
              }}
            >
              Export as PDF
            </Button>
          </div>
        </div>
        {/* expire alerts displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <div className={styles.expired_items_container}>
              <DataGrid
                apiRef={gridRef}
                sx={{ width: "100%" }}
                columns={columns}
                rows={expireAlerts}
                disableRowSelectionOnClick
                checkboxSelection={true}
              />
            </div>
          )}
        </div>
      </div>
      <Modal open={writeOffModalOpen} onClose={closeWriteOffModal}>
        <Box sx={boxStyles}>
          <h3 className={styles.writeoff_modal_head}>
            Writeoff Expired from Inventory?
          </h3>
          <p className={styles.writeoff_modal_para}>
            Following action will be writeoff the all the current items which
            are <b>already expired</b> from the inventory. this action can not
            be undone. Are you sure you want to proceed
          </p>
          <div className={styles.writeoff_btn_container}>
            <Button
              startIcon={<CleaningServicesIcon />}
              color="primary"
              size="small"
              variant="contained"
              onClick={() => writeOffStocks()}
            >
              Proceed
            </Button>
            <Button
              color="primary"
              size="small"
              variant="contained"
              sx={{ ml: "15px" }}
              endIcon={<DisabledByDefaultIcon />}
              onClick={() => closeWriteOffModal()}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ExpireItemsDisplayer;
