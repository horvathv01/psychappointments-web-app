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
    const [calendarEvents, setCalendarEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
    }, [user]);

    useEffect(() => {
        if(location != null && startDate != "" && endDate != ""){

            let url = new URL(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/location`);
            url.searchParams.append("locationId", location.id.toString());
            url.searchParams.append("startDate", `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`);
            url.searchParams.append("endDate", `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`);
        
            
            fetch(url.toString(), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => response.json())
            .then(info => {
                setEvents(info);
            });
            
        }
    }, [location, startDate, endDate]);

    useEffect(() => {
        //convert sessions to calendar events:
        if(events.length > 0){
            let newCalEvents = [];
            events.map(ses => newCalEvents.push(convertSessionToEvent(ses)));
            setCalendarEvents(newCalEvents);
        }
    }, [events])

    function convertSessionToEvent(session){
        return {
            id: session.id,
            title: "Session",
            start: new Date(session.start),
            end: new Date(session.end)
          }
    }


    //purpose of page is to see all events (with limited data based on user) associated with one location only (to be chosen from list)

    return(
        <div>
            <div>
            <GetLocations setLocation={setLocation}/>
            </div>
            <div>
            <h1>Location's events</h1>
            {user != null && user.type == "Psychologist" ? <button onClick={() => navigate("/addappointment")}>Add Appointment</button> : null}
            <CalendarV02 events={calendarEvents}/>
            </div>
        </div>
    );
};