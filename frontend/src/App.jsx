import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { toaster_icon_styles, toaster_styles } from "./data/toaster.config.js";
//route guards
import RequireAuth from "./route_guards/RequireAuth.jsx";
// roles
import ROLES from "./config/auth_roles";
// pages
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardHome from "./components/DashboardHome/DashboardHome.jsx";
import Stock from "./components/Stock/Stock.jsx";
import Shelf_Life_Manager from "./components/Stock/Shelf_Life_Manager/Shelf_Life_Manager.jsx";
import Batch_Information from "./components/Stock/Batch_Information/Batch_Information.jsx";
import Reports from "./components/Reports/Reports.jsx";
import Items from "./components/Items/Items.jsx";
import Suppliers from "./components/Suppliers/Suppliers.jsx";
import Customers from "./components/Customers/Customers.jsx";
import GRN from "./components/GRN/GRN.jsx";
import InitiatePurchase from "./components/GRN/InitiatePurchase/InitiatePurchase.jsx";
import Settings from "./components/Settings/Settings.jsx";
import UsersMain from "./components/Users/Users_Main/UsersMain.jsx";
import Info from "./components/Info/Info.jsx";
import POS from "./components/POS/POS.jsx";
import ExpireItemsDisplayer from "./components/ExpireItemsDisplayer/ExpireItemsDisplayer.jsx";

import InvoiceMain from "./components/POS/Invoice/InvoiceMain.jsx";
import LowStockItemsDisplayer from "./components/LowStockItemsDisplayer/LowStockItemsDisplayer.jsx";
import SalesReport from "./components/Reports/SalesReport/SalesReport.jsx";
import WriteoffReport from "./components/Reports/WriteOffReport/WriteoffReport.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: toaster_styles,
            iconTheme: toaster_icon_styles,
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/unauthorized" element={<SignIn />} />

          <Route path="*" element={<NotFound />} />

          {/* protected routes */}
          <Route
            element={<RequireAuth allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
          >
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="main" element={<DashboardHome />} />
              <Route path="stock" element={<Stock />} />
              <Route
                path="stock/slm-manager"
                element={<Shelf_Life_Manager />}
              />
              <Route
                path="stock/batch-information"
                element={<Batch_Information />}
              />
              <Route
                path="stock/expire-alerts"
                element={<ExpireItemsDisplayer />}
              />
              <Route
                path="stock/low-stock"
                element={<LowStockItemsDisplayer />}
              />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/sales-report" element={<SalesReport />} />
              <Route
                path="reports/writeoff-report"
                element={<WriteoffReport />}
              />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="items" element={<Items />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<UsersMain />} />
              <Route path="info" element={<Info />} />
              <Route path="grn" element={<GRN />} />
              <Route
                path="grn/initiate-grn-purchase"
                element={<InitiatePurchase />}
              />
              <Route path="pos" element={<POS />} />
              <Route path="pos/invoice/:invoiceId" element={<InvoiceMain />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
