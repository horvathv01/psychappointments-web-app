import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, GetTimeSlots, ChooseDate } from "./AddAppointment";

export default function AddSlot(){
    const navigate = useNavigate();
    const {user, retreiveUser} = useContext(UserContext);
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for slot
    const [location, setLocation] = useState(null); //--> registered location for 
    const [date, setDate] = useState(null); //date for slot
    const [sessionLength, setSessionLength] = useState(50);
    const [rest, setRest] = useState(10);
    const [slotStart, setSlotStart] = useState(null); //--> registered session start for slot
    const [slotEnd, setSlotEnd] = useState(null); //--> registered session end for slot
    const [weekly, setWeekly] = useState(true); //--> weekly repetition?
    const [allPsychologists, setAllPsychologists] = useState([]);
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
        if(!validateInput()) return;
        //POST request to server with new slot
        //should be validated on backend
        //prepopulate with blank sessions that can be edited
        
    }

    function validateInput(){
        if(psychologist == null){
            window.alert("Please choose psychologist!");
            return false;
        }
        if(location == null){
            window.alert("Please choose location!");
            return false;
        }
        if(date == null){
            window.alert("Please choose a date!");
            if(new Date(date).getDate() >= new Date().getDate()){
                window.alert("The date has to be in the future!");
                return false;
            }
            return false;
        }
        if(sessionLength == null){
            window.alert("Please choose session length!");
            return false;
        }
        if(rest == null){
            window.alert("Please input resting time between sessions!");
            return false;
        }
        if(slotStart == null){
            window.alert("Please choose start of slot!");
            return false;
        }
        if(slotEnd == null){
            window.alert("Please choose end of slot!");
            if(slotEnd < slotStart){
                window.alert("End cannot be before start!");
                return false;    
            }
            return false;
        }
        return true;
    }

    return(
        <div>
            <h1>Add Slot</h1>
            <p>Choose Location: </p>
            <GetLocations handleLocationChange={handleLocationChange}/>
            {psychologist == null ? <p>Choose Psychologist: </p> : <p>Psychologist: </p>}
            <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location}/>
            <p>Choose Date: </p>
            <ChooseDate setDate={setDate}/>
            <p>Input session start: </p>
            <input type="time" onChange={(e) => setSlotStart(e.target.value)}></input>
            <p>Input session end: </p>
            <input type="time" onChange={(e) => setSlotEnd(e.target.value)}></input>
            <p>Choose session length: </p>
            <select onChange={(e) => setSessionLength(e.target.value)} defaultValue={50}>
            <option value={50}>50 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
            <option value="custom">Custom</option>
            </select>
            {sessionLength == "custom" && <input type="number" onChange={(e) => setSessionLength(e.target.value)} defaultValue="Input custom session length"></input>}
            <p>Choose resting time between sessions: </p>
            <select onChange={(e) => setRest(e.target.value)} defaultValue={10}>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value="custom">Custom</option>
            </select>
            {rest == "custom" && <input type="number" onChange={(e) => setRest(e.target.value)} defaultValue="Input custom rest length"></input>}
            <br/>
            <button onClick={submit}>Add Slot</button>
        </div>
    );
};