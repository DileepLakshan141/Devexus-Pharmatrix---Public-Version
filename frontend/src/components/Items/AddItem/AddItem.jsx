import { useState, useEffect } from "react";
import styles from "./add_items.styles.module.css";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Button,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import axiosInstance from "../../../axios/axios";

function AddItem() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const fetchAllSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/suppliers/");
      if (response) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.log(error.message || "Data fetching failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Item name is required."),
    sku: Yup.string().required("SKU is required."),
    barcode: Yup.string().required("Barcode is required."),
    category: Yup.string().required("Category is required."),
    manufacturer: Yup.string().required("Manufacturer is required."),
    reorder_level: Yup.number().required("Please specify the reorder level."),
    supplier: Yup.string().required("Please specify a supplier id"),
  });

  const initialValues = {
    name: "",
    sku: "",
    barcode: "",
    category: "",
    manufacturer: "",
    reorder_level: "",
    supplier: "",
  };

  const createItem = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const response = await axiosInstance.post("/items", {
        ...values,
        supplierId: values.supplier,
      });

      if (response.data) {
        resetForm();
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Item creation failed:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert("Validation error: " + error.response.data?.message);
            break;
          case 409:
            alert("Duplicate item: " + error.response.data?.message);
            break;
          default:
            alert("Error creating item");
        }
      } else {
        alert("Network error - please try again");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.ai_main_container}>
      <div className={styles.ai_headline}>Add Item</div>
      {isLoading ? (
        <div className={styles.spinner_container}>
          <CircularProgress />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={createItem}
        >
          {({ values, setFieldValue, isSubmitting, handleReset }) => (
            <Form className={styles.form_styles}>
              {/* supplier name */}
              <Field name="supplier">
                {({ meta }) => (
                  <Autocomplete
                    disablePortal
                    size="small"
                    options={suppliers}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      suppliers.find((s) => s._id == values.supplier) || null
                    }
                    onChange={(_, selectedOption) => {
                      setFieldValue(
                        "supplier",
                        selectedOption ? selectedOption._id : ""
                      );
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Supplier"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                    className={styles.input_styles}
                    sx={{ mt: "20px" }}
                  />
                )}
              </Field>

              {/* item name */}
              <Field name="name">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    size="small"
                    color="primary"
                    variant="outlined"
                    label="Item Name"
                    sx={{ mt: "20px" }}
                    className={styles.input_styles}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              <div
                style={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* barcode */}
                <Field name="barcode">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      size="small"
                      color="primary"
                      label="Barcode"
                      sx={{ mt: "20px", width: "49%" }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
                {/* category */}
                <Field name="category">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      size="small"
                      color="primary"
                      label="Category"
                      className={styles.input_styles}
                      sx={{ mt: "20px", width: "49%" }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </div>

              {/* sku */}
              <Field name="sku">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    size="small"
                    color="primary"
                    label="Store Keeping Unit"
                    className={styles.input_styles}
                    sx={{ mt: "20px" }}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              {/* manufacturer */}
              <Field name="manufacturer">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    size="small"
                    color="primary"
                    label="Manufacturer"
                    className={styles.input_styles}
                    sx={{ mt: "20px" }}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              {/* reorder_level */}
              <Field name="reorder_level">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    type="number"
                    size="small"
                    color="primary"
                    label="Reorder Level"
                    className={styles.input_styles}
                    sx={{ mt: "20px" }}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              {/* btn container */}
              <div className={styles.btn_container}>
                <Button
                  size="medium"
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{ mr: "20px" }}
                  startIcon={<CreateNewFolderIcon />}
                >
                  {isSubmitting ? "Creating...." : "Create Item"}
                </Button>
                <Button
                  size="medium"
                  type="reset"
                  color="primary"
                  variant="contained"
                  startIcon={<RestoreIcon />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {successAlert && (
        <Alert
          severity="success"
          sx={{
            width: "90%",
            mt: "20px",
            display: "flex",
            ml: "auto",
            mr: "auto",
          }}
        >
          Item created successfully!
        </Alert>
      )}
    </div>
  );
}

export default AddItem;
