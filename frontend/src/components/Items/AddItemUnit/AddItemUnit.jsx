import { useEffect, useState } from "react";
import styles from "./add_iu.styles.module.css";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { Autocomplete, Button, CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import HistoryIcon from "@mui/icons-material/History";
import axiosInstance from "../../../axios/axios";

function AddItemUnit() {
  const initialValues = {
    itemId: "",
    unitName: "",
    to_base_qty: "",
  };

  const itemUnitValidationSchema = Yup.object().shape({
    itemId: Yup.string().required("Please select an item."),
    unitName: Yup.string().required("Unit name is required."),
    to_base_qty: Yup.number().required("Quantity for a base unit is required."),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const createItemUnit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const response = await axiosInstance.post("/item-units/", {
        item_id: values.itemId,
        unit_name: values.unitName,
        quantity_in_parent: values.to_base_qty,
      });
      if (response) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
        resetForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/items/");
      if (response) {
        setItems(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message || "error occured while fetching items");
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  return (
    <div className={styles.add_iu_main_container}>
      <div className={styles.add_iu_headline}>Add Item Unit</div>
      {isLoading ? (
        <div className={styles.spinner_container}>
          <CircularProgress />
        </div>
      ) : (
        <Formik
          validationSchema={itemUnitValidationSchema}
          initialValues={initialValues}
          onSubmit={createItemUnit}
        >
          {({ values, setFieldValue, isSubmitting, handleReset }) => {
            return (
              <Form className={styles.form_styles}>
                <Field>
                  {(meta) => {
                    return (
                      <Autocomplete
                        disablePortal
                        size="small"
                        options={items}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          items.find((item) => item._id === values.itemId) ||
                          null
                        }
                        onChange={(_, selectedOption) =>
                          setFieldValue(
                            "itemId",
                            selectedOption ? selectedOption._id : ""
                          )
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Item"
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                        className={styles.input_styles}
                        sx={{ mt: "20px" }}
                      />
                    );
                  }}
                </Field>

                {/* unit name */}
                <Field name="unitName">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        size="small"
                        color="primary"
                        label="Unit Name"
                        className={styles.input_styles}
                        sx={{ mt: "20px" }}
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    );
                  }}
                </Field>

                {/* base qty */}
                <Field name="to_base_qty">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        color="primary"
                        label="Base Qty Value"
                        className={styles.input_styles}
                        sx={{ mt: "20px" }}
                        error={!!meta.error && meta.touched}
                        helperText={meta.touched && meta.error}
                      />
                    );
                  }}
                </Field>
                <div className={styles.btn_container}>
                  <Button
                    type="submit"
                    color="primary"
                    size="medium"
                    variant="contained"
                    startIcon={<CreateNewFolderIcon />}
                  >
                    {isSubmitting ? "Creating..." : "Create Unit"}
                  </Button>
                  <Button
                    color="primary"
                    size="medium"
                    variant="contained"
                    startIcon={<HistoryIcon />}
                    sx={{ width: "130px", ml: "20px" }}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
                {isSuccess && (
                  <Alert sx={{ width: "80%", mt: "20px" }} severity="success">
                    Item unit is created for the selected item!
                  </Alert>
                )}
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

export default AddItemUnit;
