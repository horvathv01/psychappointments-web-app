import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, GetTimeSlots, ChooseDate } from "./AddAppointment";
import { validateSlotInput } from "./AddSlot";

export default function EditSlot(){
    const navigate = useNavigate();
    const {user, retreiveUser} = useContext(UserContext);
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for slot
    const [slot, setSlot] = useState(null);
    const [location, setLocation] = useState(null); //--> registered location for 
    const [date, setDate] = useState(null); //date for slot
    const [sessionLength, setSessionLength] = useState(50);
    const [rest, setRest] = useState(10);
    const [slotStart, setSlotStart] = useState(null); //--> registered session start for slot
    const [slotEnd, setSlotEnd] = useState(null); //--> registered session end for slot
    const [weekly, setWeekly] = useState(true); //--> weekly repetition?
    const [allLocations, setAllLocations] = useState([]);

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
        if(retreivedUser.type == "psychologist"){
            setPsychologist(retreivedUser);
        } else if (retreivedUser.type == "client"){
            navigate("/unauthorized");
        }

    }, [user]);

    useEffect(() => {
        if(location == null){
        //fetch all (associated) locations
        //setAllLocations(result);
        }
    }, [psychologist]);

    function handleLocationChange(loc){
        setLocation(loc);
    }

    function submit(){
        //validate input
        if(!validateSlotInput(psychologist, location, date, sessionLength, slotStart, slotEnd)) return;
        const newSlot = {
            id: slot.id,
            psychologist: psychologist,
            location: location,
            date: date,
            sessionLength: sessionLength,
            rest: rest,
            slotStart: slotStart,
            slotEnd: slotEnd,
            weekly: weekly
        }
        setSlot(newSlot);
        //POST request to server with newSlot
        //should be validated on backend
        //prepopulate with blank sessions that can be edited
        //show message with success/fail
    }

    function deleteSlot(){
        if(!window.confirm("Are you sure you want to delete this slot?")){
            return;
        }
        //DELETE request to backend with current slot in body
        //confirm message should be shown

    }

    return(
        <div>
            <h1>Edit Slot</h1>
            <button onClick={() => navigate("/slots/add")}>Add New Slot</button>
            <p>Choose Location: </p>
            <GetLocations handleLocationChange={handleLocationChange}/>
            {psychologist == null ? <p>Choose Psychologist: </p> : <p>Psychologist: </p>}
            <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location}/>
            <p>Choose time slot to edit: </p>
            <GetTimeSlots psychologist={psychologist} empty={false} setSlot={setSlot}/>
            {slot && <p>Choose Date: </p>}
            {slot && <ChooseDate setDate={setDate} date={slot.date}/>}
            {slot && <p>Input slot start: </p>}
            {slot && <input type="time" onChange={(e) => setSlotStart(e.target.value)}>{slot.slotStart}</input>}
            {slot && <p>Input slot end: </p>}
            {slot && <input type="time" onChange={(e) => setSlotEnd(e.target.value)}>{slot.slotEnd}</input>}
            {slot && <p>Choose session length: </p>}
            {slot && <select onChange={(e) => setSessionLength(e.target.value)} defaultValue={slot.sessionLength}>
            <option value={50}>50 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
            <option value="custom">Custom</option>
            </select>}
            {sessionLength == "custom" && <input type="number" onChange={(e) => setSessionLength(e.target.value)} defaultValue="Input custom session length"></input>}
            {slot && <p>Choose resting time between sessions: </p>}
            {slot && <select onChange={(e) => setRest(e.target.value)} defaultValue={slot.rest}>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value="custom">Custom</option>
            </select>}
            {rest == "custom" && <input type="number" onChange={(e) => setRest(e.target.value)} defaultValue="Input custom rest length"></input>}
            <br/>
            {slot && <p>Weekly repetition?</p>}
            {slot && <input type="checkbox" onChange={(e) => setWeekly(e.target.value)}></input>}
            {slot && <button onClick={deleteSlot}>Delete Slot</button>}
            {slot && <button onClick={submit}>Save Slot</button>}
        </div>
    );
};