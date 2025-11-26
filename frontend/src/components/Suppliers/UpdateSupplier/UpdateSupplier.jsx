import { useState, useEffect } from "react";
import style from "./us.styles.module.css";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import UpdateIcon from "@mui/icons-material/Update";
import BackspaceIcon from "@mui/icons-material/Backspace";
import axiosInstance from "../../../axios/axios";

function UpdateSupplier(props) {
  const initialValues = {
    name: "",
    contactPerson: "",
    telephone: "",
    address: "",
    email: "",
  };
  const { id } = props;
  const [supplierDetails, setSupplierDetails] = useState(initialValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSupplierDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/suppliers/${id}`);
      if (response) {
        setSupplierDetails({
          name: response.data.name,
          contactPerson: response.data.contact_person,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        });
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg(error.message || "Error occured while fetching data!");
      setError(true);
      setLoading(false);
    }
  };

  const updateSupplierDetails = async (values) => {
    setLoading(true);
    try {
      console.log(values);

      const response = await axiosInstance.put(`/suppliers/${id}`, {
        name: values.name,
        contact_person: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
      });
      if (response) {
        setSupplierDetails({
          name: response.data.name,
          contactPerson: response.data.contact_person,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        });
      }
      setLoading(false);
    } catch (error) {
      setErrorMsg(error.message || "Error occured while updating data!");
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierDetails(id);
  }, [id]);

  const updateSupplierSchema = Yup.object().shape({
    name: Yup.string()
      .required("Supplier name is required.")
      .min(3, "Supplier name should at least have 3 characters."),
    contactPerson: Yup.string()
      .required("Contact Person is required.")
      .min(3, "Contact person should have at least 3 characters."),
    email: Yup.string()
      .required("Email address is required")
      .email("Not a valid email address"),
    address: Yup.string().required("Address is required."),
    phone: Yup.string()
      .required("Telephone is required")
      .matches(/^[0-9]+$/, "Must be only digits.")
      .min(10, "Must be 10 digits there.")
      .max(10, "Maximum 10 digits allowed."),
  });

  return (
    <div className={style.us_container}>
      <h2>Update Supplier Details</h2>
      <hr />
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Formik
          initialValues={supplierDetails}
          validationSchema={updateSupplierSchema}
          onSubmit={(values) => updateSupplierDetails(values)}
        >
          {({ isSubmitting, handleReset }) => {
            return (
              <Form className={style.form_container}>
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
                <Field name="email">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%" }}
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
                <Field name="phone">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%", margin: "25px" }}
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
                <Field name="address">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%" }}
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
                <div className={style.btn_container_add_supp}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<UpdateIcon />}
                    className={style.btn_add_supplier}
                  >
                    {isSubmitting ? "Updating..." : "Update Supplier"}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<BackspaceIcon />}
                    className={style.btn_add_supplier}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
                {error && (
                  <Alert
                    style={{ marginTop: "20px" }}
                    color="error"
                    variant="outlined"
                  >
                    {errorMsg}
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

export default UpdateSupplier;
