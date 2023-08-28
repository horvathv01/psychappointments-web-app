import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, GetTimeSlots, GenerateClientDataFields } from "./AddAppointment";
import { ChooseDate } from "./AddAppointment";


export default function EditAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [client, setClient] = useState(null); //--> registered client for appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for appointment
    const [location, setLocation] = useState(null); //--> registered location for appointment
    const [date, setDate] = useState(null); //--> regsitered date for appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start for appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end for appointment
    const [description, setDescription] = useState(""); //--> registered session description for appointment
    const [frequency, setFrequency] = useState("weekly"); //--> registered frequency for appointment
    const [slot, setSlot] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "client"){
            navigate("/unauthorized");
        }
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        const id = searchParams.get("id");
        
        //is it null/undefined? --> navigate("/appointments")
        if(!id) navigate("/appointments");

        
        //fetch appointment information
        //is user not associated with appointment && type != "admin"? --> navigate("/appointments")
        //setAppointment(result)
        //setSlot(result.slot)
        //setPsychologist(result.psychologist)
        //setLocation(result.location)
        //setDate(result.date)
        //setSessionStart(result.start)
        //setSessionEnd(result.end)
        //setDescription(result.description)
        //setFrequency(result.frequency)       
        //setClient(result.client) 
    }, [user]);

    function handleSubmit(){
        //validate data --> same as registration validator!
        //what to include? 
        //psychologist.id + psychologist.name? --> to track changes of id in future
        //client's data --> send to backend, see if email already exists --> add appointment to existing client ELSE create new client with standard password
        //location id (+ location name?)
        //slot
        //session start, session end (date from date state)
        //frequency of session
        //session description
        //time of appointment addition + data of person who added it
        //fetch POST to add appointment

        //if session collides with future scheduled sessions but is fine this time, respond with warning
        //if session is scheduled for unfit time (collides with another one): respond with nope (hacker protection)
    };

    function deleteAppointment(){
        if(!window.confirm("Are you sure you want to delete this slot?")){
            return;
        }
        //DELETE request to backend with current slot in body
        //confirm message should be shown

    }

    return(
        <div>
            <div>
            <button onClick={() => navigate("/appointments/add")}>Add New Appointment</button>
                <form onSubmit={handleSubmit}>
                    {appointment && <p>Location: </p>}
                    {appointment && <ShowAndChangeData data={location} setData={setLocation} 
                    alternative={<GetLocations handleLocationChange={setLocation} />} />}
                    {appointment && <p>Psychologist: </p>}
                    {appointment && <ShowAndChangeData data={psychologist} setData={setPsychologist} 
                    alternative={<GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location} />}/>}
                    {appointment && <p>Client: </p>}
                    {appointment && <ShowAndChangeData data={client.name} setData={setClient} 
                    alternative={user && <GenerateClientDataFields user={user} client={client}/>}/>}
                    {appointment && <p>Select date:</p>}
                    {appointment && <ShowAndChangeData data={date} setData={setDate} alternative={<ChooseDate setDate={setDate}/>}/>}
                    {appointment && <p>Select time slot for session: </p>}
                    {appointment && <ShowAndChangeData data={slot} setData={setSlot} 
                    alternative={<GetTimeSlots psychologist={psychologist} empty={true} setSlot={setSlot}/>}/>}
                    {appointment && <p>Recurring session?</p>}
                    {appointment && <ShowAndChangeData data={frequency} setData={setFrequency} alternative={<select onChange={(e) => setFrequency(e.target.value)} defaultValue="weekly">
                        <option value="weekly">Weekly</option>
                        <option value="2week">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="none">None (only one session)</option>
                    </select>}/>}
                    {appointment && <p>Please describe the problem briefly!</p>}
                    {appointment && <input type="textarea" onChange={(e) => setDescription(e.target.value)} required>{description}</input>}
                    {appointment && <button onClick={deleteAppointment}>Delete Appointment</button>}
                    {appointment && <input type="submit" value="Submit"></input>}
                </form>
            </div>
        </div>
    )
}

export function ShowAndChangeData({data, setData, alternative}){
    const [change, setChange] = useState(false);

    return(
        <div>
            {!change ? <div><p>{data}</p><button onClick={() => setChange(!change)}>Change</button></div> : alternative}
        </div>
    )
}
//appointment.location