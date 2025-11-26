import { useState, useEffect } from "react";
import styles from "./update_items.styles.module.css";
import axiosInstance from "../../../axios/axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import RestoreIcon from "@mui/icons-material/Restore";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

function UpdateItem({ id }) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Item name is required."),
    sku: Yup.string().required("SKU is required."),
    barcode: Yup.string().required("Barcode is required."),
    category: Yup.string().required("Category is required."),
    manufacturer: Yup.string().required("Manufacturer is required."),
    reorder_level: Yup.number()
      .required("Please specify the reorder level.")
      .min(0, "Reorder level cannot be negative"),
    supplier: Yup.string().required("Please specify a supplier"),
    available_in_pos: Yup.boolean().required(
      "Please specify availability status"
    ),
  });

  const [itemData, setItemData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    manufacturer: "",
    reorder_level: 0,
    supplier: "",
    available_in_pos: false,
  });
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemResponse, suppliersResponse] = await Promise.all([
        axiosInstance.get(`/items/${id}`),
        axiosInstance.get("/suppliers/"),
      ]);

      if (itemResponse.data) {
        setItemData({
          name: itemResponse.data.name || "",
          sku: itemResponse.data.sku || "",
          barcode: itemResponse.data.barcode || "",
          category: itemResponse.data.category || "",
          manufacturer: itemResponse.data.manufacturer || "",
          reorder_level: itemResponse.data.reorder_level || 0,
          supplier:
            itemResponse.data.supplier?._id || itemResponse.data.supplier || "",
          available_in_pos: itemResponse.data.available_in_pos || false,
        });
      }

      if (suppliersResponse.data) {
        setSuppliers(suppliersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorAlert("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateItem = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(`/items/${id}`, values);

      if (response.data) {
        setItemData(response.data);
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 2000);
        resetForm({ values: response.data });
      }
    } catch (error) {
      console.error("Update error:", error);
      setErrorAlert(error.response?.data?.message || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (resetForm) => {
    resetForm({ values: itemData });
  };

  return (
    <div className={styles.ui_main_container}>
      <div className={styles.ui_headline}>Update Item</div>

      {errorAlert && (
        <Alert
          severity="error"
          onClose={() => setErrorAlert("")}
          sx={{ mb: "20px", mt: "20px" }}
        >
          {errorAlert}
        </Alert>
      )}

      {successAlert && (
        <Alert
          severity="success"
          onClose={() => setSuccessAlert(false)}
          sx={{ mb: 2 }}
        >
          Item updated successfully!
        </Alert>
      )}

      {isLoading ? (
        <div className={styles.spinner_container}>
          <CircularProgress />
        </div>
      ) : (
        <Formik
          initialValues={itemData}
          validationSchema={validationSchema}
          onSubmit={updateItem}
          enableReinitialize
        >
          {({ values, setFieldValue, handleReset: formikReset }) => (
            <Form className={styles.form_styles}>
              {/* supplier name */}
              <Field name="supplier">
                {({ field, meta }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    size="small"
                    options={suppliers}
                    getOptionLabel={(option) => option.name || ""}
                    value={
                      suppliers.find((s) => s._id === values.supplier) || null
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
                    variant="outlined"
                    label="Item Name"
                    fullWidth
                    sx={{ mt: "20px", width: "80%" }}
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
                      label="Barcode"
                      sx={{ mt: "20px", width: "49%" }}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                      className={styles.input_styles}
                    />
                  )}
                </Field>

                {/* category */}
                <Field name="category">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      size="small"
                      label="Category"
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
                    label="Store Keeping Unit"
                    fullWidth
                    sx={{ mt: "20px", width: "80%" }}
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
                    label="Manufacturer"
                    fullWidth
                    className={styles.input_styles}
                    sx={{ mt: "20px", width: "80%" }}
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
                    label="Reorder Level"
                    fullWidth
                    sx={{ mt: "20px", width: "80%" }}
                    inputProps={{ min: 0 }}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              {/* availability */}
              <Field name="available_in_pos">
                {({ field, meta }) => (
                  <Select
                    {...field}
                    size="small"
                    label="Availability Status"
                    fullWidth
                    sx={{ mt: "20px", width: "80%" }}
                    error={meta.touched && !!meta.error}
                  >
                    <MenuItem value={true}>Available</MenuItem>
                    <MenuItem value={false}>Unavailable</MenuItem>
                  </Select>
                )}
              </Field>

              {/* btn container */}
              <div className={styles.btn_container}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<CreateNewFolderIcon />}
                  sx={{ mr: 2 }}
                >
                  {isSubmitting ? "Updating..." : "Update Item"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => handleReset(formikReset)}
                >
                  Reset
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default UpdateItem;
