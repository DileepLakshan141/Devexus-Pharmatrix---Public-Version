import { useEffect, useState } from "react";
import styles from "./items.styles.module.css";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MedicationIcon from "@mui/icons-material/Medication";
import ScaleIcon from "@mui/icons-material/Scale";
import CircularProgress from "@mui/material/CircularProgress";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import AddItem from "./AddItem/AddItem";
import UpdateItem from "./UpdateItem/UpdateItem";
import DeleteItem from "./DeleteItem/DeleteItem";
import AddItemUnit from "./AddItemUnit/AddItemUnit";
import axiosInstance from "../../axios/axios";
import dayjs from "dayjs";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function Items() {
  const boxStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
  };

  const [addItemModal, setAddItemModal] = useState(false);
  const [addItemUnitModal, setAddItemUnitModal] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateModelOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState("");

  const updateModalClose = () => setUpdateModalOpen(false);
  const deleteModalClose = () => setDeleteModalOpen(false);

  const sendUpdateRequest = (id) => {
    setUpdateModalOpen(true);
    setItemId(id);
  };

  const sendDeleteRequest = (id) => {
    setDeleteModalOpen(true);
    setItemId(id);
  };

  const apiRef = useGridApiRef();
  const exportCurrentData = () => {
    apiRef.current.exportDataAsPrint();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "name",
      sortable: true,
      headerName: "Item Name",
      width: 180,
    },
    {
      field: "manufacturer",
      sortable: true,
      headerName: "Manufacturer",
      width: 180,
    },
    {
      field: "barcode",
      sortable: true,
      headerName: "Barcode",
      width: 130,
    },
    {
      field: "sku",
      sortable: true,
      headerName: "Store Keeping Unit",
      width: 150,
    },
    {
      field: "createdAt",
      sortable: true,
      headerName: "Created Date",
      width: 120,
      valueFormatter: (params) => dayjs(params).format("YYYY-MM-DD"),
    },
    {
      field: "available_in_pos",
      sortable: true,
      headerName: "Availability",
      width: 120,
      renderCell: (params) => {
        const activated = params.value === true;
        return (
          <Chip
            label={activated ? "Available" : "Unavailable"}
            color={activated ? "primary" : "warning"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "reorder_level",
      sortable: true,
      headerName: "Reorder Level",
      width: 120,
    },
    {
      field: "action",
      sortable: true,
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", height: "100%" }}
          >
            <IconButton
              color="success"
              variant="contained"
              size="small"
              onClick={() => sendUpdateRequest(params.id)}
            >
              <EditDocumentIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              color="error"
              variant="contained"
              size="small"
              onClick={() => sendDeleteRequest(params.id)}
            >
              <DeleteForeverIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const handleOpenAddItem = () => setAddItemModal(true);
  const handleCloseAddItem = () => setAddItemModal(false);
  const handleOpenAddItemUnit = () => setAddItemUnitModal(true);
  const handleCloseAddItemUnit = () => setAddItemUnitModal(false);

  const fetchAllItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/items/");
      if (response) {
        setItems(response.data.map((item) => ({ ...item, id: item._id })));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  return (
    <div className={styles.items_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Items Management</span>

          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* initiate GRN purchase */}
            <Button
              className={styles.top_btn}
              startIcon={<MedicationIcon />}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => handleOpenAddItem()}
            >
              Add New Item
            </Button>
            <Button
              className={styles.top_btn}
              startIcon={<ScaleIcon />}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => handleOpenAddItemUnit()}
              sx={{ ml: "20px" }}
            >
              Add New Item Unit
            </Button>
            <Button
              className={styles.top_btn}
              startIcon={<PictureAsPdfIcon />}
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => exportCurrentData()}
              sx={{ ml: "20px" }}
            >
              Export Current View
            </Button>
          </div>
        </div>

        <div className={styles.content_holder}>
          {isLoading ? (
            <CircularProgress size="3rem" color="primary" />
          ) : (
            <DataGrid
              apiRef={apiRef}
              sx={{ width: "100%" }}
              columns={columns}
              rows={items}
              columnVisibilityModel={{ id: false }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 20, 30]}
              disableRowSelectionOnClick
              checkboxSelection
            />
          )}

          {/* add items modal */}
          <Modal open={addItemModal} onClose={handleCloseAddItem}>
            <Box sx={boxStyles}>
              <AddItem />
            </Box>
          </Modal>

          {/* update item */}
          <Modal open={updateModelOpen} onClose={updateModalClose}>
            <Box sx={boxStyles}>
              <UpdateItem id={itemId} />
            </Box>
          </Modal>

          {/* delete item */}
          <Modal open={deleteModalOpen} onClose={deleteModalClose}>
            <Box sx={boxStyles}>
              <DeleteItem id={itemId} closeWindow={deleteModalClose} />
            </Box>
          </Modal>

          {/* add item unit */}
          <Modal open={addItemUnitModal} onClose={handleCloseAddItemUnit}>
            <Box sx={boxStyles}>
              <AddItemUnit />
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Items;
