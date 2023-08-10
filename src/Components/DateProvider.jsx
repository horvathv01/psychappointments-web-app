import React, {useState} from "react";
import { DateContext } from "../DateContext";

export const DateProvider = ({children}) => {
  const monday = getMonday();  
  const sunday = getSunday(monday);

  const [startDate, setStartDate] = useState(monday);
  const [endDate, setEndDate] = useState(sunday);
  const [view, setView] = useState("week");

  function getMonday(date) {
    if (date === undefined) {
      date = new Date();
    }
  
    const dayOfWeek = date.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysUntilMonday);
  
    return monday;
  }
    
    function getSunday(monday){
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        return sunday;
    }

    function getEndOfMonth(day){
        const year = day.getFullYear();
        const month = day.getMonth();
        const lastDay = new Date(year, month + 1, 0);

        return lastDay;
    }

    function getFirstDayOfMonth(day){
        const year = day.getFullYear();
        const month = day.getMonth();
        const firstDay = new Date(year, month, 1);

        return firstDay;
    }

return(
    <DateContext.Provider value={{
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
        }}>
        {children}
    </DateContext.Provider>
)
}