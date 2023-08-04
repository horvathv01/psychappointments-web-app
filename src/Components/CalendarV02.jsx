import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default calendar styles
import './CalendarV02.css'; // Import your custom CSS file

const localizer = momentLocalizer(moment);

export default function CalendarV02() {
  const myEventsList = [];

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}
