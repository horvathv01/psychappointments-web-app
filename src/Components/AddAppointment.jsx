import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddAppointment(){
    const {retreiveUser} = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [client, setClient] = useState(null); //--> registered client htmlFor appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. htmlFor appointment
    const [location, setLocation] = useState(null); //--> registered location htmlFor appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start htmlFor appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end htmlFor appointment
    const [description, setDescription] = useState(""); //--> registered session description htmlFor appointment
    const [allPsychologists, setAllPsychologists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        redirectToLogin();
        setUser(retreiveUser());
        if(user != null && user.type !== "psychologist"){
            //fetch all psychologists (name and id?)
            //setAllPsychologists(fetchedData)
        }
    }, []);

    function redirectToLogin(){
        if(user == null){
            window.alert("Please log in first!");
            navigate("/login");
        }
    }

    function handleSubmit(){
        //validate data --> same as registration validator?
        //what to include? 
        //psychologist.id + psychologist.name? --> to track changes of id in future
        //client's data --> if existing: from DB, else: register new client account with default password
        //location id (+ location name?)
        //session start, session end
        //session description
        //time of appointment addition + data of person who added it
        //fetch POST to add appointment
    }

    function getLocations(){
        let locations = [];
        //fetch available locations
        
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
            zip: 0,
            city: "",
            street: "",
            rest: ""
        }
        //code to parse

        return address;
    }

    function generateClientDataFields(){
        if(user != null && user.type == "client"){
            setClient(user);
            const address = parseAddress(user.address);
            return(
                <div>
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" required>{user.name}</input>
                <label htmlFor="email">Email: </label>
                <input type="text" name="email" required>{user.email}</input>
                <label htmlFor="dateofbirth">Date of birth: </label>
                <input type="date" name="dateofbirth">{user.dateofbirth}</input>
                <p>Address:</p>
                <label htmlFor="city">Country</label>
                <input required type="text" id="country" name="country" autoComplete="country" enterKeyHint="next">{address.country}</input>
                <label htmlFor="postal-code">ZIP or postal code</label>
                <input className="postal-code" id="postal-code" name="postal-code" autoComplete="postal-code" enterKeyHint="next">{address.zip}</input>
                <label htmlFor="city">City</label>
                <input required type="text" id="city" name="city" autoComplete="address-level2" enterKeyHint="next">{address.city}</input>
                <label htmlFor="street-address">Street address</label>
                <input type="text" id="street-address" name="street-address" autoComplete="street-address" required enterKeyHint="next">{address.street + " " + address.rest}</input>
        </div>
            );
        } else {
            return(
                <div>
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" required></input>
                    <label htmlFor="email">Email: </label>
                    <input type="text" name="email" required></input>
                    <label htmlFor="dateofbirth">Date of birth: </label>
                    <input type="date" name="dateofbirth" required></input>
                    <p>Address:</p>
                    <label htmlFor="city">Country</label>
                    <input required type="text" id="city" name="city" autoComplete="country" enterKeyHint="next"></input>
                    <label htmlFor="postal-code">ZIP or postal code</label>
                    <input className="postal-code" id="postal-code" name="postal-code" autoComplete="postal-code" enterKeyHint="next"></input>
                    <label htmlFor="city">City</label>
                    <input required type="text" id="city" name="city" autoComplete="address-level2" enterKeyHint="next"></input>
                    <label htmlFor="street-address">Street address</label>
                    <input type="text" id="street-address" name="street-address" autoComplete="street-address" required enterKeyHint="next"></input>
            </div>
            );
        };
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
                    <p>Select time slot htmlFor session: </p>
                    {getAvailableTimeSlots()}
                    <p>Please describe the problem briefly!</p>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} required></input>
                </form>
            </div>
        </div>
    )

}