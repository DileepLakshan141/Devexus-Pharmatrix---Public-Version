import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import PersonIcon from "@mui/icons-material/Person";
import BarcodeReaderIcon from "@mui/icons-material/BarcodeReader";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PaidIcon from "@mui/icons-material/Paid";
import BadgeIcon from "@mui/icons-material/Badge";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import HelpIcon from "@mui/icons-material/Help";
import VaccinesIcon from "@mui/icons-material/Vaccines";

export const sidebar_data = [
  {
    section_name: "inventory",
    sub_sections: [
      {
        name: "dashboard",
        link: "main",
        icon: <DashboardIcon />,
      },
      {
        name: "stock",
        link: "stock",
        icon: <InventoryIcon />,
      },
      {
        name: "items",
        link: "items",
        icon: <VaccinesIcon />,
      },
      {
        name: "suppliers",
        link: "suppliers",
        icon: <PrecisionManufacturingIcon />,
      },
      // {
      //   name: "customers",
      //   link: "customers",
      //   icon: <PersonIcon />,
      // },
      {
        name: "GRN",
        link: "grn",
        icon: <BarcodeReaderIcon />,
      },
    ],
  },
  {
    section_name: "sales",
    sub_sections: [
      {
        name: "POS",
        link: "pos",
        icon: <PointOfSaleIcon />,
      },
      {
        name: "reports",
        link: "reports",
        icon: <AdfScannerIcon />,
      },
    ],
  },
  {
    section_name: "options",
    sub_sections: [
      {
        name: "users",
        link: "users",
        icon: <BadgeIcon />,
      },
      {
        name: "settings",
        link: "settings",
        icon: <SettingsSuggestIcon />,
      },
      {
        name: "info",
        link: "info",
        icon: <HelpIcon />,
      },
    ],
  },
];
