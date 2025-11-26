import React, { useState, useEffect } from "react";
import styles from "./batch_info.styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import axiosInstance from "../../../axios/axios";

function Batch_Information() {
  const [loading, setLoading] = useState(false);
  const [itemBatches, setItemBatches] = useState([]);

  const columns = [
    {
      field: "batch_no",
      headerName: "Batch Number",
      width: 130,
    },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 150,
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 150,
    },
    {
      field: "exp_date_format",
      headerName: "Expire Date",
      width: 120,
    },
    {
      field: "grn_no",
      headerName: "GRN NO",
      width: 120,
    },
    {
      field: "unit_received",
      headerName: "Unit",
      width: 80,
    },
    {
      field: "qty_received",
      headerName: "Qty(Unit Wise)",
      width: 80,
    },
    {
      field: "base_qty",
      headerName: "Qty(Base)",
      width: 80,
    },
    {
      field: "qty_sold",
      headerName: "Sold Qty",
      width: 80,
    },
    {
      field: "cost_price_per_base",
      headerName: "Cost Price",
      width: 100,
    },
    {
      field: "selling_price_per_base",
      headerName: "Sell Price",
      width: 100,
    },
  ];

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/item-batches/");
      console.log(response);
      const events = response.data.data.map((batch) => ({
        ...batch,
        key: batch._id,
        item_name: batch.item_id.name,
        supplier: batch.item_id.supplier.name,
        id: batch._id,
        title: `${batch.batch_no}`,
        grn_no: batch.grn_id.grn_no,
        exp_date_format: dayjs(new Date(batch.expiry_date)).format(
          "MMM DD, YYYY"
        ),
        resource: batch,
      }));
      setItemBatches(events);
    } catch (error) {
      console.log(
        error?.data?.data?.message || "error while fetching batch information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  return (
    <div className={styles.bim_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>
            Item Batch Information
          </span>
          {/* btns-container */}
          <div className={styles.top_btns_container}></div>
        </div>
        <div className={styles.content_holder}>
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size="3rem" />
            </div>
          ) : (
            <DataGrid
              columns={columns}
              rows={itemBatches}
              sx={{ width: "100%", height: "100%" }}
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

export default Batch_Information;
