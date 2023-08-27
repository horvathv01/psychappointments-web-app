import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function AddAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [client, setClient] = useState(null); //--> registered client for appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for appointment
    const [location, setLocation] = useState(null); //--> registered location for appointment
    const [date, setDate] = useState(null); //--> regsitered date for appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start for appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end for appointment
    const [description, setDescription] = useState(""); //--> registered session description for appointment
    const [frequency, setFrequency] = useState("weekly"); //--> registered frequency for appointment
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
        if (retreivedUser.type == "client"){
            setClient(retreivedUser);
        }
    }, [user, client]);


    function handleSubmit(){
        //validate data --> same as registration validator!
        //what to include? 
        //psychologist.id + psychologist.name? --> to track changes of id in future
        //client's data --> send to backend, see if email already exists --> add appointment to existing client ELSE create new client with standard password
        //location id (+ location name?)
        //session start, session end (date from date state)
        //frequency of session
        //session description
        //time of appointment addition + data of person who added it
        //fetch POST to add appointment

        //if session collides with future scheduled sessions but is fine this time, respond with warning
        //if session is scheduled for unfit time (collides with another one): respond with nope (hacker protection)
    }

    

    function handleFrequencyChange(freq){
        setFrequency(freq);
    }

    function handleLocationChange(location){
        setLocation(location);
    }

    

    function setSlot(slot){
        setSessionStart(slot.start);
        setSessionEnd(slot.end);
    }

    function parseAddress(input){
        let address = {
            country: "",
            zip: "",
            city: "",
            street: "",
            rest: ""
        }
        if(input != undefined){
            return input;
        }
            //empty address can still be returned so that object structure can still be used
        return address;
    }

    function GenerateClientDataFields() {
        const clientFormFields = {
          name: { label: "name", type: "text", required: true },
          email: { label: "email", type: "text", required: true },
          phone: { label: "phone", type: "phone", required: true },
          dateOfBirth: { label: "dateofbirth", type: "date", required: true }
        };
      
        const address = client != null ? parseAddress(client.address) : parseAddress();
      
        const defaultValues = Object.fromEntries(
          Object.entries(clientFormFields).map(([fieldName, fieldProps]) => {
            return [
              fieldName,
              user && user.type === "client" && client ? client[fieldProps.label] : ""
            ];
          })
        );
      
        return (
          <div>
            {Object.entries(clientFormFields).map(([fieldName, fieldProps]) => {
              return (
                <div key={fieldName}>
                  <label htmlFor={fieldName}>{fieldProps.label}:</label>
                  <input
                    required={fieldProps.required}
                    className="input-field"
                    id={fieldName}
                    type={fieldProps.type}
                    name={fieldName}
                    defaultValue={defaultValues[fieldName]}
                  />
                </div>
              );
            })}
                <div>
                    <p>Address:</p>
                    <label htmlFor="city">Country</label>
                    <input 
                    required 
                    className="input-field" 
                    type="text" 
                    id="country" 
                    name="country" 
                    autoComplete="country" 
                    enterKeyHint="next" 
                    defaultValue={address.country}></input>
                    <label htmlFor="postal-code">ZIP or postal code</label>
                    <input
                    required
                    className="input-field" 
                    id="postal-code" 
                    type="text"
                    name="postal-code" 
                    autoComplete="postal-code" 
                    enterKeyHint="next" 
                    defaultValue={address.zip}></input>
                    <label htmlFor="city">City</label>
                    <input 
                    required
                    className="input-field" 
                    id="city" 
                    type="text" 
                    name="city" 
                    autoComplete="address-level2" 
                    enterKeyHint="next" 
                    defaultValue={address.city}></input>
                    <label htmlFor="street-address">Street address</label>
                    <input 
                    required 
                    className="input-field" 
                    id="street-address" 
                    type="text" 
                    name="street-address" 
                    autoComplete="street-address" 
                    enterKeyHint="next" 
                    defaultValue={address.street + " " + address.rest}></input>
                </div>
            </div>
        )
    };

    //choose location first --> fetch psychologists available at location
    //see user: if user is psychologist --> psychologist field should be filled with own data
        //else if user is client --> client fields should be filled with own data, psychologist field should be a dropdown menu (with fetch from backend)
        //else if user is admin/manager --> psychologist field should be a dropdown menu (with fetch from backend), if existing client? --> dropdown menu
            //else: client fields should be filled by hand
        

    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <p>Location: </p>
                    <GetLocations handleLocationChange={handleLocationChange} />
                    <p>Psychologist: </p>
                    <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location} />
                    <p>Client: </p>
                    {user && <GenerateClientDataFields psychologist={psychologist}/>}
                    <p>Select date:</p>
                    <ChooseDate setDate={setDate}/>
                    <p>Select time slot for session: </p>
                    <GetTimeSlots psychologist={psychologist} empty={true} />
                    <p>Recurring session?</p>
                    <select onChange={(e) => handleFrequencyChange(e.target.value)} defaultValue="weekly">
                        <option value="weekly">Weekly</option>
                        <option value="2week">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="none">None (only one session)</option>
                    </select>
                    <p>Please describe the problem briefly!</p>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} required></input>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
    )

}

export function GetLocations({handleLocationChange}){
    const {user, retreiveUser} = useContext(UserContext);
    let locations = [];
    if(user != null && (user.type == "psychologist" || user.type == "manager")){
    //only fetch associated locations
    //setAllPsychologists(fetchedData)
    }
    //fetch all locations
    //setAllPsychologists(fetchedData)

    return(
        <div>
            <select onChange={(e) => handleLocationChange(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Location</option>
                {locations.map(l => <option value={l}>{l.name}</option>)}
            </select>
        </div>
    )
}

export function GeneratePsychologistDataField({psychologist, setPsychologist, location}){
    const {user, retreiveUser} = useContext(UserContext);
    const [allPsychologists, setAllPsychologists] = useState([]);

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
        if(retreivedUser.type != "psychologist"){
            //fetch all psychologists with associated location
            //setAllPsychologists(result)
        } else {
            setPsychologist(retreivedUser);
        }
    }, [user, location]);


    if(psychologist != null){
        return(
            <p>{psychologist.name}</p>
        );
    } else {
        return(
            <select onChange={(e) => setPsychologist(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Psychologist</option>
                {allPsychologists.map(p => <option value={p}>{p.name}</option>)}
            </select>
        );
    };
};

export function GetTimeSlots({psychologist, empty}){
    const [allSlots, setAllSlots] = useState([]);

    useEffect(() => {
        if(psychologist != null){
            if(empty){ //empty is a boolean
                //fetch empty time slots only
                //setAllSlots(result)
            } else {
                //fetch all time slots of psychologist
                //setAllSlots(result)
            }
        }
        
    }, [psychologist]);


    if(psychologist == null){
        return (
            <p>Choose psychologist first!</p>
        );
    } else {
        let slots = [];
        //fetch available time slots of chosen psychologist
        return(<div>
            <select onChange={(e) => setSlot(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Slot</option>
                {allSlots.map(s => <option value={s}>{s.name}</option>)}
            </select>
        </div>
    );
    }
}

export function ChooseDate({setDate}){
    return(<div>
        <input type="date" onChange={(e) => setDate(e.target.value)}></input>
    </div>);

}