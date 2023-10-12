import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, ChooseDate } from "./AddAppointment";
import ServerURLAndPort from "../ServerURLAndPort";

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
        if(retreivedUser.type == "Psychologist"){
            setPsychologist(retreivedUser);
        } else if (retreivedUser.type == "Client"){
            navigate("/unauthorized");
        }

    }, [user]);

    useEffect(() => {
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/allpsychologists`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(info => setAllPsychologists(info))
    }, [])

    useEffect(() => {
        if(location == null){
        //fetch all (associated) locations
        //setAllLocations(result);
        }
    }, [psychologist]);

    /*
    function handleLocationChange(id){
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(info => {
        setLocation(info)})
    }
    */

    function submit(){
        //validate input
        if(!validateSlotInput(psychologist, location, date, sessionLength, rest, slotStart, slotEnd)) return;

        const slotDTO = {
            Id: 0,
            PsychologistId: psychologist.id,
            LocationId: location.id,
            Date: date,
            SlotStart: slotStart,
            SlotEnd: slotEnd,
            SessionLength: sessionLength,
            Rest: rest,
            Weekly: weekly
        }
        console.log(slotDTO);
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/slot`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(slotDTO)
        })
        .then(response => response.text())
        .then(info => {
            window.alert(info);
        })        
    }

    function handleDateChange(date){
        const today = new Date();
        const newDate = new Date(date);
        if(newDate <= today){
            window.alert("The date has to be in the future.");
        } else{
        setDate(newDate);    
        }
    }



    return(
        <div>
            <h1>Add Slot</h1>
            <p>Choose Location: </p>
            <GetLocations setLocation={setLocation}/>
            {psychologist == null ? <p>Choose Psychologist: </p> : <p>Psychologist: </p>}
            <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location}/>
            <p>Choose Date: </p>
            <ChooseDate setDate={handleDateChange}/>
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
            <select onChange={(e) => setRest(e.target.value)} value={rest}>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value="custom">Custom</option>
            </select>
            {rest == "custom" && <input type="number" onChange={(e) => setRest(e.target.value)} defaultValue="Input custom rest length"></input>}
            <br/>
            <p>Weekly repetition?</p>
            <input type="checkbox" onChange={(e) => setWeekly(e.target.value)}></input>
            <br/>
            <br/>
            <button onClick={submit}>Add Slot</button>
        </div>
    );
};

export function validateSlotInput(psychologist, location, date, sessionLength, rest, slotStart, slotEnd){
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
        if(new Date(date) >= new Date()){
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