import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [client, setClient] = useState(null); //--> registered client htmlFor appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. htmlFor appointment
    const [location, setLocation] = useState(null); //--> registered location htmlFor appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start htmlFor appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end htmlFor appointment
    const [description, setDescription] = useState(""); //--> registered session description htmlFor appointment
    const [allPsychologists, setAllPsychologists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user == null) {
            navigate("/loginfirst");
        }
    }, []);

    function handleSubmit(){
        //validate data --> same as registration validator?
        //what to include? 
        //psychologist.id + psychologist.name? --> to track changes of id in future
        //client's data --> send to backend, see if email already exists --> add appointment to existing client ELSE create new client with standard password
        //location id (+ location name?)
        //session start, session end
        //session description
        //time of appointment addition + data of person who added it
        //fetch POST to add appointment
    }

    function getLocations(){
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

    function handleLocationChange(location){
        setLocation(location);
        let psychologists = [];
        //fetch psychologists available at location
        setAllPsychologists(psychologists);
    }

    function getAvailableTimeSlots(){
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
                    {slots.map(s => <option value={s}>{s.name}</option>)}
                </select>
            </div>
        );
        }
    }

    function setSlot(slot){
        setSessionStart(slot.start);
        setSessionEnd(slot.end);
    }

    function generatePsychologistDataField(){
        if(user != null && user.type == "psychologist"){
            setPsychologist(user);
            return(
                <p>{user.name}</p>
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

    function parseAddress(input){
        let address = {
            country: "",
            zip: "",
            city: "",
            street: "",
            rest: ""
        }
        if(input != undefined){
            //code to parse
        }
            //empty address can still be returned so that object structure can still be used
        return address;
    }

    function generateClientDataFields(){

        const clientFormFields = {
            name: {label: "name", type: "text", required: true},
            email: {label: "email", type: "text", required: true},
            phone: {label: "phone", type: "phone", required: true},
            dateOfBirth: {label: "dateofbirth", type: "date", required: true}
        }

        if(user != null && user.type == "client"){
            setClient(user);
        };
        
        const address = client != null ? parseAddress(client.address) : parseAddress();

        return(
            <div>
            {
                Object.entries(clientFormFields).map(([fieldName, fieldProps]) => {
                    return(
                    <div key={fieldName}>
                        <label htmlFor={fieldName}>{fieldProps.label}:</label>
                        <input
                        required={fieldProps.required}
                        className="input-field" 
                        id={fieldName}
                        type={fieldProps.type}
                        name={fieldName}
                        defaultValue={user?.type === "client" ? client[fieldName] : ""}
                        />
                    </div>)
                })
            }
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
                <NavBar />
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <p>Location: </p>
                    {getLocations()}
                    <p>Psychologist: </p>
                    {generatePsychologistDataField()}
                    <p>Client: </p>
                    {generateClientDataFields()}
                    <p>Select time slot for session: </p>
                    {getAvailableTimeSlots()}
                    <p>Please describe the problem briefly!</p>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} required></input>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
    )

}
