import CalendarV02 from "./CalendarV02";
import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { DateContext } from "../DateContext";
import { useNavigate } from "react-router-dom";

export default function MainPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const {startDate, setStartDate, endDate, setEndDate, view, setView} = useContext(DateContext); 
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "admin" || retreivedUser.type == "manager"){
            navigate("/locations");
        }
    }, [user]);
    
    useEffect(() => {
            let allEvents = [];
            //fetch all events for current week for current user
            //send user data --> credentials? part of body? --> should be GET, thus credentials would be a good choice
            setEvents(allEvents);
    }, []);
    

    return(
        <div>
            <h1>Your Events</h1>
            {user != null && (user.type == "psychologist" || user.type == "client") ? <button onClick={() => 
                navigate("/appointments/add")}>Add Appointment</button> : null}
            <CalendarV02 />
        </div>
    );

}