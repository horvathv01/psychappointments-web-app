import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations } from "./AddAppointment";
import ServerURLAndPort from "../ServerURLAndPort";

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
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/allmanagers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if(!response.ok){
                console.log("AllManagers fetch failed.");
                return [];
            }
            return response.json()})
        .then(info => {
            setAllManagers(info)
        })

        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/allpsychologists`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if(!response.ok){
                console.log("AllPsychologists fetch failed.");
                return [];
            }
            return response.json()})
        .then(info => {
            setAllPsychologists(info)
        })
    }, [user]);

    useEffect(() => {
        if(location != null){
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/managers/location/${location.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(info => setManagers(info))

            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/psychologists/location/${location.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(info => setPsychologists(info))

            setLocName(location.Name);
            setAddress(location.Address);
        }
    }, [location])

    function submit(e){
        e.preventDefault();

        if(!validateInput()){
            return;
        }
        //send PUT request to make changes to location
        const location = {
            Name: locName,
            Address: address,
            Managers: managers.map(man => man.id),
            Psychologists: psychologists.map(psy => psy.id)
        }
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${location.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(location)
        })
        .then(response => response.text())
        .then(info => window.alert(info))

    }

    function getLocationData(id){
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(info => {
            console.log(info);
            setLocation(info)})
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

    function addManager(id){
        newManagers = [...managers];
        const managerToAdd = allManagers.filter(man => man.id == id);
        newManagers.push(managerToAdd);
        setManagers(newManagers);
    }

    function addPsychologist(id){
        newPsychologists = [...psychologists];
        const psychologistToAdd = allPsychologists.filter(psy => psy.id == id);
        newPsychologists.push(psychologistToAdd);
        setPsychologists(newPsychologists);
    }

    function setCountry(country){
        newAddress = {...address};
        newAddress.country = country;
        setAddress(newAddress);
    }

    function setCity(city){
        newAddress = {...address};
        newAddress.city = city;
        setAddress(newAddress);
    }

    function setZip(zip){
        newAddress = {...address};
        newAddress.zip = zip;
        setAddress(newAddress);
    }

    function setStreet(street){
        newAddress = {...address};
        newAddress.street = street;
        setAddress(newAddress);
    }

    function setRestOfAddress(rest){
        newAddress = {...address};
        newAddress.rest = rest;
        setAddress(newAddress);
    }

    function removeManager(id){
        newManagers = [...managers];
        const managerToRemove = newManagers.filter(man => man.id == id);
        const index = newManagers.indexOf(managerToRemove);
        newManagers.splice(index, 1);
        setManagers(newManagers);
    }

    function removePsychologist(id){
        newPsychologists = [...psychologists];
        const psychologistToRemove = newPsychologists.filter(psy => psy.id == id);
        const index = newPsychologists.indexOf(psychologistToRemove);
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
        //DELETE request to backend with locationId in body
        //return success/fail message --> display in window.alert
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${location.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.text())
        .then(info => window.alert(info))

    }


    return(
        <div>
            <GetLocations handleLocationChange={getLocationData} />
            {location && 
            <form onSubmit={(e) => submit(e)}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={(e) => setLocName(e.target.value)} defaultValue={location.name}/><br /><br />

                <label htmlFor="country">Country:</label>
                <input type="text" id="country" name="country" onChange={(e) => setCountry(e.target.value)} defaultValue={location.address.country}/><br /><br />

                <label htmlFor="city">City:</label>
                <input type="text" id="city" name="city" onChange={(e) => setCity(e.target.value)} defaultValue={location.address.city}/><br /><br />

                <label htmlFor="zip">ZIP Code:</label>
                <input type="text" id="zip" name="zip" onChange={(e) => setZip(e.target.value)} defaultValue={location.address.zip}/><br /><br />

                <label htmlFor="street">Street:</label>
                <input type="text" id="street" name="street" onChange={(e) => setStreet(e.target.value)} defaultValue={location.address.street}/><br /><br />

                <label htmlFor="restOfAddress">Rest of Address:</label>
                <input type="text" id="restOfAddress" name="restOfAddress" onChange={(e) => setRestOfAddress(e.target.value)} defaultValue={location.address.rest}/><br /><br />
            
                <label htmlFor="selectOption1">Add Manager:</label>
                <select id="selectOption1" name="selectOption1" onChange={(e) => addManager(e.target.value)}>
                    {allManagers.length > 0 && allManagers.map(man => <option key={"manager" + man.id} value={man.id}>{man.name}</option>)}
                </select><br /><br />

                <label htmlFor="selectOption2">Add Psychologist:</label>
                <select id="selectOption2" name="selectOption2" onChange={(e) => addPsychologist(e.target.value)}>
                {allPsychologists.length > 0 && allPsychologists.map(psy => <option key={"psychologist" + psy.id} value={psy.id}>{psy.name}</option>)}
                </select><br /><br />

                <label htmlFor="managers">Managers:</label>
                <ul id="managers"></ul><br /><br />
                {managers.length > 0 && managers.map(man => <div key={"registeredMan" + man.id}><li>{man.name}</li><button onClick={() => removeManager(man.id)}>Remove</button></div>)}
                <label htmlFor="psychologists">Psychologists:</label>
                <ul id="psychologists"></ul><br /><br />
                {psychologists.length > 0 && psychologists.map(psy => <div key={"registeredPsy" + psy.id}><li>{psy.name}</li><button onClick={() => removePsychologist(psy.id)}>Remove</button></div>)}
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