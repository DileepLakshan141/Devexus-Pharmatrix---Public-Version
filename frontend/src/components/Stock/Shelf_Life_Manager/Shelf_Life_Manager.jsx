import React, { useState, useEffect } from "react";
import styles from "./slm.styles.module.css";
import { CircularProgress } from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../../../axios/axios";

function Shelf_Life_Manager() {
  const [itemBatches, setItemBatches] = useState([]);
  const [loading, setLoading] = useState();

  const fetchItemBatches = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/item-batches/");
      if (response) {
        const events = response.data.data.map((batch) => ({
          id: batch._id,
          title: `${batch.batch_no}`,
          start: new Date(batch.expiry_date),
          end: new Date(batch.expiry_date),
          allDay: true,
          resource: batch,
        }));
        setItemBatches(events);
      }
    } catch (error) {
      console.log(error.message || "Error while data fetching!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemBatches();
  }, []);

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const calendarStyles = {
    event: () => ({
      style: {
        backgroundColor: "#2ed573",
        border: "none",
        borderRadius: "4px",
        color: "white",
        fontSize: "12px",
      },
    }),
    day: (date) => ({
      style: {
        backgroundColor:
          date.getDate() === new Date().getDate() ? "#7bed9f" : "white",
      },
    }),
  };

  const EventWithTooltip = ({ event }) => {
    const batch = event.resource;
    return (
      <div
        title={`Batch No: ${batch.batch_no}\nItem: ${
          batch.item_id?.name || "Unknown"
        }\nExpiry: ${new Date(batch.expiry_date).toLocaleDateString()}`}
        style={{
          backgroundColor: "#2ed573",
          borderRadius: "4px",
          padding: "2px 6px",
          color: "white",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        {batch.batch_no}
      </div>
    );
  };

  return (
    <div className={styles.slm_main_container}>
      <div className={styles.overlay_container}></div>
      <div className={styles.content_container}>
        {/* top starting header */}
        <div className={styles.top_starting_header}>
          {/* container headline font */}
          <span className={styles.container_header}>Shelf Life Management</span>
          {/* btns-container */}
          <div className={styles.top_btns_container}></div>
        </div>

        {loading ? (
          <div className={styles.loading_screen}>
            <CircularProgress size="3rem" />
          </div>
        ) : (
          <div
            style={{
              height: "700px",
              width: "100%",
              padding: "20px",
              marginTop: "30px",
              backgroundColor: "rgba(123, 237, 159,.2)",
            }}
          >
            <Calendar
              localizer={localizer}
              events={itemBatches}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              eventPropGetter={calendarStyles.event}
              dayPropGetter={calendarStyles.day}
              components={{
                event: EventWithTooltip,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Shelf_Life_Manager;
