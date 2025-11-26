import React, { useEffect, useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../../axios/axios";

function GRNTableRow(props) {
  const { item, onDelete } = props;
  const { _id } = item;
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [sellingPrice, setSellingPrice] = useState(0);

  const fetchUnits = async () => {
    try {
      const response = await axiosInstance.get(`/item-units/${_id}`);
      if (response.data && response.data.length > 0) {
        setUnits(response.data);
        setSelectedUnit(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [_id]);

  useEffect(() => {
    if (selectedUnit) {
      item.unit_received = selectedUnit.unit_name;
      item.to_base_qty = selectedUnit.to_base_qty;
    }
    item.purchaseQty = purchaseQty;
    item.unitPrice = unitPrice;
    item.expiry_date = expiryDate;
    item.sellingPrice = sellingPrice;
    item.total_value = totalPrice;
  }, [
    selectedUnit,
    purchaseQty,
    unitPrice,
    expiryDate,
    sellingPrice,
    item,
    totalPrice,
  ]);

  useEffect(() => {
    if (selectedUnit) {
      setTotalPrice(
        (unitPrice * selectedUnit.to_base_qty * purchaseQty).toFixed(2)
      );
    }
  }, [unitPrice, selectedUnit, purchaseQty]);

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>
        {units.length > 0 ? (
          <Select
            size="small"
            fullWidth
            value={selectedUnit?._id || ""}
            onChange={(e) => {
              const unit = units.find((u) => u._id === e.target.value);
              setSelectedUnit(unit);
            }}
          >
            {units.map((unit) => (
              <MenuItem key={unit._id} value={unit._id}>
                {unit.unit_name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          "No units available"
        )}
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          type="number"
          label="Purchasing Quantity"
          value={purchaseQty}
          onChange={(e) => setPurchaseQty(Number(e.target.value))}
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          type="number"
          label="Base Unit Price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          type="number"
          label="Base Unit Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(Number(e.target.value))}
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          type="date"
          label="Expiry Date"
          InputLabelProps={{ shrink: true }}
          value={expiryDate}
          inputProps={{
            min: new Date(new Date().setDate(new Date().getDate() + 5))
              .toISOString()
              .split("T")[0],
          }}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          label="Total Price"
          value={totalPrice}
          disabled
        />
      </TableCell>
      <TableCell align="center">
        <IconButton size="small" sx={{ color: "red" }} onClick={onDelete}>
          <DeleteIcon fontSize=".9em" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default GRNTableRow;
