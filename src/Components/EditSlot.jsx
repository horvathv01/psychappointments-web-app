import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, GetTimeSlots, ChooseDate } from "./AddAppointment";
import { validateSlotInput } from "./AddSlot";
import DateRangeSelector from "./DateRangeSelector";
import ServerURLAndPort from "../ServerURLAndPort";

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
    const [allSlots, setAllSlots] = useState([]);
    const [originalSlot, setOriginalSlot] = useState();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
        if(psychologist != null && startDate != "" && endDate != ""){

            const url = new URL(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/slot/psychologist/location`);
            url.searchParams.append("psychologistId", psychologist.id.toString());
            url.searchParams.append("locationId", location.id.toString());
            url.searchParams.append("startDate", startDate);
            url.searchParams.append("endDate", endDate);
            
            //console.log(url.toString());
            
            fetch(url.toString(), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => response.json())
            .then(info => {
                //console.log(info);
                setAllSlots(info);
            });
            
        }
    }, [psychologist, startDate, endDate])

    function submit(){
        

        //validate input
        if(!validateSlotInput(psychologist, location, date, sessionLength, slotStart, slotEnd, startDate, endDate)) return;
        const newSlot = {
            id: slot.id,
            psychologistId: psychologist.id,
            locationId: location.id,
            date: date,
            sessionLength: sessionLength,
            rest: rest,
            slotStart: slotStart,
            slotEnd: slotEnd,
            weekly: weekly
        }
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/slot/${slot.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newSlot)
        })
        .then(response => response.text())
        .then(info => {
            window.alert(info);
        });


    }

    function deleteSlot(){
        if(!window.confirm("Are you sure you want to delete this slot?")){
            return;
        }
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/slot/${slot.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.text())
        .then(info => {
            window.alert(info);
        });
        //DELETE request to backend with current slot's id at end of url
        //confirm message should be shown

    }

    function cancel(){
        setSlot(null);
    }

    function handleSlotChange(id){
        //console.log(id);
        const selectedSlot = allSlots.filter(sl => sl.id == id)[0];
        const copySlot = {...selectedSlot};
        setSlot(selectedSlot);
        setOriginalSlot(copySlot);
    }

    return(
        <div>
            <h1>Edit Slot</h1>
            <button onClick={() => navigate("/slots/add")}>Add New Slot</button>
            <p>Choose Location: </p>
            <GetLocations setLocation={setLocation}/>
            {psychologist == null ? <p>Choose Psychologist: </p> : <p>Psychologist: </p>}
            <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location}/>
            <DateRangeSelector start={startDate} end={endDate} setStart={setStartDate} setEnd={setEndDate}/>
            <p>Choose time slot to edit: </p>
            <GetTimeSlots allSlots={allSlots} empty={false} handleChange={handleSlotChange} slot={slot}/>
            {slot && <p>Choose Date: </p>}
            {slot && <ChooseDate setDate={setDate} date={slot.date}/>}
            {slot && <p>Input slot start: </p>}
            {slot && <input type="time" onChange={(e) => setSlotStart(e.target.value)} defaultValue={slot.slotStart}/>}
            {slot && <p>Input slot end: </p>}
            {slot && <input type="time" onChange={(e) => setSlotEnd(e.target.value)} defaultValue={slot.slotEnd}/>}
            {slot && <p>Choose session length: </p>}
            {slot && <select onChange={(e) => setSessionLength(e.target.value)} defaultValue={slot.sessionLength}>
            <option value={50}>50 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
            <option value="custom">Custom</option>
            </select>}
            {sessionLength == "custom" && <input type="number" onChange={(e) => setSessionLength(e.target.value)} defaultValue="Input custom session length"/>}
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
            {slot && <input type="checkbox" onChange={(e) => setWeekly(e.target.value)}/>}
            {slot && <button onClick={cancel}>Cancel</button>}
            {slot && <button onClick={deleteSlot}>Delete Slot</button>}
            {slot && <button onClick={submit}>Save Slot</button>}
        </div>
    );
};