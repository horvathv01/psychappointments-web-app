import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { arrayContains } from "./EditLocations";
import ServerURLAndPort from "../ServerURLAndPort";

export default function AddLocations(){
    const {user, retreiveUser} = useContext(UserContext);
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

    function submit(e){
        e.preventDefault();
        if(!validateInput()){
            return;
        }
        //send POST request to register new location
        const location = {
            Name: locName,
            Address: address,
            ManagerIds: managers.map(man => man.id),
            PsychologistIds: psychologists.map(psy => psy.id)
        }

        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(location)
        })
        .then(response => response.text())
        .then(info => window.alert(info))
        
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
        newAddress.Country = country;
        setAddress(newAddress);
    }

    function setCity(city){
        let newAddress = {...address};
        newAddress.City = city;
        setAddress(newAddress);
    }

    function setZip(zip){
        let newAddress = {...address};
        newAddress.Zip = zip;
        setAddress(newAddress);
    }

    function setStreet(street){
        let newAddress = {...address};
        newAddress.Street = street;
        setAddress(newAddress);
    }

    function setRestOfAddress(rest){
        let newAddress = {...address};
        newAddress.Rest = rest;
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


    return(
        <div>
            <form onSubmit={(e) => submit(e)}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={(e) => setLocName(e.target.value)} /><br /><br />

                <label htmlFor="country">Country:</label>
                <input type="text" id="country" name="country" onChange={(e) => setCountry(e.target.value)} /><br /><br />

                <label htmlFor="city">City:</label>
                <input type="text" id="city" name="city" onChange={(e) => setCity(e.target.value)}/><br /><br />

                <label htmlFor="zip">ZIP Code:</label>
                <input type="text" id="zip" name="zip" onChange={(e) => setZip(e.target.value)}/><br /><br />

                <label htmlFor="street">Street:</label>
                <input type="text" id="street" name="street" onChange={(e) => setStreet(e.target.value)}/><br /><br />

                <label htmlFor="restOfAddress">Rest of Address:</label>
                <input type="text" id="restOfAddress" name="restOfAddress" onChange={(e) => setRestOfAddress(e.target.value)}/><br /><br />

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
            </form>
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