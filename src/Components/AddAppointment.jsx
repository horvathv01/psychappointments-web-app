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

    


    function handleSubmit(){
        //validate data --> same as registration validator!
        //what to include? 
        //psychologist.id + psychologist.name? --> to track changes of id in future
        //client's data --> send to backend, see if email already exists --> add appointment to existing client ELSE create new client with standard password
        //location id (+ location name?)
        //slot
        //session start, session end (date from date state)
        //frequency of session
        //session description
        //time of appointment addition + data of person who added it
        //fetch POST to add appointment

        //if session collides with future scheduled sessions but is fine this time, respond with warning
        //if session is scheduled for unfit time (collides with another one): respond with nope (hacker protection)
    }

    

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
                    <GetLocations setLocation={setLocation} />
                    <p>Psychologist: </p>
                    <GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location} />
                    <p>Client: </p>
                    {user && <GenerateClientDataFields user={user} client={client} setClient={setClient}/>}
                    <p>Select date:</p>
                    <ChooseDate setDate={setDate}/>
                    <p>Select time slot for session: </p>
                    <GetTimeSlots allSlots={allSlots} empty={true} setSlot={setSlot} handleChange={handleSlotChange}/>
                    <p>Recurring session?</p>
                    <select onChange={(e) => setFrequency(e.target.value)} defaultValue="Weekly">
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="None">None (only one session)</option>
                    </select>
                    <p>Please describe the problem briefly!</p>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} required></input>
                    <input type="submit" value="Submit"></input>
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

export function GeneratePsychologistDataField({psychologist, setPsychologist, location}){
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
            {!psychologist ? <GenerateListOfPsychologists allPsychologists={allPsychologists} setPsychologist={setPsychologist} /> :
            <div><p>{psychologist.name}</p><button onClick={() => setPsychologist(null)}>Change</button></div>
        }
        </div>
    );
};

export function GenerateListOfPsychologists({allPsychologists, setPsychologist}){

    function handlePsychologistChange(id){
        const selectedPsychologist = allPsychologists.filter(psy => psy.id == id)[0];
        setPsychologist(selectedPsychologist);
    }

    return(
        <select onChange={(e) => handlePsychologistChange(e.target.value)} defaultValue="">
                <option value="" disabled>Choose Psychologist</option>
                {allPsychologists.length > 0 && allPsychologists.map(p => <option key={"psychologist" + p.id} value={p.id}>{p.name}</option>)}
        </select>
    );
};

export function GetTimeSlots({allSlots, empty, handleChange, slot}){
        return(<div>
            <select onChange={(e) => handleChange(e.target.value)} value="">
                <option value="" disabled>Choose Slot</option>
                {empty && allSlots.filter(sl => sl.sessionIds.length == 0).map(sl => 
                <option key={"slot"+sl.id} value={sl.id}>{sl.slotStart} - {sl.slotEnd}</option>)}
                {!empty && allSlots.map(sl => <option key={"slot"+sl.id} value={sl.id}>{sl.slotStart} - {sl.slotEnd}</option>)}
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

/*
export function GenerateClientDataFields({user, client, setClient}) {
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
          user && user.type === "Client" && client ? client[fieldProps.label] : ""
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
*/