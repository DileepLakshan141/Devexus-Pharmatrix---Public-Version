import styles from "./ic.styles.module.css";
import card_pic from "../../../assets/images/drugs.png";
import dayjs from "dayjs";
import axiosInstance from "../../../axios/axios";
import { useDispatch, useSelector } from "react-redux";
import { upsertCartItem } from "../../../app/cart.slice.js";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function Item_Card(props) {
  const dispatch = useDispatch();

  const getSelectedUnitObject = () => {
    return units.find((unit) => unit.to_base_qty === selectedUnit);
  };

  const {
    name,
    manufacturer,
    sku,
    exp_date,
    id,
    batch_id,
    sell_price,
    cost_price,
    sold,
  } = props;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [qtyCounter, setQtyCounter] = useState(0);

  const increaseQty = () => {
    if (!selectedUnit) {
      toast.error("Please select a unit first");
      return;
    }
    const selectedUnitObj = getSelectedUnitObject();
    const newQty = qtyCounter + 1;
    setQtyCounter(newQty);

    dispatch(
      upsertCartItem({
        item: props,
        quantity: newQty,
        selectedUnit: selectedUnit,
        unitName: selectedUnitObj?.unit_name || "",
      })
    );
  };

  const decreaseQty = () => {
    if (qtyCounter > 0) {
      const newQty = qtyCounter - 1;
      setQtyCounter(newQty);

      dispatch(
        upsertCartItem({
          item: props,
          quantity: newQty,
          selectedUnit: selectedUnit,
        })
      );
    }
  };

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/item-units/${id}`);
      console.log(response.data);
      setUnits(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [id]);

  const cartItems = useSelector((state) => state.cart.cart_items);

  useEffect(() => {
    if (selectedUnit) {
      const cartItem = cartItems.find(
        (item) => item.id === props.id && item.selectedUnit === selectedUnit
      );
      setQtyCounter(cartItem ? cartItem.quantity : 0);
    }
  }, [selectedUnit, cartItems, id]);

  return (
    <div className={styles.pos_item_card_cont}>
      <div className={styles.overlay_container_ic}>
        <img src={card_pic} alt="medicine_pic" />
      </div>
      <div className={styles.content_container_ic}>
        <h5 className={styles.ic_card_head}>{name}</h5>
        <h6 className={styles.ic_card_manufacturer}>{manufacturer}</h6>
        {/* shelf details */}
        <div className={styles.ic_card_shelf_info}>
          <span>SKU:{sku}</span>
          <span>EXP:{dayjs(exp_date).format("MMM DD, YYYY")}</span>
        </div>
        {/* pricing */}
        <div className={styles.ic_card_shelf_info}>
          <span>Cost(LKR):{cost_price.toFixed(2)}</span>
          <span>Sell(LKR):{sell_price.toFixed(2)}</span>
          <span>Sold:{sold}</span>
        </div>
        {/* unit, details add to cart*/}
        <div className={styles.ic_sell_info}>
          {loading ? (
            <div className={styles.load_dealy}>
              <CircularProgress size=".4em" />
            </div>
          ) : (
            <Select
              size="small"
              sx={{ zoom: ".7" }}
              value={selectedUnit}
              displayEmpty
              onChange={(e) => setSelectedUnit(e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Select Unit</em>;
                }
                const unit = units.find((u) => u.to_base_qty === selected);
                return unit ? unit.unit_name : selected;
              }}
            >
              {units.map((unit) => {
                return (
                  <MenuItem value={unit.to_base_qty}>{unit.unit_name}</MenuItem>
                );
              })}
            </Select>
          )}
          {loading ? (
            <div className={styles.load_dealy}>
              <CircularProgress size=".4em" />
            </div>
          ) : (
            <div className={styles.ic_card_counter}>
              <button
                className={styles.qty_adjust_btn}
                onClick={() => decreaseQty()}
              >
                <RemoveIcon />
              </button>
              <span>{qtyCounter}</span>
              <button
                className={styles.qty_adjust_btn}
                onClick={() => increaseQty()}
              >
                <AddIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item_Card;
