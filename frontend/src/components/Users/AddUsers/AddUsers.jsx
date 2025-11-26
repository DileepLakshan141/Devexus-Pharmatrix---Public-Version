import { useState } from "react";
import ROLES from "../../../config/auth_roles";
import style from "./add_users.styles.module.css";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import CreateIcon from "@mui/icons-material/Create";
import BackspaceIcon from "@mui/icons-material/Backspace";
import axiosInstance from "../../../axios/axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

function AddUsers() {
  const initialValues = {
    username: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const createUser = async (values) => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const response = await axiosInstance.post("/clients/signup", {
        username: values.username,
        email: values.email,
        telephone: values.telephone,
        password: values.password,
        role: values.role,
      });

      if (response) {
        setSuccessMsg("User created successfully!");
        setSuccess(true);
        // Reset form on success
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
      setLoading(false);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Error occurred while creating user!"
      );
      setError(true);
      setLoading(false);
    }
  };

  const createUserSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required.")
      .min(3, "Username should at least have 3 characters."),
    email: Yup.string()
      .required("Email address is required")
      .email("Not a valid email address"),
    telephone: Yup.string()
      .required("Telephone is required")
      .matches(/^[0-9]+$/, "Must be only digits.")
      .min(10, "Must be 10 digits.")
      .max(10, "Maximum 10 digits allowed."),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    role: Yup.number()
      .required("User role is required")
      .oneOf([5321, 4560], "Please select a valid role"),
  });

  return (
    <div className={style.add_user_container}>
      <h2>Create New User</h2>
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
          initialValues={initialValues}
          validationSchema={createUserSchema}
          onSubmit={(values) => createUser(values)}
        >
          {({ isSubmitting, handleReset }) => {
            return (
              <Form className={style.form_container}>
                <Field name="username">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%" }}
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Username"
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
                        style={{ width: "70%", margin: "25px" }}
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
                        style={{ width: "70%" }}
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
                <Field name="password">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%", margin: "25px" }}
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Password"
                        type="password"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    );
                  }}
                </Field>
                <Field name="confirmPassword">
                  {({ field, meta }) => {
                    return (
                      <TextField
                        {...field}
                        style={{ width: "70%" }}
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Confirm Password"
                        type="password"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                      />
                    );
                  }}
                </Field>
                <Field name="role">
                  {({ field, meta }) => (
                    <FormControl
                      size="small"
                      variant="outlined"
                      sx={{ width: "70%", m: 2.5 }}
                      error={meta.touched && Boolean(meta.error)}
                    >
                      <InputLabel>User Role</InputLabel>
                      <Select {...field} label="User Role">
                        <MenuItem value={ROLES.STAFF}>Staff</MenuItem>
                        <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                      </Select>
                      {meta.touched && meta.error && (
                        <FormHelperText>{meta.error}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>

                <div className={style.btn_container_add_supp}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<CreateIcon />}
                    className={style.btn_add_supplier}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create User"}
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
                {success && (
                  <Alert
                    style={{ marginTop: "20px" }}
                    color="success"
                    variant="outlined"
                  >
                    {successMsg}
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

export default AddUsers;
