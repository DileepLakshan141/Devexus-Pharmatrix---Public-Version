import { useState, useEffect } from "react";
import styles from "./lsid.styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../../axios/axios";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import dayjs from "dayjs";

function LowStockItemsDisplayer() {
  const [loading, setLoading] = useState();
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const gridRef = useGridApiRef();

  const exportAsPdf = () => {
    gridRef.current.exportDataAsPrint();
  };

  const columns = [
    {
      field: "id",
      headerName: "Item ID",
      width: 180,
    },
    {
      field: "name",
      headerName: "Item Name",
      width: 180,
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 140,
    },
    {
      field: "stock_quantity",
      headerName: "Remaining Stocks",
      width: 180,
    },
    {
      field: "reorder_level",
      headerName: "Reorder Level",
      width: 180,
    },
  ];

  const fetchLowStockAlerts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/inventory/low-stock");
      if (response.data) {
        console.log(response.data);
        setLowStockAlerts(
          response.data.data.map((record) => {
            return {
              ...record,
              id: record._id,
              name: record.item.name,
              reorder_level: record.item.reorder_level,
              sku: record.item.sku,
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
    fetchLowStockAlerts();
  }, []);

  return (
    <div className={styles.reports_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Low Stock Alerts</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
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
        {/* low stock alerts displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <div className={styles.lowstock_items_container}>
              <DataGrid
                apiRef={gridRef}
                sx={{ width: "100%" }}
                columns={columns}
                rows={lowStockAlerts}
                disableRowSelectionOnClick
                checkboxSelection={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LowStockItemsDisplayer;
