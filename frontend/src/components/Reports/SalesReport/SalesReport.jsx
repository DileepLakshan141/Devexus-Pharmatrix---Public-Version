import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "./sr.styles.module.css";
import pdf_styles from "./srf.styles";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../axios/axios";
import NoResults from "../../../assets/images/no-results.png";
import PrintIcon from "@mui/icons-material/Print";
import SalesReportPDF from "./SalesReportPdf.jsx";

function SalesReport() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salesRecords, setSalesRecords] = useState([]);

  const searchRecords = async () => {
    try {
      setLoading(true);
      if (!startDate || !endDate) {
        return toast.error("Start Date & End Date is required!");
      }
      const dates = {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      };
      const response = await axiosInstance.post("/reports/sales-report", dates);
      if (response.data) {
        console.log(response);
        setSalesRecords(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reports_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Sales Report</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ m: "5px 10px" }}
                label="Start Date"
                value={startDate}
                onChange={(value) => {
                  if (!value) return setStartDate(null);
                  if (endDate && value.isAfter(endDate, "day")) {
                    toast.error("End Date cannot be earlier than Start Date");
                    setEndDate(null);
                  }

                  setStartDate(value);
                }}
              />

              <DatePicker
                sx={{ m: "5px 10px" }}
                label="End Date"
                value={endDate}
                onChange={(value) => {
                  if (!value) return setEndDate(null);
                  if (startDate && value.isBefore(startDate, "day")) {
                    toast.error("End Date cannot be earlier than Start Date");
                    return;
                  }

                  setEndDate(value);
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{ height: "55px", ml: "10px" }}
              onClick={() => searchRecords()}
            >
              Search Records
            </Button>
          </div>
        </div>
        {/* sales details container */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <div className={styles.report_blocks_container}>
              {salesRecords.length > 0 ? (
                <>
                  <PDFViewer style={pdf_styles.doc_settings}>
                    <SalesReportPDF
                      saleData={salesRecords}
                      sDate={dayjs(startDate).format("DD MMM, YYYY")}
                      eDate={dayjs(endDate).format("DD MMM, YYYY")}
                    />
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
                      document={
                        <SalesReportPDF
                          saleData={salesRecords}
                          sDate={dayjs(startDate).format("DD MMM, YYYY")}
                          eDate={dayjs(endDate).format("DD MMM, YYYY")}
                        />
                      }
                      fileName={`sales-report${
                        dayjs(startDate).format("DD MMM, YYYY") ||
                        "srp_xxx_xxx_xxx"
                      }.pdf`}
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
              ) : (
                <div className={styles.no_results_container}>
                  <img src={NoResults} />
                  <h4 className={styles.no_results_text}>
                    No Results! Try a search!
                  </h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesReport;
