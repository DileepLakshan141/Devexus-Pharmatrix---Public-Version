import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#81c784",
      main: "#4caf50",
      dark: "#388e3c",
      contrastText: "#fff",
    },
    secondary: {
      light: "#a5d6a7",
      main: "#66bb6a",
      dark: "#2e7d32",
      contrastText: "#000",
    },
    ternary: {
      light: "#a4b0be",
      main: "#a4b0be",
      dark: "#a4b0be",
      contrastText: "#a4b0be",
    },
  },
});
