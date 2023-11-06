import CalendarV02 from "./CalendarV02";
import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { DateContext } from "../DateContext";
import { useNavigate } from "react-router-dom";
import ServerURLAndPort from "../ServerURLAndPort";

export default function MainPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const {startDate, endDate, view} = useContext(DateContext);
    const [events, setEvents] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [displayBlank, setDisplayBlank] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "Admin" || retreivedUser.type == "Manager"){
            navigate("/locations");
        }
    }, [user]);
    
    useEffect(() => {
        if(user && startDate != "" && endDate != ""){

            const urlEnd = user.type.toLowerCase();

            let url = new URL(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/${urlEnd}`);
            url.searchParams.append("id", user.id.toString());
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
    }, [user, startDate, endDate]);

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
                return session.psychologistName;
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



    return(
        <div>
            <div>
            <h1>Personal events</h1>
            {user != null && user.type == "Psychologist" ? <div><button onClick={() => navigate("/appointments/add")}>Add Appointment</button>
            <label>
            <input
            type="checkbox"
            value={displayBlank}
            checked={displayBlank}
            onChange={(e) => setDisplayBlank(e.target.checked)}
            />
            Display Blank Sessions
            </label></div> : null}
            <CalendarV02 events={calendarEvents}/>
            </div>
        </div>
    );
    
    
    
    /*
    useEffect(() => {
            let allEvents = [];
            //fetch all events for current week for current user
            //send user data --> credentials? part of body? --> should be GET, thus credentials would be a good choice
            setEvents(allEvents);
    }, []);
    

    return(
        <div>
            <h1>Your Events</h1>
            {user != null && (user.type == "Psychologist" || user.type == "Client") ? <button onClick={() => 
                navigate("/appointments/add")}>Add Appointment</button> : null}
            <CalendarV02 />
        </div>
    );
*/
}