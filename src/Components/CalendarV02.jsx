import React, {useState, useEffect, useContext} from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default calendar styles
import './CalendarV02.css'; // Import your custom CSS file
import { DateContext } from "../DateContext";
import events from "../Resources/events";

//moment.tz.setDefault("Europe");

const localizer = momentLocalizer(moment);


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


export default function CalendarV02({events}) {
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

Calendar.ControlledComponent.defaultProps.views = ["week", "month"];

  const [eventsList, setEventsList] = useState(events == undefined ? newEvents : events);
  const {
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    view, 
    setView, 
    getMonday, 
    getSunday, 
    getFirstDayOfMonth, 
    getEndOfMonth
  } = useContext(DateContext); 

  useEffect(() => {
    console.log("start: " + startDate);
    console.log("end: " + endDate);
    console.log("view: " + view);
  }, [startDate, endDate, view])

  function handleNavigate(event){
    if(view == "week"){
      const monday = getMonday(event);
      setStartDate(monday);
      setEndDate(getSunday(monday));
    } else {
      const firstDay = getFirstDayOfMonth(event);
      setStartDate(firstDay);
      setEndDate(getEndOfMonth(firstDay));
    }
  }

  function handleViewChange(event){
    console.log(event);
    setView(event);
    if(event == "week"){
      let newStartDate = new Date(startDate);
      newStartDate.setDate(newStartDate.getDate() + (new Date().getDate() - 1));
      const monday = getMonday(newStartDate);
      setStartDate(monday);
      setEndDate(getSunday(monday));
    } else {
      const firstDay = getFirstDayOfMonth(startDate);
      setStartDate(firstDay);
      setEndDate(getEndOfMonth(firstDay));
    }
  }

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
        defaultDate={startDate}
        onNavigate={(e) => handleNavigate(e)}
        onView={(e) => handleViewChange(e)}
        //culture={culture}
      />
    </div>
  );
}
