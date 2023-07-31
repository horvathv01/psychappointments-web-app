import React, {useState, useEffect, useRef} from "react";
import { DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";

//here is how to use DayPilot calendar component:
//https://code.daypilot.org/42221/react-weekly-calendar-tutorial

export default function Calendar(){
    let configObj = {
        //viewType: "Week",
        viewType: "Resources",
        durationBarVisible: false,
        columns: [
            { name: "Hétfő", id: "A"},
            { name: "Kedd", id: "B" },
            { name: "Szerda", id: "C" },
            { name: "Csütörtök", id: "D" },
            { name: "Péntek", id: "E" },
            { name: "Szombat", id: "F" },
            { name: "Vasárnap", id: "G" },]
      };

    const [config, setConfig] = useState(configObj);
      
      const calendarRef = useRef();
  
      const handleTimeRangeSelected = args => {
        calendarRef.current.control.update({
          startDate: args.day
        });
        console.log("this is info:");
        console.log(calendarRef.current.control.startDate);
        console.log("and one week to that is:");
        let numToAdd = -1;
        const columns = configObj.columns.map(day => {
            numToAdd += 1;
            return {
            name: (day.name + "\n" + addDays(calendarRef.current.control.startDate, numToAdd)),
            id: numToAdd
        }
    }); 
 
        configObj.columns = columns;
        console.log(configObj.columns);
        setConfig(configObj);
        //const newDate = (calendarRef.current.control.startDate).addDays(7);
        //console.log(newDate);
        //console.log(addDays(calendarRef.current.control.startDate, 7));
        
      }

    return(
        <div style={styles.wrap}>
            <div style={styles.left}>
                <DayPilotNavigator
                    selectMode={"Week"}
                    //skipMonths={3}
                    onTimeRangeSelected={handleTimeRangeSelected}
                />
            </div>
            <div style={styles.main}>
                <DayPilotCalendar {...config} ref={calendarRef} />
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

  function addDays(date, num){
    const newDate = date.addDays(num);
    let stringDate = newDate.toString();
    stringDate = stringDate.replaceAll("-", " ");
    return stringDate.slice(0, 10);
  }