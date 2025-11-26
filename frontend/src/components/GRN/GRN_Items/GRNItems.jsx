import React from "react";
import style from "./grn.styles.module.css";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

function GRNItems(props) {
  const { table } = props;

  const rows = table.map((d, index) => {
    const expiryDate = dayjs(d.expiry_date);
    return {
      id: d.id || index,
      ...d,
      exp_date: expiryDate.isValid()
        ? expiryDate.format("DD MMMM, YYYY")
        : "Not set",
      cost_price: d.cost_price_per_base.toFixed(2),
      sell_price: d.selling_price_per_base.toFixed(2),
    };
  });

  const columns = [
    {
      field: "batch_no",
      headerName: "Batch Number",
      width: 220,
    },
    {
      field: "exp_date",
      headerName: "Expiry Date",
      width: 200,
    },
    {
      field: "unit_received",
      headerName: "Received Unit",
      width: 140,
    },
    {
      field: "qty_received",
      headerName: "Quantity",
      width: 100,
    },
    {
      field: "cost_price",
      headerName: "Cost Price(per Base Unit)",
      width: 150,
    },
    {
      field: "sell_price",
      headerName: "Selling Price(per Base Unit)",
      width: 150,
    },
    {
      field: "total_value",
      headerName: "Total (LKR)",
      width: 120,
    },
  ];

  return (
    <div className={style.module_container}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          fontFamily: "sans-serif , Manrope",
        }}
      >
        Inserted Items
      </h2>
      <DataGrid
        columns={columns}
        rows={rows}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default GRNItems;
