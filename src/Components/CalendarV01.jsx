import React, {useState, useEffect, useRef} from "react";
import { DayPilotCalendar, DayPilotNavigator, DayPilot } from "@daypilot/daypilot-lite-react";

//here is how to use DayPilot calendar component:
//https://code.daypilot.org/42221/react-weekly-calendar-tutorial

export default function CalendarV01(){
    const configObj = {
        //viewType: "Week",
        viewType: "Resources",
        startDate: getMonday(new Date()),
        durationBarVisible: false,
        columns: generateCalendarHeader(getMonday(new Date()))
      };

    const navConfigObj = {
      selectMode: "Week",
      weekStarts: 1,
      //selectionStart: configObj.startDate
      //skipMonths: 3,
      //onTimeRangeSelected: handleTimeRangeSelected,
      //ref: navigatorRef
    };

    
    
      
      const calendarRef = useRef();
      const navigatorRef = useRef();
  
      const [config, setConfig] = useState(configObj);
      const [navConfig, setNavConfig] = useState(navConfigObj);

      const handleTimeRangeSelected = args => {
        console.log(args);
        const newConfigObj = {...config};
                
        newConfigObj.startDate = getMonday(args.day);
        newConfigObj.columns = generateCalendarHeader(getMonday(calendarRef.current.control.startDate));
        setConfig(newConfigObj);        
      }

      const goToToday = () => {
        let newConfigObj = {...config};
        const monday = getMonday(new Date());
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        newConfigObj.startDate = monday;
        newConfigObj.columns = generateCalendarHeader(monday);

        
        console.log(navigatorRef.current.control);
        let newNavConfig = {...navConfig};
        newNavConfig.selectionStart = new DayPilot.Date(monday);
        newNavConfig.selectionEnd = new DayPilot.Date(sunday);
        // navigatorRef.current.control.update({
        // selectionStart: new DayPilot.Date(monday),
        // selectionEnd: new DayPilot.Date(sunday)
        // })

        //setNavConfig(newNavConfig);
        setConfig(newConfigObj);
      }

    return(
        <div style={styles.wrap}>
            <div style={styles.left}>
                <DayPilotNavigator
                    {...navConfig}
                    onTimeRangeSelected={handleTimeRangeSelected}
                    ref={navigatorRef}
                />
            </div>
            <button onClick={goToToday}>Jump to today</button>
            <div style={styles.main}>
                <DayPilotCalendar 
                {...config} 
                ref={calendarRef} 
                
                />
            </div>
        </div>
    );
}

const styles = {
    wrap: {
      display: "flex"
    },
    left: {
      marginRight: "10px"
    },
    main: {
      flexGrow: "1"
    }
  };

  function addDaysToDate(date, num, months){
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + num);
    const day = newDate.getDate();
    const month = months[newDate.getMonth()];
    return `${month} ${day}.`;
  }

  function getMonday(input){
    const date = new Date(input);
    const monday = new Date(
      date.setDate(date.getDate() - date.getDay() + 1),
    );
    return monday;
  }

  function generateCalendarHeader(startDate){
    let columns = [
      { name: "Hétfő", id: "1"},
      { name: "Kedd", id: "2" },
      { name: "Szerda", id: "3" },
      { name: "Csütörtök", id: "4" },
      { name: "Péntek", id: "5" },
      { name: "Szombat", id: "6" },
      { name: "Vasárnap", id: "7" }]

    let months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

   return columns.map(day => {
        const id = parseInt(day.id) - 1;
        return {
        name: (day.name + "\n" + addDaysToDate(startDate, id, months)),
        id: id
    }
})
  }