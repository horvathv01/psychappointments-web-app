import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import CalendarV02 from "./CalendarV02";
import { DateContext } from "../DateContext";
import { GetLocations } from "./AddAppointment";
import ServerURLAndPort from "../ServerURLAndPort";

export default function Locations(){
    const {user, retreiveUser} = useContext(UserContext);
    const {startDate, endDate, view} = useContext(DateContext);
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
    }, [user]);

    useEffect(() => {
        if(location != null && startDate != "" && endDate != ""){

            const url = new URL(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/location`);
            url.searchParams.append("locationId", location.id.toString());
            url.searchParams.append("startDate", startDate);
            url.searchParams.append("endDate", endDate);
            
            //console.log(url.toString());
            
            fetch(url.toString(), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => response.json())
            .then(info => {
                console.log(info);
                setEvents(info);
            });
            
        }
    }, [location, startDate, endDate]);


    //purpose of page is to see all events (with limited data based on user) associated with one location only (to be chosen from list)

    return(
        <div>
            <div>
            <GetLocations setLocation={setLocation}/>
            </div>
            <div>
            <h1>Location's events</h1>
            {user != null && user.type == "Psychologist" ? <button onClick={() => navigate("/addappointment")}>Add Appointment</button> : null}
            <CalendarV02 events={events}/>
            </div>
        </div>
    );
};