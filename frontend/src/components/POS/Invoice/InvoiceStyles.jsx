import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  doc_settings: {
    width: "100%",
    height: "90%",
    padding: "30px 50px",
  },

  page_settings: {
    padding: "20px",
  },

  header_settings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    borderBottom: "1px solid #333333",
  },

  invoice_heading: {
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    fontSize: "25px",
    color: "#333333",
    letterSpacing: "5px",
  },

  invoice_no: {
    fontSize: "12px",
    marginTop: "4px",
  },

  bill_date: {
    fontSize: "12px",
    marginTop: "4px",
  },

  cashier: {
    fontSize: "12px",
    marginTop: "4px",
    marginBottom: "12px",
  },

  comp_info: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  main_info: {
    fontFamily: "Helvetica-Bold",
    color: "#27ae60",
    fontSize: "23px",
  },

  sub_info: {
    fontSize: "12px",
    fontFamily: "Courier",
    color: "#333333",
  },

  pos_table: {
    width: "100%",
    height: "100%",
  },

  table_styles: {
    marginTop: "15px",
  },

  theadings: {
    fontSize: "12px",
    backgroundColor: "#ecf0f1",
  },

  trows: {
    fontSize: "12px",
  },

  fcell: {
    padding: "4px 10px",
  },

  checkout_container: {
    marginTop: "20px",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  checkout_cont_column: {
    flexDirection: "column",
  },

  checkout_row: {
    width: "260px",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid black",
    padding: "4px 10px",
    margin: "3px 0",
    fontSize: "13px",
  },

  text_bold: {
    fontFamily: "Helvetica-Bold",
  },

  footer_styles: {
    position: "absolute",
    bottom: "0",
    width: "95%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px auto 0 auto",
    borderTop: "1px solid #333333",
    padding: "10px",
    fontSize: "9px",
    color: "grey",
    gap: "5px",
  },
});

export default styles;
