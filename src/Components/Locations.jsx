import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import CalendarV02 from "./CalendarV02";
import { DateContext } from "../DateContext";

export default function Locations(){
    const {user, retreiveUser} = useContext(UserContext);
    const {startDate, endDate, view} = useContext(DateContext);
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user == null) {
            navigate("/loginfirst");
        }
        if(location){
            let allEvents = [];
            //fetch all events for current week for this location
            //send user data --> credentials? part of body? --> should be GET, thus credentials would be a good choice
            setEvents(allEvents);
        }
    }, []);

    function handleLocationChange(loc){
        setLocation(loc);

    }

    function getLocations(){
        let locations = [];
        if(user != null && user.type == "manager"){
        //only fetch associated locations

        }

        
        //fetch all locations for clients, psychologists and admins
        //if user is psychologist: associated locations should be in the beginning of list and clearly marked
        

        return(
            <div>
                <select onChange={(e) => handleLocationChange(e.target.value)} defaultValue="">
                    <option value="" disabled>Choose Location</option>
                    {user && user.type == "psychologist" ? locations.map(l => l.psychologists.includes(user) ? 
                    <option value={l}>{l.name} *</option> 
                    : <option value={l}>{l.name}</option>) 
                    : locations.map(l => <option value={l}>{l.name}</option>)}
                </select>
            </div>
        )
    }
    //purpose of page is to see all events (with limited data based on user) associated with one location only (to be chosen from list)

    return(
        <div>
            <div>
                {getLocations()}
            </div>
            <div>
            <h1>Location's events</h1>
            {user != null && user.type == "psychologist" ? <button onClick={() => navigate("/addappointment")}>Add Appointment</button> : null}
            <CalendarV02 events={events}/>
            </div>
        </div>
    );
};