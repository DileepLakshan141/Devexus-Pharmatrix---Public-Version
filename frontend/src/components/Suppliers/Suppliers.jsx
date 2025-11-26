import { useState, useEffect } from "react";
import styles from "./suppliers.styles.module.css";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../axios/axios";
import { DataGrid } from "@mui/x-data-grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateSupplier from "./UpdateSupplier/UpdateSupplier";
import DeleteSupplier from "./DeleteSupplier/DeleteSupplier";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierModal, setSupplierModal] = useState(false);
  const [supplierId, setSupplierId] = useState(null);
  const [updateSupplierModal, setUpdateSupplierModal] = useState(false);
  const [deleteSupplierModal, setDeleteSupplierModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("sample error message");
  const [alertState, setAlertState] = useState("hidden");

  const dataColumns = [
    {
      field: "name",
      sortable: true,
      headerName: "Supplier Name",
      width: 180,
    },
    {
      field: "contact_person",
      sortable: true,
      headerName: "Contact Person",
      width: 180,
    },
    {
      field: "email",
      sortable: true,
      headerName: "Email Address",
      width: 180,
    },
    {
      field: "phone",
      sortable: true,
      headerName: "Telephone Number",
      width: 130,
    },
    {
      field: "address",
      sortable: true,
      headerName: "Address",
      width: 180,
    },
    {
      field: "status",
      sortable: true,
      headerName: "Current Status",
      width: 100,
      renderCell: (params) => {
        const activated = params.value == "active";
        return (
          <Chip
            label={activated ? "Active" : "Inactive"}
            color={activated ? "primary" : "error"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "created_at",
      sortable: true,
      headerName: "Created Date",
      valueFormatter: (params) => dayjs(params).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "action",
      sortable: false,
      headerName: "Actions",
      width: 140,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", height: "100%" }}
          >
            <IconButton
              color="success"
              onClick={() => handleEdit(params.id)}
              variant="contained"
              size="small"
            >
              <EditDocumentIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(params.id)}
              variant="contained"
              size="small"
            >
              <DeleteForeverIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const supplierValidationScheme = Yup.object().shape({
    name: Yup.string()
      .required("Supplier name is required!")
      .min(3, "Supplier name at least 3 characters long!"),
    contactPerson: Yup.string()
      .required("Supplier's representative is required!")
      .min(3, "Supplier contact person name at least 3 characters long!"),
    email: Yup.string().required("Supplier email address is required!"),
    telephone: Yup.string()
      .required("Supplier telephone is required!")
      .matches(/^[0-9]+$/, "Must be only digits.")
      .min(10, "Must be least 10 digits.")
      .max(10, "Maximum 10 digits allowed."),
    address: Yup.string()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters"),
  });

  const initialValues = {
    name: "",
    contactPerson: "",
    email: "",
    telephone: "",
    address: "",
  };

  const createSupplier = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosInstance.post("/suppliers/", {
        name: values.name,
        contact_person: values.contactPerson,
        email: values.email,
        phone: values.telephone,
        address: values.address,
        gst: values.gst,
      });

      if (response.data) {
        setAlertMessage("Supplier created successfully!");
        setAlertState("success");
        resetForm();
        setTimeout(() => setAlertState("hidden"), 3000);
      }
    } catch (error) {
      setAlertMessage(
        error.message || "Error occurred while creating supplier"
      );
      setAlertState("error");
      setSubmitting(false);
    }
  };

  const handleOpen = () => setSupplierModal(true);
  const handleClose = () => setSupplierModal(false);
  const handleUpdateOpen = () => setUpdateSupplierModal(true);
  const handleUpdateClose = () => setUpdateSupplierModal(false);
  const handleDeleteOpen = () => setDeleteSupplierModal(true);
  const handleDeleteClose = () => setDeleteSupplierModal(false);

  const handleDelete = (id) => {
    setSupplierId(id);
    handleDeleteOpen();
  };

  const handleEdit = (id) => {
    setSupplierId(id);
    handleUpdateOpen();
  };

  const fetchAllSuppliers = async () => {
    try {
      const response = await axiosInstance.get("/suppliers/");
      if (response) {
        setLoading(false);
        setSuppliers(
          response.data.map((supplier) => ({
            ...supplier,
            id: supplier._id,
          }))
        );
      }
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  return (
    <div className={styles.supplier_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Suppliers Management</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* initiate GRN purchase */}
            <Button
              startIcon={<AccountCircleIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                handleOpen();
              }}
            >
              Add New Supplier
            </Button>
          </div>
        </div>

        {/* content holder */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress color="primary" size="3rem" />
          ) : (
            <DataGrid
              className={styles.data_grid_mods}
              columns={dataColumns}
              rows={suppliers}
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

      {/* modal add supplier */}
      <Modal open={supplierModal} onClose={handleClose}>
        <Box sx={boxStyle}>
          <Formik
            initialValues={initialValues}
            validationSchema={supplierValidationScheme}
            onSubmit={createSupplier}
          >
            {({ isSubmitting, handleReset }) => (
              <Form className={styles.supplier_add_form}>
                <h2>Add a new supplier</h2>
                <hr style={{ marginBottom: "20px" }} />
                {/* supplier name  and contact person*/}
                <div className={styles.input_row}>
                  <Field name="name">
                    {({ field, meta }) => {
                      return (
                        <TextField
                          {...field}
                          style={{ width: "70%" }}
                          size="small"
                          color="primary"
                          variant="outlined"
                          label="Supplier Name/Company"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                        />
                      );
                    }}
                  </Field>
                  <Field name="contactPerson">
                    {({ field, meta }) => {
                      return (
                        <TextField
                          {...field}
                          style={{ width: "70%", margin: "25px" }}
                          size="small"
                          color="primary"
                          variant="outlined"
                          label="Contact Person"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                        />
                      );
                    }}
                  </Field>
                </div>
                {/* supplier email  and phone*/}
                <div className={styles.input_row}>
                  <Field name="email">
                    {({ field, meta }) => {
                      return (
                        <TextField
                          {...field}
                          style={{ width: "70%" }}
                          className={styles.supplier_form_inp}
                          size="small"
                          color="primary"
                          variant="outlined"
                          label="Email Address"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                        />
                      );
                    }}
                  </Field>
                  <Field name="telephone">
                    {({ field, meta }) => {
                      return (
                        <TextField
                          {...field}
                          style={{ width: "70%", margin: "25px" }}
                          className={styles.supplier_form_inp}
                          size="small"
                          color="primary"
                          variant="outlined"
                          label="Telephone"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                        />
                      );
                    }}
                  </Field>
                </div>

                {/* supplier address  and gst number*/}
                <div className={styles.input_row}>
                  <Field name="address">
                    {({ field, meta }) => {
                      return (
                        <TextField
                          {...field}
                          style={{ width: "70%" }}
                          className={styles.supplier_form_inp}
                          size="small"
                          color="primary"
                          variant="outlined"
                          label="Address"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                        />
                      );
                    }}
                  </Field>
                </div>

                <div className={styles.btn_container_add_supp}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<AddBoxIcon />}
                    className={styles.btn_add_supplier}
                  >
                    {isSubmitting ? "Creating..." : "Create Supplier"}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<BackspaceIcon />}
                    className={styles.btn_add_supplier}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>

                {alertState != "hidden" && (
                  <Alert className={styles.alert_state} severity={alertState}>
                    {alertMessage}
                  </Alert>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* update supplier modal */}
      <Modal open={updateSupplierModal} onClose={handleUpdateClose}>
        <Box sx={boxStyle}>
          <UpdateSupplier id={supplierId} />
        </Box>
      </Modal>

      {/* delete ssupplier modal */}
      <Modal open={deleteSupplierModal} onClose={handleDeleteClose}>
        <Box sx={boxStyle}>
          <DeleteSupplier closeModal={handleDeleteClose} id={supplierId} />
        </Box>
      </Modal>
    </div>
  );
}

export default Suppliers;
