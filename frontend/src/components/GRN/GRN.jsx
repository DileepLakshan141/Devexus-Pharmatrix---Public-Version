import axiosInstance from "../../axios/axios";
import dayjs from "dayjs";
import styles from "./grn.styles.module.css";
import Button from "@mui/material/Button";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CategoryIcon from "@mui/icons-material/Category";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import GRNItems from "./GRN_Items/GRNItems";

function GRN() {
  const [GRNs, setGRNs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subItemsModal, setSubItemsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(false);

  const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const openSubItemsModal = (items) => {
    setSubItemsModal(true);
    setSelectedItems(items || []);
  };

  const closeSubItemsModal = () => {
    setSubItemsModal(false);
  };

  const columns = [
    {
      field: "grn_no",
      headerName: "GRN Number",
      width: 180,
    },
    {
      field: "supplier_name",
      headerName: "Supplier Name",
      width: 200,
    },
    {
      field: "recorded_user",
      headerName: "Recorded By",
      width: 180,
    },
    {
      field: "createdAt",
      sortable: true,
      headerName: "Created Date",
      valueFormatter: (params) => dayjs(params).format("YYYY-MM-DD HH:mm"),
      width: 180,
    },
    {
      field: "items",
      sortable: false,
      headerName: "Actions",
      width: 180,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", height: "100%" }}
          >
            <Tooltip title="View GRN Items">
              <IconButton
                color="primary"
                size="small"
                variant="contained"
                sx={{ width: 30 }}
                onClick={() => openSubItemsModal(params.row.items)}
              >
                <CategoryIcon fontSize="25px" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const fetchAll_GRN_Records = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/grns/");
      if (response.data) {
        setGRNs(
          response.data.data.map((grn) => ({
            ...grn,
            id: grn._id,
            supplier_name: grn.supplier_id.name,
            recorded_user: grn.recorded_by.username,
            items: grn.items,
          }))
        );
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAll_GRN_Records();
  }, []);

  const navigate = useNavigate();
  return (
    <div className={styles.stock_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>GRN Management</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* initiate GRN purchase */}
            <Button
              startIcon={<ShoppingBasketIcon />}
              className={styles.top_btn}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                navigate("initiate-grn-purchase");
              }}
            >
              Initiate GRN Purchase
            </Button>
          </div>
        </div>
        {/* grn history displayer */}
        <div className={styles.content_holder}>
          {loading ? (
            <CircularProgress color="primary" size="3rem" />
          ) : (
            <DataGrid
              className={styles.data_grid_mods}
              rows={GRNs}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 20, 30]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>

      <Modal open={subItemsModal} onClose={closeSubItemsModal}>
        <Box sx={boxStyle}>
          <GRNItems table={selectedItems} />
        </Box>
      </Modal>
    </div>
  );
}

export default GRN;
