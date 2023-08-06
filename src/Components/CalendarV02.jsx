import React, {useState, useEffect} from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default calendar styles
import './CalendarV02.css'; // Import your custom CSS file
import events from "../Resources/events";

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
  const newEvents = [{
    id: 0,
    title: "Trial 1",
    start: new Date(2023, 7, 8, 8, 0, 0),
    end: new Date(2023, 7, 8, 10, 0, 0)
  },
  {
    id: 1,
    title: "Trial 2",
    start: new Date(2023, 7, 8, 9, 0, 0),
    end: new Date(2023, 7, 8, 11, 0, 0)
  },
  {
    id: 2,
    title: "Psychologist 1's slot",
    start: new Date(2023, 7, 8, 7, 0, 0),
    end: new Date(2023, 7, 8, 15, 0, 0),
    resource: "3-as"
  }
];

  const [eventsList, setEventsList] = useState(newEvents);

  console.log(eventsList);

  // {
  //   id: 12,
  //   title: 'Late Night Event',
  //   start: new Date(2023, 3, 17, 19, 30, 0),
  //   end: new Date(2023, 3, 18, 2, 0, 0),
  // }
  

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        //culture={culture}
      />
    </div>
  );
}
