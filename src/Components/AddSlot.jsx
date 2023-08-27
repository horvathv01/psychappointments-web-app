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

    return(
        <div>
            <h1>Add Slot</h1>
            <p>Choose Location: </p>
            <GetLocations handleLocationChange={handleLocationChange}/>
            {psychologist == null ? <p>Choose Psychologist: </p> : <p>Psychologist: </p>}
            <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location}/>
            <p>Choose Date: </p>
            <ChooseDate setDate={setDate}/>
            <p>Choose session length: </p>
            <select onChange={(e) => setSessionLength(e.target.value)} defaultValue={50}>
            <option value={50}>{sessionLength} minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
            <option value="custom">Custom</option>
            </select>
            <p>Choose resting time between sessions: </p>

        </div>
    );
};