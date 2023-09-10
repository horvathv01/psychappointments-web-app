import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations } from "./AddAppointment";

export default function EditLocations(){
    const {user, retreiveUser} = useContext(UserContext);
    const [location, setLocation] = useState(null); //chosen location to edit
    const [locName, setLocName] = useState("");
    const [address, setAddress] = useState({});
    const [managers, setManagers] = useState([]);
    const [psychologists, setPsychologists] = useState([]);
    const [allPsychologists, setAllPsychologists] = useState([]);
    const [allManagers, setAllManagers] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "Psychologist" || retreivedUser.type == "Client"){
            navigate("/unauthorized");
        } else if (retreivedUser.type == "Manager"){
            let newManagers = [];
            newManagers.push(retreivedUser);
            setManagers(newManagers);
        }

        //fetch all psychologists, setAllPsychologists(result)
        //fetch all managers, setAllManagers(managerResult)
    }, [user]);

    useEffect(() => {
        if(location != null){
            setLocName(location.Name);
            setAddress(location.Address);
            setManagers(location.Managers);
            setPsychologists(location.Psychologists);
        }
    }, [location])

    function submit(){
        if(!validateInput()){
            return;
        }
        //send POST request to make changes to location
        const location = {
            Id: location.Id,
            Name: locName,
            Address: address,
            Managers: managers,
            Psychologists: psychologists
        }


    }

    function validateInput(){
        if(locName == ""){
            window.alert("Name cannot be empty!")
            return false;
        }
        if(address == {}){
            window.alert("Please provide address!")
            return false;
        }
        if(managers.length == 0){
            window.alert("Please add at least one manager!")
            return false;
        }
        if(psychologists.length == 0){
            return window.confirm(`No psychologist has been registered to ${locName}. Do you want to continue?`);
        }
        return true;
    }

    function addManager(manager){
        newManagers = [...managers];
        newManagers.push(manager);
        setManagers(newManagers);
    }

    function addPsychologist(psychologist){
        newPsychologists = [...psychologists];
        newPsychologists.push(psychologist);
        setPsychologists(newPsychologists);
    }

    function setCountry(country){
        newAddress = {...address};
        address.Country = country;
        setAddress(newAddress);
    }

    function setCity(city){
        newAddress = {...address};
        address.City = city;
        setAddress(newAddress);
    }

    function setZip(zip){
        newAddress = {...address};
        address.Zip = zip;
        setAddress(newAddress);
    }

    function setStreet(street){
        newAddress = {...address};
        address.Street = street;
        setAddress(newAddress);
    }

    function setRestOfAddress(rest){
        newAddress = {...address};
        address.Rest = rest;
        setAddress(newAddress);
    }

    function removeManager(manager){
        newManagers = [...managers];
        const index = newManagers.indexOf(manager);
        newManagers.splice(index, 1);
        setManagers(newManagers);
    }

    function removePsychologist(psychologist){
        newPsychologists = [...psychologists];
        const index = newPsychologists.indexOf(psychologist);
        newPsychologists.splice(index, 1);
        setPsychologists(newPsychologists);
    }

    function cancelChanges(){
        setLocation(null);
        setLocName("");
        setAddress({});
        setManagers([]);
        setPsychologists([]);
    }

    function deleteLocation(){
        const confirm = window.confirm("Are you sure you want to delete this location?");
        if(!confirm){
            window.alert("Location has not been deleted");
            return;
        }
        //DELETE request to backend with location in body
        //return success/fail message --> display in window.alert

    }


    return(
        <div>
            <GetLocations handleLocationChange={(e) => setLocation(e.target.value)} />
            {location && 
            <form onSubmit={submit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={(e) => setLocName(e.target.value)} defaultValue={location.Name}/><br /><br />

                <label htmlFor="country">Country:</label>
                <input type="text" id="country" name="country" onChange={(e) => setCountry(e.target.value)} defaultValue={location.Address.Country}/><br /><br />

                <label htmlFor="city">City:</label>
                <input type="text" id="city" name="city" onChange={(e) => setCity(e.target.value)} defaultValue={location.Address.City}/><br /><br />

                <label htmlFor="zip">ZIP Code:</label>
                <input type="text" id="zip" name="zip" onChange={(e) => setZip(e.target.value)} defaultValue={location.Address.Zip}/><br /><br />

                <label htmlFor="street">Street:</label>
                <input type="text" id="street" name="street" onChange={(e) => setStreet(e.target.value)} defaultValue={location.Address.Street}/><br /><br />

                <label htmlFor="restOfAddress">Rest of Address:</label>
                <input type="text" id="restOfAddress" name="restOfAddress" onChange={(e) => setRestOfAddress(e.target.value)} defaultValue={location.Address.Rest}/><br /><br />
            
                <label htmlFor="selectOption1">Add Manager:</label>
                <select id="selectOption1" name="selectOption1" onChange={(e) => addManager(e.target.value)}>
                    {allManagers.map(man => <option key={"manager" + man.Id} value={man}>{man.Name}</option>)}
                </select><br /><br />

                <label htmlFor="selectOption2">Add Psychologist:</label>
                <select id="selectOption2" name="selectOption2" onChange={(e) => addPsychologist(e.target.value)}>
                {allPsychologists.map(psy => <option key={"psychologist" + psy.Id} value={psy}>{psy.Name}</option>)}
                </select><br /><br />

                <label htmlFor="managers">Managers:</label>
                <ul id="managers"></ul><br /><br />
                {managers.map(man => <div><li key={"registeredMan" + man.Id}>{man.Name}</li><button onClick={() => removeManager(man)}>Remove</button></div>)}
                <label htmlFor="psychologists">Psychologists:</label>
                <ul id="psychologists"></ul><br /><br />
                {psychologists.map(psy => <div><li key={"registeredPsy" + psy.Id}>{psy.Name}</li><button onClick={() => removePsychologist(psy)}>Remove</button></div>)}
                <input type="submit" value="Submit" />
                <button onClick={() => cancelChanges()}>Cancel</button>
                <button onClick={() => deleteLocation()}>Delete Location</button>
            </form>}
        </div>
    );
};
//add name
//add address (like with a client)
//if user.type == "manager" --> add him/herself
//if user.type == "admin" --> get list of managers to add
//get list of psychologists to add (component with allPsychologists?)
//show list of managers
//show list of psychologists