import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function AddLocations(){
    const {user, retreiveUser} = useContext(UserContext);
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
        } else if (retreivedUser.type == "psychologist" || retreivedUser.type == "client"){
            navigate("/unauthorized");
        } else if (retreivedUser.type == "manager"){
            let newManagers = [];
            newManagers.push(retreivedUser);
            setManagers(newManagers);
        }

        //fetch all psychologists, setAllPsychologists(result)
        //fetch all managers, setAllManagers(managerResult)
    }, [user]);

    function submit(){
        if(!validateInput()){
            return;
        }
        //send POST request to register new location
        const location = {
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


    return(
        <div>
            <form onSubmit={submit}>
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
                <select id="selectOption1" name="selectOption1" onChange={(e) => addManager(e.target.value)}>
                    {allManagers.map(man => <option key={"manager" + man.Id} value={man}>{man.Name}</option>)}
                </select><br /><br />

                <label htmlFor="selectOption2">Add Psychologist:</label>
                <select id="selectOption2" name="selectOption2" onChange={(e) => addPsychologist(e.target.value)}>
                {allPsychologists.map(psy => <option key={"psychologist" + psy.Id} value={psy}>{psy.Name}</option>)}
                </select><br /><br />

                <label htmlFor="managers">Managers:</label>
                <ul id="managers"></ul><br /><br />
                {managers.map(man => <li key={"registeredMan" + man.Id}>{man.Name}</li>)}
                <label htmlFor="psychologists">Psychologists:</label>
                <ul id="psychologists"></ul><br /><br />
                {psychologists.map(psy => <li key={"registeredPsy" + psy.Id}>{psy.Name}</li>)}
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