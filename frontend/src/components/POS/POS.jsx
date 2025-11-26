import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../app/cart.slice";
import { toast } from "react-hot-toast";
import styles from "./pos.styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import BarcodeReaderIcon from "@mui/icons-material/BarcodeReader";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../axios/axios";
import Item_Card from "./POS_Item_Card/Item_Card";
import empty_icon from "../../assets/images/no-order.png";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import emptyCart from "../../assets/images/shopping.png";
import Chip from "@mui/material/Chip";

function POS() {
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
  const dispatch = useDispatch();
  const paymentMethods = {
    cash: "cash",
    card: "card",
    qr: "scan",
  };
  const [loading, setLoading] = useState(false);
  const [createRecordLoader, setCreateRecordLoader] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetItems, setTargetItems] = useState([]);
  const [paymentMethod, setPaymentMethods] = useState(paymentMethods.cash);

  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const cache = useRef({
    barcode_cache: new Map(),
    name_cache: new Map(),
  });

  const cartItems = useSelector((state) => state.cart.cart_items);

  const clearCartItems = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const calculateSubTotal = useCallback((arr = []) => {
    let total = 0;
    arr.forEach((item) => {
      total += item.total_value || 0;
    });
    setSubTotal(total);
    setTotalPayable(total);
  }, []);

  const handleDiscount = (val) => {
    setDiscount(val);
    const payableTotal = subTotal - val;
    setTotalPayable(payableTotal);
  };

  const fetchByBarcode = async () => {
    try {
      const response = await axiosInstance.get(
        `/pos/search_by_barcode/${searchTerm}`
      );
      if (response.data) {
        return response.data || [];
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || "error while fetching products via barcode"
      );
      return [];
    }
  };

  const fetchByItemName = async () => {
    try {
      const response = await axiosInstance.get(
        `/pos/search_by_name/${searchTerm}`
      );
      if (response.data) {
        return response.data || [];
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || "error while fetching products via item name",
        { style: toaster_styles, iconTheme: toaster_icon_styles }
      );
      return [];
    }
  };

  useEffect(() => {
    calculateSubTotal(cartItems);
  }, [cartItems]);

  const handleItemFetching = async () => {
    if (searchTerm === "") {
      setTargetItems([]);
      return;
    }
    setLoading(true);
    const currentCache = barcodeMode
      ? cache.current.barcode_cache
      : cache.current.name_cache;
    const cache_key = searchTerm.trim().toLowerCase();

    if (currentCache.has(cache_key)) {
      const cachedData = currentCache.get(cache_key);
      setTargetItems(cachedData);
      setLoading(false);
      return;
    }

    const results = barcodeMode
      ? await fetchByBarcode(cache_key)
      : await fetchByItemName(cache_key);

    if (!results || results.length === 0) {
      currentCache.delete(cache_key);
      setTargetItems([]);
      setLoading(false);
      return;
    }

    if (currentCache.size >= 50) {
      const firstKey = currentCache.keys().next().value;
      currentCache.delete(firstKey);
    }

    if (results.length >= 1) {
      currentCache.set(cache_key, results);
    }
    setLoading(false);
    setTargetItems(results);
  };

  const createSaleRecord = async () => {
    try {
      setCreateRecordLoader(true);
      const response = await axiosInstance.post("/sales/create", {
        sub_total: subTotal,
        total_payable: totalPayable,
        discount,
        payment_method: paymentMethod,
        items: cartItems,
        cashier: user.user_id,
      });

      if (response.data) {
        console.log(response.data);
        toast.success(response.data.message);
        dispatch(clearCart());
        navigate(`invoice/${response.data.data._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "error occurred while creating the", {
        style: toaster_styles,
        iconTheme: toaster_icon_styles,
      });
    } finally {
      setCreateRecordLoader(false);
    }
  };

  return (
    <div className={styles.pos_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Point Of Sales</span>
          {/* btns-container */}
          <div className={styles.top_btns_container}>
            {/* the mode switcher */}
            <div className={styles.mode_switcher}>
              <FindInPageIcon
                color={`${!barcodeMode ? "primary" : "ternary"}`}
              />
              <Tooltip
                title={`Barcode reader mode is ${barcodeMode ? "on" : "off"}!`}
              >
                <Switch
                  onChange={() => setBarcodeMode((prev) => !prev)}
                  defaultChecked
                  size="2rem"
                />
              </Tooltip>
              <BarcodeReaderIcon
                color={`${barcodeMode ? "primary" : "ternary"}`}
              />
            </div>
          </div>
        </div>
        <div className={styles.content_holder}>
          {loading ? (
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
            <div className={styles.pos_cont_col_holder}>
              <div className={styles.pos_cont_large_col}>
                {/* the search field */}
                <TextField
                  label={`Search By ${
                    barcodeMode ? "Barcode" : "Product Name"
                  }`}
                  size="small"
                  sx={{ width: "100%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleItemFetching();
                    }
                  }}
                />

                {/* the item displayer */}
                <div className={styles.item_display_cont}>
                  {loading ? (
                    <div className={styles.loading_screen_cont}>
                      <CircularProgress
                        size="3rem"
                        sx={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    <div className={styles.item_displayer}>
                      {!targetItems || targetItems.length < 1 ? (
                        <div className={styles.empty_container}>
                          <img src={empty_icon} className={styles.empty_icon} />
                          <h5 className={styles.empty_message}>
                            No items found!
                          </h5>
                        </div>
                      ) : (
                        targetItems?.map((item) => {
                          return (
                            <Item_Card
                              key={item._id}
                              id={item.item_id._id}
                              batch_id={item._id}
                              name={item?.item_id?.name}
                              manufacturer={item?.item_id?.manufacturer}
                              sku={item?.item_id?.sku}
                              exp_date={item?.expiry_date}
                              sell_price={item?.selling_price_per_base}
                              cost_price={item?.cost_price_per_base}
                              sold={item.qty_sold}
                            />
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.pos_cont_small_col}>
                {/* the header */}
                <div className={styles.cart_header_ribbon}>
                  <h3 className={styles.cart_header}>Purchased Items</h3>

                  {/* main buttons */}
                  <div className={styles.ribbon_buttons}>
                    <Badge badgeContent={cartItems.length} color="primary">
                      <LocalMallIcon color="ternary" fontSize="small" />
                    </Badge>

                    <Tooltip title="clear cart">
                      <IconButton
                        color="ternary"
                        fontSize="small"
                        sx={{ ml: "20px" }}
                        onClick={() => clearCartItems()}
                      >
                        <RemoveShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>

                {/* cart details */}
                <div className={styles.cart_cont}>
                  {cartItems.length < 1 ? (
                    <div className={styles.empty_cart_banner}>
                      <img
                        src={emptyCart}
                        className={styles.empty_banner_image}
                      />
                      <span>Cart is empty!</span>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item, index) => {
                        return (
                          <div
                            className={styles.cart_strip}
                            key={`${item.id}_${index}`}
                          >
                            {/* qty partition */}
                            <div className={styles.qty_partition}>
                              <Chip
                                label={item.unit_name}
                                color="primary"
                                sx={{ zoom: ".8" }}
                              />
                              <span>{`x${item.quantity}`}</span>
                            </div>
                            {/* item name partition */}
                            <div className={styles.item_name_partition}>
                              <span className={styles.item_name_cart_strip}>
                                {item.name}
                              </span>
                            </div>
                            {/* price partition */}
                            <div className={styles.price_partition}>
                              <Chip
                                label="LKR"
                                color="ternary"
                                sx={{
                                  zoom: ".5",
                                  width: "80%",
                                  fontSize: "1.3em",
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              />
                              <span>{`${item.total_value.toFixed(2)}`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
                {/* payment summary */}
                <h3 className={styles.cart_header}>Payment Summary</h3>

                <div className={styles.payment_summary}>
                  <div className={styles.payment_row}>
                    <span>Sub Total(LKR)</span>
                    <TextField
                      value={subTotal.toFixed(2)}
                      disabled
                      size="small"
                      sx={{ width: "170px", padding: "4px" }}
                    />
                  </div>
                  <div className={styles.payment_row}>
                    <span>Discount(LKR)</span>
                    <TextField
                      value={discount}
                      size="small"
                      sx={{ width: "170px", padding: "4px" }}
                      onChange={(e) => handleDiscount(e.target.value)}
                    />
                  </div>
                  <div className={styles.payment_row}>
                    <span>Total Payable(LKR)</span>
                    <TextField
                      value={totalPayable.toFixed(2)}
                      disabled
                      size="small"
                      sx={{ width: "170px", padding: "4px" }}
                    />
                  </div>
                </div>

                <h3 className={styles.cart_header}>Payment Method</h3>
                <div className={styles.payment_methods}>
                  <div
                    onClick={() => setPaymentMethods(paymentMethods.cash)}
                    className={`${styles.method_slot} ${
                      paymentMethod == paymentMethods.cash
                        ? styles.active_method
                        : ""
                    }`}
                  >
                    <PriceChangeIcon />
                    <span>Cash</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethods(paymentMethods.card)}
                    className={`${styles.method_slot} ${
                      paymentMethod === paymentMethods.card
                        ? styles.active_method
                        : ""
                    }`}
                  >
                    <CreditCardIcon />
                    <span>Card</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethods(paymentMethods.qr)}
                    className={`${styles.method_slot} ${
                      paymentMethod === paymentMethods.qr
                        ? styles.active_method
                        : ""
                    }`}
                  >
                    <QrCodeScannerIcon />
                    <span>Scan</span>
                  </div>
                </div>

                {/*  */}
                <div className={styles.finalize_btn_cont}>
                  <Button
                    sx={{ width: "220px" }}
                    variant="contained"
                    size="small"
                    endIcon={<ReceiptIcon />}
                    loading={createRecordLoader}
                    disabled={createRecordLoader || cartItems.length < 1}
                    onClick={() => createSaleRecord()}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default POS;
