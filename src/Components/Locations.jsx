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
    const [displayBlank, setDisplayBlank] = useState(true);
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
            url.searchParams.append("id", location.id.toString());
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
            if(displayBlank){
                events.map(ses => newCalEvents.push(convertSessionToEvent(ses)));
            } else {
                events.filter(ses => !ses.blank).map(ses => newCalEvents.push(convertSessionToEvent(ses)));
            }
            setCalendarEvents(newCalEvents);
        }
    }, [events, displayBlank])

    function convertSessionToEvent(session){

        function getEventTitle(){
            if(user.type == "Admin"){
                if(session.blank){
                    return `${session.psychologistName}, blank`;
                } else {
                return `${session.psychologistName}, client: ${session.clientName}`;
                }
            }
            if(user.type == "Psychologist" && session.psychologistId == user.id){
                //my session --> show client's name
                return session.clientName;
            } else {
                //all other cases: show psychologist's name
                return session.psychologistName + (session.blank ? " BLANK" : " OCCUPIED");
            }
        }


        return {
            id: session.id,
            title: getEventTitle(),
            start: new Date(session.start),
            end: new Date(session.end),
            psychologist: session.psychologistName,
            partnerPsychologist: session.partnerPsychologistName,
            client: session.clientName,
            price: session.price
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
            <label>
            <input
            type="checkbox"
            value={displayBlank}
            checked={displayBlank}
            onChange={(e) => setDisplayBlank(e.target.checked)}
            />
            Display Blank Sessions
            </label>

            <CalendarV02 events={calendarEvents}/>
            </div>
        </div>
    );
};