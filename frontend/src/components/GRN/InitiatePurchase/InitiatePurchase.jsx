import React from "react";
import { useState, useEffect } from "react";
import styles from "./ip.styles.module.css";
import Button from "@mui/material/Button";
import StoreIcon from "@mui/icons-material/Store";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import MedicationIcon from "@mui/icons-material/Medication";
import Autocomplete from "@mui/material/Autocomplete";
import axiosInstance from "../../../axios/axios";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Alert from "@mui/material/Alert";
import GRNTableRow from "../GRN_Table_Row/GRNTableRow";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

function InitiatePurchase() {
  const userId = useSelector((state) => state.user.user_id);
  const phases = {
    state1: "supplier_selection",
    state2: "item_selection",
    state3: "grn_mutate",
    state4: "end_confirmation",
  };

  const [phase, setPhase] = useState(phases.state1);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [fillerBarWidth, setFillerBarWidth] = useState(0);

  const fetchAllSuppliers = async () => {
    try {
      const response = await axiosInstance.get("/suppliers/");
      if (response) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.log(error.message || "error while fetching suppliers");
    }
  };

  const fetchTargetItems = async () => {
    if (!selectedSupplier) return;
    try {
      const response = await axiosInstance.get(
        `/items/sup-search/${selectedSupplier._id}`
      );
      if (response) {
        setItems(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRow = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    fetchAllSuppliers();
    fetchTargetItems();
  }, [phase, selectedSupplier, selectedItems]);

  const handleNextCom = () => {
    switch (phase) {
      case phases.state1:
        setPhase(phases.state2);
        setFillerBarWidth(260);
        break;
      case phases.state2:
        setPhase(phases.state3);
        setFillerBarWidth(530);
        break;
      case phases.state3:
        setPhase(phases.state4);
        setFillerBarWidth(800);
        break;
      default:
        setPhase(phases.state1);
        break;
    }
  };
  const handlePrevCom = () => {
    switch (phase) {
      case phases.state4:
        setPhase(phases.state3);
        setFillerBarWidth(530);
        break;
      case phases.state3:
        setPhase(phases.state2);
        setFillerBarWidth(260);
        break;
      case phases.state2:
        setPhase(phases.state1);
        setFillerBarWidth(0);
        break;
      default:
        break;
    }
  };

  //   this is the supplier selection component
  const SupplierSelection = () => {
    return (
      <div className={styles.ss_container}>
        <h3 className={styles.column_headers}>Select a supplier</h3>
        <p className={styles.partition_info}>
          You have to select a supplier from the existing supplier collection.
          Search by supplier name and select the supplier.
        </p>
        <div className={styles.selector_box}>
          <ContactPageIcon
            sx={{ fontSize: 65, color: "#bdc3c7" }}
            className={styles.animated_icon}
            color="primary"
          />

          <Autocomplete
            size="small"
            disablePortal
            sx={{ width: 300 }}
            options={suppliers}
            getOptionLabel={(option) => option.name || ""}
            getOptionKey={(option) => option._id}
            value={selectedSupplier}
            onChange={(_, value) => setSelectedSupplier(value)}
            renderInput={(params) => <TextField {...params} label="Supplier" />}
          />

          {selectedSupplier && (
            <Alert variant="outlined" severity="success" sx={{ marginTop: 2 }}>
              Supplier id is {selectedSupplier._id}
            </Alert>
          )}
        </div>
      </div>
    );
  };
  //   this is the item selection component
  const ItemSelection = () => {
    return (
      <div className={styles.ss_container}>
        <h3 className={styles.column_headers}>Select items</h3>
        <p className={styles.partition_info}>
          You have to select existing items from the existing item collection.
          Search by item name and select the item. make sure to add all the
          items you are going to insert to GRN.
        </p>
        <div className={styles.selector_box}>
          <MedicationIcon
            sx={{ fontSize: 65, color: "#bdc3c7" }}
            className={styles.animated_icon}
            color="primary"
          />

          <Autocomplete
            multiple
            disabled={selectedSupplier == null}
            size="small"
            id="item_multiple_selector"
            sx={{ width: 600 }}
            options={items}
            onChange={(event, value) => setSelectedItems(value)}
            value={selectedItems}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Items"
                placeholder="Select Products"
              />
            )}
          />

          {!selectedSupplier && (
            <Alert variant="outlined" severity="warning" sx={{ marginTop: 2 }}>
              You have not selected a supplier! Select a supplier first.
            </Alert>
          )}
        </div>
      </div>
    );
  };
  //   this is the grn selection component
  const GRNSelection = () => {
    return (
      <div className={styles.grn_container}>
        {selectedItems.length < 1 ? (
          <Alert severity="error">
            No items to GRN! Add some items to the roster first!
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item Name</TableCell>
                  <TableCell align="center">Unit Name</TableCell>
                  <TableCell align="center">Purchase Qty</TableCell>
                  <TableCell align="center">Base Unit Price</TableCell>
                  <TableCell align="center">Base Unit Sell Price</TableCell>
                  <TableCell align="center">Expire Date</TableCell>
                  <TableCell align="center">Total Value</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item) => {
                  return (
                    <GRNTableRow
                      key={item._id}
                      item={item}
                      onDelete={() => handleDeleteRow(item._id)}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    );
  };
  //   this is the final confirmation component
  function FinalConfirmation() {
    const [loading, setLoading] = useState(false);
    const [grnSuccessConfirmation, setGrnSuccessConfirmation] = useState(false);
    const batch_no = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const sbarOpen = () => {
      setGrnSuccessConfirmation(true);
    };

    const sbarClose = () => {
      setGrnSuccessConfirmation(false);
    };

    const sbarAction = (
      <React.Fragment>
        <IconButton
          size="small"
          centerRipple={true}
          aria-label="close"
          color="inherit"
          onClick={sbarClose}
        >
          <CancelIcon fontSize="small" color="inherit" />
        </IconButton>
      </React.Fragment>
    );

    const handleCreateGRN = async () => {
      if (!selectedSupplier || selectedItems.length === 0) {
        console.log("Supplier and items are required!");
        return;
      }

      setLoading(true);
      try {
        const payload = {
          supplier_id: selectedSupplier._id,
          recorded_by: userId,
          items: selectedItems.map((item) => ({
            item_id: item._id,
            batch_no: batch_no || "BATCH-001",
            expiry_date: item.expiry_date || new Date(),
            unit_received: item.unit_received,
            qty_received: item.purchaseQty,
            cost_price_per_base: item.unitPrice,
            selling_price_per_base: item.sellingPrice || 0,
            total_value: item.total_value || 0,
          })),
          remarks: "New GRN purchase created",
        };

        const res = await axiosInstance.post("/grns", payload);
        if (res.data.success) {
          sbarOpen();
          setTimeout(() => {
            setSelectedItems([]);
            setPhase(phases.state1);
            setFillerBarWidth(0);
          }, 2000);
        }
      } catch (error) {
        toast.error(
          error.response.data.message || "Issue occured! try again later!"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={styles.final_container}>
        <p className={styles.guideline_paragraph}>
          If you have correctly added the GRN items, please provide a batch
          number for this and finalize button to create the GRN purchase record.
        </p>
        <Button
          startIcon={<StoreIcon />}
          variant="contained"
          onClick={handleCreateGRN}
          disabled={loading || selectedItems.length === 0}
        >
          {loading ? "Creating..." : "Create GRN Purchase"}
        </Button>
        <Snackbar
          action={sbarAction}
          autoHideDuration={3000}
          open={grnSuccessConfirmation}
          message="GRN order created!"
        />
      </div>
    );
  }

  const navigate = useNavigate();
  return (
    <div className={styles.ip_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>GRN Purchase</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* initiate GRN purchase */}
            <Button
              startIcon={<ArrowBackIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </Button>
          </div>
        </div>

        {/* prompt text container */}
        <div className={styles.prompt_text_container}>
          This process consist with several steps. For a proper GRN purchase
          make sure you follow each step carefully and confirm the final
          purchase at the end.
        </div>

        {/* milestone bar */}
        <div className={styles.milestone_bar}>
          <div className={styles.milestone_progress_bar}></div>
          <div
            className={styles.filler_milestone_bar}
            style={{ width: `${fillerBarWidth}px` }}
          ></div>
          <div className={styles.milestone_tomb_marks}>
            {/* supplier */}
            <div
              className={`${styles.milestone_tomb} ${
                phase === phases.state1 ||
                phase === phases.state2 ||
                phase === phases.state3 ||
                phase === phases.state4
                  ? styles.active_tomb
                  : ""
              } `}
            >
              <LocalOfferIcon />
            </div>
            <div
              className={`${styles.milestone_tomb} ${
                phase === phases.state2 ||
                phase === phases.state3 ||
                phase === phases.state4
                  ? styles.active_tomb
                  : ""
              } `}
            >
              <InventoryIcon />
            </div>
            <div
              className={`${styles.milestone_tomb} ${
                phase === phases.state3 || phase === phases.state4
                  ? styles.active_tomb
                  : ""
              } `}
            >
              <ShoppingBagIcon />
            </div>
            <div
              className={`${styles.milestone_tomb} ${
                phase === phases.state4 ? styles.active_tomb : ""
              } `}
            >
              <CheckCircleIcon />
            </div>
          </div>
        </div>

        {/* main content */}
        <div className={styles.main_content}>
          <div className={styles.main_content}>
            {phase === phases.state1 ? (
              <SupplierSelection />
            ) : phase === phases.state2 ? (
              <ItemSelection />
            ) : phase === phases.state3 ? (
              <GRNSelection />
            ) : phase === phases.state4 ? (
              <FinalConfirmation />
            ) : null}
          </div>
        </div>

        {/* button container */}
        <div className={styles.button_container}>
          {phase != phases.state1 && (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              startIcon={<NavigateBeforeIcon />}
              className={styles.nav_btn}
              onClick={() => handlePrevCom()}
            >
              Previous
            </Button>
          )}
          {phase != phases.state4 && (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              endIcon={<NavigateNextIcon />}
              className={styles.nav_btn}
              onClick={() => handleNextCom()}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InitiatePurchase;
