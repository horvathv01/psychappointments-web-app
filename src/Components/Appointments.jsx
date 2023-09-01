import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GenerateListOfPsychologists } from "./AddAppointment";

export default function Appointments(){    
    const {user, retreiveUser} = useContext(UserContext);
    const [allAppointments, setAllAppointments] = useState(null);
    const [allPsychologists, setAllPsychologists] = useState([]);
    const [psychologist, setPsychologist] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "psychologist" && retreivedUser.type != "admin"){
            navigate("/unauthorized");
        }
        if(retreivedUser.type == "psychologist"){
            setPsychologist(retreivedUser);
        //fetch all clients, sessions included
        } else if (retreivedUser.type == "admin"){
        //fetch all psychologists, choose the one you want to see from list
        //setAllPsychologists(result)
        }
        
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
        <button onClick={() => navigate("/appointments/add")}>Add New Appointment</button>
        {user && user.type == "admin" && <GenerateListOfPsychologists allPsychologists={allPsychologists} setPsychologist={setPsychologist}/>}
        {allAppointments && allAppointments.map(appointment => <AppointmentDetails key={"appointment" + appointment.id} appointment={appointment}/>)}
    </div>);

}

function AppointmentDetails({appointment}){
    const navigate = useNavigate();

    return(
        <div>
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
            <button onClick={() => navigate(`/appointments/edit?id=${appointment.id}`)}>Edit Appointment</button>        
        </div>
    )
}