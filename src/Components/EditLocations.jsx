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

    const [selectedManager, setSelectedManager] = useState("");
    const [selectedPsychologist, setSelectedPsychologist] = useState("");

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
            setAllManagers(info);
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
            setAllPsychologists(info);
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

            setLocName(location.name);
            setAddress(location.address);
        }
    }, [location])

    function submit(e){
        e.preventDefault();

        if(!validateInput()){
            return;
        }
        //send PUT request to make changes to location
        const newLocation = {
            Name: locName,
            Address: address,
            ManagerIds: managers.map(man => man.id),
            PsychologistIds: psychologists.map(psy => psy.id)
        }
        console.log(newLocation);
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${location.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newLocation)
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
        let newManagers = [...managers];
        const managerToAdd = allManagers.filter(man => man.id == id);
        managerToAdd.forEach(man => newManagers.push(man));
        setManagers(newManagers);
    }

    function addPsychologist(id){
        let newPsychologists = [...psychologists];
        const psychologistToAdd = allPsychologists.filter(psy => psy.id == id);
        psychologistToAdd.forEach(psy => newPsychologists.push(psy));
        setPsychologists(newPsychologists);
    }

    function setCountry(country){
        let newAddress = {...address};
        newAddress.country = country;
        setAddress(newAddress);
    }

    function setCity(city){
        let newAddress = {...address};
        newAddress.city = city;
        setAddress(newAddress);
    }

    function setZip(zip){
        let newAddress = {...address};
        newAddress.zip = zip;
        setAddress(newAddress);
    }

    function setStreet(street){
        let newAddress = {...address};
        newAddress.street = street;
        setAddress(newAddress);
    }

    function setRestOfAddress(rest){
        let newAddress = {...address};
        newAddress.rest = rest;
        setAddress(newAddress);
    }

    function removeManager(id){
        let newManagers = [...managers];
        const managerToRemove = newManagers.filter(man => man.id == id);
        const index = newManagers.indexOf(managerToRemove);
        newManagers.splice(index, 1);
        setManagers(newManagers);
    }

    function removePsychologist(id){
        let newPsychologists = [...psychologists];
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
                <select id="selectOption1" name="selectOption1" value={selectedManager} onChange={(e) => {
                    addManager(e.target.value)
                    setSelectedManager("");
                    }}>
                <option value="" disabled>Add new manager</option>
                {allManagers.length > 0 && allManagers.filter(man => !arrayContains(managers, man))
                .map(man => <option key={"manager" + man.id} value={man.id}>{man.name}</option>)}
                </select><br /><br />

                <label htmlFor="selectOption2">Add Psychologist:</label>
                <select key={"allPsychologists" + allPsychologists.length} id="selectOption2" name="selectOption2" value={selectedPsychologist} onChange={(e) => {
                    setSelectedPsychologist("");
                    addPsychologist(e.target.value)}
                    }>
                <option value="" disabled>Add new psychologist</option>
                {allPsychologists.length > 0 && allPsychologists.filter(psy => !arrayContains(psychologists, psy))
                .map(psy => <option key={"psychologist" + psy.id} value={psy.id}>{psy.name}</option>)}
                </select><br /><br />

                <label htmlFor="managers">Managers:</label>
                <ul id="managers"></ul><br /><br />
                {managers.length > 0 && managers.map(man => <li key={"registeredMan" + man.id}><p>{man.name}</p><button onClick={() => removeManager(man.id)}>Remove</button></li>)}
                <label htmlFor="psychologists">Psychologists:</label>
                <ul id="psychologists"></ul><br /><br />
                {psychologists.length > 0 && psychologists.map(psy => <li key={"registeredPsy" + psy.id}><p>{psy.name}</p><button onClick={() => removePsychologist(psy.id)}>Remove</button></li>)}
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

function arrayContains(arr, item){
    for(let i = 0; i < arr.length; i++){
        if(arr[i].id == item.id){
            return true;
        }
    }
    return false;
}