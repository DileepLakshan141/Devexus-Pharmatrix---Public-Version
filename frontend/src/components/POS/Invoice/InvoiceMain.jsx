import {
  Document,
  Page,
  View,
  Text,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PrintIcon from "@mui/icons-material/Print";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import axiosInstance from "../../../axios/axios";
import styles from "./InvoiceStyles";
import InvoicePDF from "./InvoicePDF";

function InvoiceMain() {
  const [loading, setLoading] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const { invoiceId } = useParams();

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/sales/${invoiceId}`);
      if (response.data) {
        console.log(response.data);
        setSaleData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceId]);

  return loading ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size="3rem" />
    </div>
  ) : (
    <>
      <PDFViewer style={styles.doc_settings}>
        <InvoicePDF saleData={saleData} />
      </PDFViewer>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PDFDownloadLink
          document={<InvoicePDF saleData={saleData} />}
          fileName={`invoice-${saleData?.invoice_no || "inv_xxx_xxx_xxx"}.pdf`}
        >
          <Button
            size="small"
            variant="contained"
            sx={{ mt: "5px", margin: "0 auto" }}
            endIcon={<PrintIcon />}
          >
            Download Invoice
          </Button>
        </PDFDownloadLink>
      </div>
    </>
  );
}

export default InvoiceMain;
