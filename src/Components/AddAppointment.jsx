import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import ServerURLAndPort from "../ServerURLAndPort";
import { Form, Row, Col, Button } from "react-bootstrap";
import { validateUserData } from "./ProfilePage";

export default function AddAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [client, setClient] = useState(null); //--> registered client for appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for appointment
    const [location, setLocation] = useState(null); //--> registered location for appointment
    const [date, setDate] = useState(null); //--> regsitered date for appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start for appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end for appointment
    const [description, setDescription] = useState(""); //--> registered session description for appointment
    const [frequency, setFrequency] = useState("Weekly"); //--> registered frequency for appointment
    const [slot, setSlot] = useState(null);
    const [price, setPrice] = useState(12000);
    const [allSlots, setAllSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
        if (retreivedUser.type == "Client"){
            setClient(retreivedUser);
        }
    }, [user, client]);

    useEffect(() => {
        //console.log(client);
        if(location && psychologist && client && date){

            const originalDate = new Date(date);
            originalDate.setDate(originalDate.getDate() + 1);
            const endDate = originalDate.toISOString().split('T')[0];

            const url = new URL(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/slot/psychologist/location`);
            url.searchParams.append("psychologistId", psychologist.id.toString());
            url.searchParams.append("locationId", location.id.toString());
            url.searchParams.append("startDate", date);
            url.searchParams.append("endDate", endDate);
            
            console.log(url.toString());
            
            fetch(url.toString(), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => response.json())
            .then(info => {
                console.log(info);
                setAllSlots(info);
            });
        }

    }, [location, psychologist, client, date])

    function handleSlotChange(slotId){
        const selectedSlot = allSlots.filter(sl => sl.id == slotId)[0];
        console.log(selectedSlot);
        setSlot(selectedSlot);
    }

    function validate(){
        if(!location){
            return false;
        }
        if(!psychologist){
            return false;
        }
        if(!client){
            return false;
        }
        if(!date){
            return false;
        }
        if(!sessionStart){
            return false;
        }
        if(!sessionEnd){
            return false;
        }
        if(!description){
            return false;
        }
        if(price > 0)
        return true;
    }


    function handleSubmit(e){
        e.preventDefault();
        if(!validate()){
            console.log("validation failed")
            return;
        }

        const sessionDTO = {
            Id: 0,
            PsychologistId: psychologist.id,
            Blank: false,
            LocationId: location.id,
            Date: date,
            Start: sessionStart,
            End: sessionEnd,
            ClientId: client.id,
            Price: price,
            Frequency: frequency,
            SlotId: null,
            Description: description
        };

        //console.log(sessionDTO);
        
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(sessionDTO)
        })
        .then(response => response.text())
        .then(info => window.alert(info));


    }
        

    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <p>Location: </p>
                    <GetLocations setLocation={setLocation} />
                    <p>Psychologist: </p>
                    <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location} />
                    <p>Client: </p>
                    {user && <GenerateClientDataFields user={user} client={client} setClient={setClient}/>}
                    <p>Select date:</p>
                    <ChooseDate setDate={setDate}/>
                    {/*<p>Select time slot for session: </p>*/}
                    {/*<GetTimeSlots allSlots={allSlots} handleChange={handleSlotChange}/>*/}
                    <p>Input session start: </p>
                    <input type="time" onChange={(e) => setSessionStart(e.target.value)}></input>
                    <p>Input session end: </p>
                    <input type="time" onChange={(e) => setSessionEnd(e.target.value)}></input>
                    <p>Recurring session?</p>
                    <select onChange={(e) => setFrequency(e.target.value)} defaultValue="Weekly">
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="None">None (only one session)</option>
                    </select>
                    <p>Input price:</p>
                    <input type="number" onChange={(e) => setPrice(e.target.value)} defaultValue={price}></input>
                    <p>Please describe the problem briefly!</p>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} required></input>
                    <button onClick={handleSubmit}>Add Session</button>
                </form>
            </div>
        </div>
    )

}

export function GetLocations({setLocation}){
    const {user, retreiveUser} = useContext(UserContext);
    const [allLocations, setAllLocations] = useState([]);

    //fetch all locations
    //setAllPsychologists(fetchedData)
    useEffect(() => {
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(info => setAllLocations(info));
    }, [])

    function handleLocationChange(id){
        const selectedLocation = allLocations.filter(loc => loc.id == id)[0];
        setLocation(selectedLocation);
    }


    return(
        <div>
            <select onChange={(e) => handleLocationChange(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Location</option>
                {allLocations.length > 0 && allLocations.map(l => <option key={"location" + l.id} value={l.id}>{l.name}</option>)}
            </select>
        </div>
    )
}

export function GeneratePsychologistDataField({psychologist, setPsychologist, location, dontDisplay}){
    const {user, retreiveUser} = useContext(UserContext);
    const [allPsychologists, setAllPsychologists] = useState([]);

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
        if(retreivedUser.type != "Psychologist"){
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/allpsychologists`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(data => data.json())
            .then(info => {
                setAllPsychologists(info)
            })
            .catch(error => console.log(error));
            //fetch all psychologists with associated location
            //setAllPsychologists(result)
        } else {
            setPsychologist(retreivedUser);
        }
    }, [user, location]);

    return(
        <div>
            {!psychologist ? <GenerateListOfPsychologists allPsychologists={allPsychologists} setPsychologist={setPsychologist} dontDisplay={dontDisplay}/> :
            <div><p>{psychologist.name}</p><button onClick={() => setPsychologist(null)}>Change</button></div>
        }
        </div>
    );
};

