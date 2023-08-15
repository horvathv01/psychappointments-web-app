import CalendarV02 from "./CalendarV02";
import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { DateContext } from "../DateContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function MainPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const {startDate, setStartDate, endDate, setEndDate, view, setView} = useContext(DateContext); 
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user == null) {
            navigate("/loginfirst");
        }
        if(location){
            let allEvents = [];
            //fetch all events for current week for current user
            //send user data --> credentials? part of body? --> should be GET, thus credentials would be a good choice
            setEvents(allEvents);
        }
    }, []);
    

    return(
        <div>
            <h1>Your Events</h1>
            {user != null && user.type == "psychologist" ? <button onClick={() => navigate("/addappointment")}>Add Appointment</button> : null}
            <CalendarV02 />
        </div>
    );

}