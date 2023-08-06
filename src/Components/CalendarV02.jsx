import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default calendar styles
import './CalendarV02.css'; // Import your custom CSS file

//moment.tz.setDefault("Europe");

const localizer = momentLocalizer(moment);

Calendar.ControlledComponent.defaultProps.views = ["week", "month"];
const culture = {
  week: "Hét",
  work_week: "Munkahét",
  day: "Nap",
  month: "Hónap",
  previous: "Előző",
  next: "Következő",
  today: "Ma",
  agenda: "Események"
};
//console.log(localizer);


export default function CalendarV02() {
  const myEventsList = [];
  
  

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        //culture={culture}
      />
    </div>
  );
}
