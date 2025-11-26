import React, { useEffect, useState, useRef } from "react";
import styles from "./dashboard.styles.module.css";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import GroupIcon from "@mui/icons-material/Group";
import InsightBox from "../Insight_Box/InsightBox";
import PaidIcon from "@mui/icons-material/Paid";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import BarcodeReaderIcon from "@mui/icons-material/BarcodeReader";
import TourIcon from "@mui/icons-material/Tour";
import CategoryIcon from "@mui/icons-material/Category";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../../axios/axios";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import introJs from "intro.js";
import "intro.js/introjs.css";

function DashboardHome() {
  const toaster_styles = {
    border: "1px solid #2c3e50",
    borderRadius: "4px",
    paddingTop: "5px",
    color: "#2c3e50",
  };

  const toaster_icon_styles = {
    primary: "#2c3e50",
    secondary: "#FFFAEE",
  };

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ state: false, message: "nothing" });
  const [insights, setInsights] = useState(null);
  const [sales, setSales] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [avgSales, setAvgSales] = useState([]);
  const [salesChartX, setSalesChartX] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [recent_grns, setRecent_grns] = useState([]);

  const insightsRef = useRef();
  const chartsRef = useRef();
  const recentSalesRef = useRef();
  const recentGRNsRef = useRef();
  const speedDialRef = useRef();

  const startTour = () => {
    introJs()
      .setOptions({
        steps: [
          {
            element: insightsRef.current,
            intro:
              "This dashboard represents the overall status of the current inventory and sales insights",
          },
          {
            element: chartsRef.current,
            intro:
              "This line chart represents the sales history for last five days and the pei chart represents how the payments done by using each payment method",
          },
          {
            element: recentSalesRef.current,
            intro: "This data grid holds the details about most recent sales.",
          },
          {
            element: recentGRNsRef.current,
            intro: "This data grid holds the details about most recent GRNs.",
          },
          {
            element: speedDialRef.current,
            intro:
              "This section holds some shortcuts to vital operations. you can see if items are understock or about to be expired and speed navigation to POS or GRN screens",
            position: "bottom",
          },
        ],
      })
      .start();
  };

  const salesColumns = [
    {
      field: "id",
      headerName: "Invoice No",
      width: 120,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "sub_total",
      headerName: "Total",
      width: 80,
    },
    {
      field: "discount",
      headerName: "Discount",
      width: 80,
    },
    {
      field: "total_payable",
      headerName: "Total Payable",
      width: 100,
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      width: 100,
    },
  ];

  const grnColumns = [
    {
      field: "id",
      headerName: "GRN No",
      width: 140,
    },
    {
      field: "supplier_name",
      headerName: "Supplier Name",
      width: 160,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "total_value",
      headerName: "Total Value (LKR)",
      width: 100,
    },
  ];

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/dashboard/insights/");
      if (response.data) {
        setInsights(response.data.data);
        setSales(
          response.data.data.charts?.dailyRevenue.map((d) => d.total_sum)
        );
        setDiscounts(
          response.data.data.charts?.dailyRevenue.map((d) => d.total_discount)
        );
        setAvgSales(
          response.data.data.charts?.dailyRevenue.map((d) => d.average_sales)
        );
        setSalesChartX(
          response.data.data.charts?.dailyRevenue.map((d) => d._id)
        );
        setPieChartData(
          response.data.data.charts?.salesByPaymentMethod.map((item) => {
            return { label: item._id.toUpperCase(), value: item.count };
          })
        );
        setRecentSales(
          response.data.data.summary?.latestSales.map((record) => {
            return {
              ...record,
              id: record.invoice_no,
              date: dayjs(record.createdAt).format("DD MMM, YYYY"),
              no_of_items: record.sold_items.length,
              sub_total: record.sub_total.toFixed(2),
              total_payable: record.total_payable.toFixed(2),
              discount: record.discount.toFixed(2),
            };
          })
        );
        setRecent_grns(
          response.data.data.summary?.latest_grns.map((record) => {
            return {
              ...record,
              id: record.grn_no,
              date: dayjs(record.createdAt).format("DD MMM, YYYY"),
              total_value: record.total_value.toFixed(2),
            };
          })
        );
      }
    } catch (error) {
      setError({
        state: true,
        message: error.message || "error while fetching insights!",
      });
      toast.error(error.message || "error while fetching insights!", {
        style: toaster_styles,
        iconTheme: toaster_icon_styles,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className={styles.dash_main_container}>
      {loading ? (
        <div className={styles.circ_progress_container}>
          <CircularProgress size="4rem" />
        </div>
      ) : error.state ? (
        <h1>Error!</h1>
      ) : (
        <>
          <div className={styles.opacity_layer}></div>
          <div className={styles.headline_row}>
            {/* container headline font */}
            <span className={styles.container_header}>dashboard</span>
          </div>

          <div className={styles.insights_row} ref={insightsRef}>
            <InsightBox
              icon={<CategoryIcon fontSize="small" />}
              prog_indicator={true}
              name="Total Items"
              state={true}
              value={insights?.summary?.totalItems || "loading..."}
              percentage="2.5%"
            />
            <InsightBox
              icon={<GroupIcon fontSize="small" />}
              prog_indicator={true}
              name="Total Suppliers"
              state={true}
              value={insights?.summary?.totalSuppliers || "loading..."}
              percentage="2.5%"
            />
            <InsightBox
              icon={<PaidIcon fontSize="small" />}
              prog_indicator={false}
              name="Total Inventory Worth (LKR)"
              state={true}
              value={
                insights?.summary?.totalStockValue.toFixed(2) || "loading..."
              }
              percentage="2.5%"
            />
            <InsightBox
              icon={<ShoppingBasketIcon fontSize="small" />}
              prog_indicator={false}
              name="Total Sales"
              state={true}
              value={insights?.summary?.totalSales || "loading..."}
              percentage="2.5%"
            />

            {/* insight toggler */}
            {/* <div className={styles.insights_toggler}>
              <AddToPhotosIcon color="ternary" />
              <span className={styles.toggler_btn_text}>Add Data</span>
            </div> */}

            {/* quick actions slot */}
            <div className={styles.quick_actions_cont} ref={speedDialRef}>
              {/* create GRN */}
              <Tooltip title="Create GRN">
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/grn")}
                >
                  <BarcodeReaderIcon />
                </Button>
              </Tooltip>
              {/* create Sale */}
              <Tooltip title="Create Sale">
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/pos")}
                >
                  <PointOfSaleIcon />
                </Button>
              </Tooltip>
              {/* beginner tour */}
              <Tooltip title="Start Tour">
                <Button variant="contained" onClick={() => startTour()}>
                  <TourIcon />
                </Button>
              </Tooltip>
              {/* view expiring */}
              <Tooltip title="View Expiring">
                <Button
                  variant="contained"
                  disabled={!insights?.quickActions?.viewExpiring}
                  onClick={() => navigate("/dashboard/stock/expire-alerts")}
                >
                  <CalendarMonthIcon />
                </Button>
              </Tooltip>
              {/* view lowstock */}
              <Tooltip title="View LowStock">
                <Button
                  variant="contained"
                  disabled={!insights?.quickActions?.viewLowStock}
                  onClick={() => navigate("/dashboard/stock/low-stock")}
                >
                  <RunningWithErrorsIcon />
                </Button>
              </Tooltip>
            </div>

            {/* product sales */}
            <div className={styles.product_sales_category} ref={chartsRef}>
              <div className={styles.sales_chart}>
                <LineChart
                  colors={["#27ae60", "#6ab04c", "#badc58"]}
                  series={[
                    {
                      data: sales,
                      label: "Total Sales",
                      yAxisId: "leftAxisId",
                    },
                    {
                      data: avgSales,
                      label: "Average Sales",
                      yAxisId: "leftAxisId",
                    },
                    {
                      data: discounts,
                      label: "Discounts",
                      yAxisId: "leftAxisId",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: salesChartX,
                    },
                  ]}
                  yAxis={[{ id: "leftAxisId", width: 60 }]}
                  sx={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className={styles.payment_method_chart}>
                <PieChart
                  colors={["#27ae60", "#6ab04c", "#badc58"]}
                  series={[
                    {
                      data: pieChartData,
                      startAngle: 0,
                      endAngle: 360,
                      innerRadius: 80,
                      outerRadius: 120,
                      paddingAngle: 3,
                      cornerRadius: 5,
                    },
                  ]}
                />
              </div>
            </div>

            {/* sale category and filter options */}
            <div className={styles.product_filter_cont}>
              {/* recent sales container */}
              <div className={styles.recent_sales_cont} ref={recentSalesRef}>
                <h3 className={styles.dash_partition_container}>
                  Recent Sales
                </h3>

                {/* DataGrid */}
                <DataGrid
                  sx={{ width: "100%" }}
                  columns={salesColumns}
                  rows={recentSales}
                  hideFooter
                />
              </div>
              {/* date range filters */}
              <div className={styles.recent_grns_cont} ref={recentGRNsRef}>
                <h3 className={styles.dash_partition_container}>Recent GRNs</h3>
                <DataGrid
                  sx={{ width: "100%" }}
                  columns={grnColumns}
                  rows={recent_grns}
                  hideFooter
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardHome;