export function GenerateListOfPsychologists({allPsychologists, setPsychologist, dontDisplay}){

    function handlePsychologistChange(id){
        const selectedPsychologist = allPsychologists.filter(psy => psy.id == id)[0];
        setPsychologist(selectedPsychologist);
    }

    return(
        <select onChange={(e) => handlePsychologistChange(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Psychologist</option>
                {allPsychologists.length > 0 && dontDisplay ? 
                allPsychologists.filter(p => p.id != dontDisplay.id).map(p => <option key={"psychologist" + p.id} value={p.id}>{p.name}</option>) : 
                allPsychologists.map(p => <option key={"psychologist" + p.id} value={p.id}>{p.name}</option>)}
        </select>
    );
};

export function GetTimeSlots({allSlots, handleChange}){
        return(<div>
            <select onChange={(e) => handleChange(e.target.value)} value="">
                <option value="" disabled>Choose Slot</option>
                {allSlots.length > 0 && allSlots.map(sl => <option key={"slot"+sl.id} value={sl.id}>{sl.slotStart} - {sl.slotEnd}</option>)}
            </select>
        </div>
    );
}

export function ChooseDate({setDate, date}){
    return(<div>
        <input type="date" onChange={(e) => setDate(e.target.value)} defaultValue={date && date}/>
    </div>);

}


export function GenerateClientDataFields({user, client, setClient}){
    const [edit, setEdit] = useState(false);

    function registerProfile(profile){

        /*
               const profile = {
          Id: 0,
          Name: "Proba" + " " + "Client",
          Type: "Client",
          Email: "proba@client.hu",
          Phone: "+123456789",
          DateOfBirth: "2011-11-11",
          Address: {
              Country: "Hungary",
              Zip: "1234",
              City: "Budapest",
              Street: "Kossuth Lajos utca",
              Rest: "19/c"
          },
          Password: "1234",
          RegisteredBy: user.Id,
          SessionIds: [],
          PsychologistIds: [],
          ClientIds: null,
          SlotIds: null,
          LocationIds: null
      };
      */
        
      profile.Type = "Client";
      profile.Password = "1234";
      //console.log(profile);

        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/access/registration`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(profile)
          })
            .then(response => {
              if (response.status == 409) {
                console.log("account has already been registered")
                getUserData(profile.Email);
              } else if (response.status == 200){
                console.log("account successfully registered")
                getUserData(profile.Email);
              } else {
                window.alert("something went wrong");
              }
            })

            
        //registration fetch
            //409: already exists
            //200: successful
            //anything else: other problem
        //fetch client by email
            //setClient(result)
    }

    function getUserData(email){
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/email/${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(info => {
            setClient(info);
        });
    }


return (
    <div>
        {(client && !edit) && <div>
            <p>Name: {client.name}</p>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
            <button onClick={() => setEdit(!edit)}>Change</button>
            </div>}
    {(!client || edit) && <div>
        <RegisterNewClient addClient={registerProfile} registeredBy={user}/>
        {edit && <button onClick={() => setEdit(false)}>Cancel</button>}
        </div>}
    </div>
    )
}

function RegisterNewClient({addClient, registeredBy}){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const [country, setCountry] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [addressRest, setAddressRest] = useState("");


    const handleSubmitNewClient = () => {
        const password = "1234";
        const passwordConfirm = "1234";
        if(!validateUserData(firstName, lastName, birthDate, email, password, passwordConfirm, phone, country, zip, city, street, addressRest)){
            return;
        }

        const userDto = {
          Id: 0,
          Name: firstName + " " + lastName,
          Type: "Client",
          Email: email,
          Phone: phone,
          DateOfBirth: birthDate,
          Address: {
              Country: country,
              Zip: zip,
              City: city,
              Street: street,
              Rest: addressRest
          },
          Password: password,
          RegisteredBy: registeredBy.id,
          SessionIds: [],
          PsychologistIds: [],
          ClientIds: null,
          SlotIds: null,
          LocationIds: null
      };
      addClient(userDto);
    }

    return(
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridFirstName">
              <Form.Label>First Name: </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter user name!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridLastName">
              <Form.Label>Last Name: </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter user name!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Phone number: </Form.Label>
              <Form.Control
                type="text"
                name="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type="text"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridBirthDate">
              <Form.Label>Date of Birth: </Form.Label>
              <Form.Control
                type="date"
                name="BirthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Enter email address!"
              />
            </Form.Group>
          </Row>
          <p>Address</p>
    
          <Row>
          <Form.Group as={Col} controlId="formGridCountry">
              <Form.Label>Country: </Form.Label>
              <Form.Control
                type="text"
                name="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>ZIP or Postal Code: </Form.Label>
              <Form.Control
                type="text"
                name="Zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter your ZIP or Postal Code!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City: </Form.Label>
              <Form.Control
                type="text"
                name="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city!"
              />
            </Form.Group>
    
            <Form.Group as={Col} controlId="formGridStreet">
              <Form.Label>Street: </Form.Label>
              <Form.Control
                type="text"
                name="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter your Street!"
              />
            </Form.Group>
    
    
            <Form.Group as={Col} controlId="formGridAddressRest">
              <Form.Label>Rest of Address: </Form.Label>
              <Form.Control
                type="text"
                name="AddressRest"
                value={addressRest}
                onChange={(e) => setAddressRest(e.target.value)}
                placeholder="Enter the rest of your address!"
              />
            </Form.Group>
          </Row>
          
    
          <Button variant="primary" type="submit" onClick={(e) => {
            e.preventDefault();
            handleSubmitNewClient();
    }
        }>
            Add Client
          </Button>
        </Form>
    )
}