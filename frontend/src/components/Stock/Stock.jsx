import { useState, useEffect } from "react";
import React from "react";
import UnderDev from "../UnderDevelopment/UnderDev";
import { useNavigate } from "react-router-dom";
import styles from "./stock.styles.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import HealingIcon from "@mui/icons-material/Healing";
import axiosInstance from "../../axios/axios";

function Stock() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 200,
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 120,
    },
    {
      field: "barcode",
      headerName: "Barcode",
      width: 120,
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      width: 120,
    },
    {
      field: "stock_quantity",
      headerName: "Remaining Qty",
      width: 120,
    },
    {
      field: "reorder_level",
      headerName: "Reorder Level",
      width: 120,
    },
    {
      field: "last_updated",
      headerName: "Last Update On",
      width: 130,
    },
    {
      field: "last_grn",
      headerName: "Last GRN",
      width: 130,
    },
  ];

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

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory/");
      if (response.data) {
        console.log(response.data);
        setInventory(
          response.data.data.map((d) => {
            return {
              ...d,
              id: d._id,
              item_name: d.item_id.name,
              sku: d.item_id.sku,
              reorder_level: d.item_id.reorder_level,
              last_updated: dayjs(d.updatedAt).format("MMM DD, YYYY"),
              last_grn: d.last_grn_id.grn_no,
              barcode: d.item_id.barcode,
              manufacturer: d.item_id.manufacturer,
            };
          })
        );
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "error while fetching", {
        style: toaster_styles,
        iconTheme: toaster_icon_styles,
      });
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className={styles.stock_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Stock Management</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* item batches */}
            <Button
              sx={{ ml: "20px" }}
              startIcon={<BatchPredictionIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                navigate("batch-information");
              }}
            >
              Item Batches
            </Button>
            {/* shelf life manager */}
            <Button
              sx={{ ml: "20px" }}
              startIcon={<HealingIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                navigate("slm-manager");
              }}
            >
              Shelf Life Manager
            </Button>
          </div>
        </div>
        {/* grn history displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <DataGrid
              sx={{ width: "100%", height: "100%" }}
              columns={columns}
              rows={inventory}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 20, 30]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Stock;
