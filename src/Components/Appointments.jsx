import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function Appointments(){    
    const {user, retreiveUser} = useContext(UserContext);
    const [allAppointments, setAllAppointments] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "psychologist"){
            navigate("/unauthorized");
        }
        //fetch all clients, sessions included
        let sessions = [];
        for(let i = 0; i < 7; i++){
            const start = new Date();
            let end = new Date(start);
            end.setHours(start.getHours() + 1);
            const session = {
                id: i,
                psychologist: retreivedUser,
                location: "tibavár",
                start: start,
                end: end,
                client: null,
                price: i * 1000,
                frequency: "weekly"
            }
            sessions.push(session)
        }

        setAllAppointments(sessions);

    }, [user]);
    
    return(<div>    
        <h1>Appointments</h1>
        {allAppointments && allAppointments.map(appointment => <AppointmentDetails appointment={appointment}/>)}
    </div>);

}

function AppointmentDetails({appointment}){
    const navigate = useNavigate();

    return(
        <div key={"appointment" + appointment.id}>
            <p>
                ID: {appointment.id}, 
                Psychologist: {appointment.psychologist.name}, 
                Client: {appointment.client}, 
                Location: {appointment.location}, 
                Start: {appointment.start.toString()}
                End: {appointment.end.toString()}
                Price: {appointment.price}
                Frequency: {appointment.frequency}
            </p>
            <button onClick={() => navigate(`/appointments/edit`)}>Edit Appointment</button>        
        </div>
    )
}