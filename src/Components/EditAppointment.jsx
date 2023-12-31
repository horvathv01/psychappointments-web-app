import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { GetLocations, GeneratePsychologistDataField, GetTimeSlots, GenerateClientDataFields } from "./AddAppointment";
import { ChooseDate } from "./AddAppointment";
import ServerURLAndPort from "../ServerURLAndPort";


export default function EditAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [client, setClient] = useState(null); //--> registered client for appointment
    const [psychologist, setPsychologist] = useState(null); //--> registered psych. for appointment
    const [partnerPsychologist, setPartnerPsychologist] = useState(null);
    const [location, setLocation] = useState(null); //--> registered location for appointment
    const [date, setDate] = useState(null); //--> regsitered date for appointment
    const [sessionStart, setSessionStart] = useState(null); //--> registered session start for appointment
    const [sessionEnd, setSessionEnd] = useState(null); //--> registered session end for appointment
    const [description, setDescription] = useState(""); //--> registered session description for appointment
    const [frequency, setFrequency] = useState("Weekly"); //--> registered frequency for appointment
    const [price, setPrice] = useState(12000);
    const [appointment, setAppointment] = useState(null);
    const [submitButtonText, setSubmitButtonText] = useState("Save");
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "Client"){
            setClient(retreivedUser);
        }


        const sessionID = sessionStorage.getItem('sessionId');
        
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/${sessionID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(info => {
            if(retreivedUser.type == "Client" && info.clientId != null && info.clientId != retreivedUser.id){
                window.alert("You are unauthorized to view this page.");
                navigate("/");
            }
            setAppointment(info);
        });
    }, [user]);

    useEffect(() => {
        if(appointment && user){
            setDate(appointment.date)
            setSessionStart(appointment.start)
            setSessionEnd(appointment.end)
            setPrice(appointment.price);
            setFrequency(appointment.frequency)
            setDescription(appointment.description)

            //set psychologist
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${appointment.psychologistId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(info => setPsychologist(info));
            //set partnerPsychologist (if any)
            if(appointment.partnerPsychologistId){
                fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${appointment.partnerPsychologistId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(info => setPartnerPsychologist(info));
            }
            //set location
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/location/${appointment.locationId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(info => {
                setLocation(info)
            }
            );
            //set client (if session is not blank)
            if(!appointment.blank){
                fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${appointment.clientId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(info => setClient(info));
            }
            //ha a user kliens és az időpont foglalható: "Book Appointment"
            //ha a user.id == appointment.clientId: "Cancel Booking"
            if(user.type == "Client" && appointment.blank){
                setSubmitButtonText("Book Appointment");
            }

            //{user && user.type == "Client" && appointment && !appointment.blank && <button>Book Appointment</button>}
            

        }
    }, [appointment])

    function sendRequestToServer(sessionDTO){
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/${appointment.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(sessionDTO)
        })
        .then(response => response.text())
        .then(info => window.alert(info));

    }

    function handleSubmit(){
        const sessionDTO = {
            PsychologistId: psychologist.id,
            PartnerPsychologistId: partnerPsychologist == null ? null : partnerPsychologist.id,
            Blank: client == null ? true : false,
            LocationId: location.id,
            Date: date,
            Start: sessionStart,
            End: sessionEnd,
            ClientId: client == null ? null : client.id,
            Price: price,
            Frequency: frequency,
            SlotId: appointment.slotId,
            Description: description
        };

        sendRequestToServer(sessionDTO);
    };

    function deleteAppointment(){
        if(!user || user.type == "Client"){
            window.alert("You are not authorized to delete a session.")
            return;
        }
        if(!window.confirm("Are you sure you want to delete this session?")){
            return;
        }
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/${appointment.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.text())
        .then(info => {
            window.alert(info)
            navigate("/");
        });

    }

    function cancelBooking(){
        if(!window.confirm("Are you sure you want to cancel this booking?")){
            return;
        }
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/session/${appointment.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(info => {
            info.clientId = null;
            info.clientName = "";
            sendRequestToServer(info)
    });
    }


    return(
    <div>
            {user && (user.type == "Admin" || user.type == "Psychologist") && <button onClick={() => navigate("/appointments/add")}>Add New Appointment</button>}        
            <p>Psychologist:</p>
            {psychologist && <DisplayPersonDetails person={psychologist}/>}
            {partnerPsychologist ? <div>
                <p>Partner Psychologist:</p>
                <DisplayPersonDetails person={partnerPsychologist}/>
                <button onClick={() => setPartnerPsychologist(null)}>Remove</button>
                </div> : user && appointment && (user.type == "Admin" || (user.type == "Psychologist" && appointment.psychologistId == user.id)) &&
                <div>
                    <p>Add Partner (optional):</p>
                    <GeneratePsychologistDataField setPsychologist={setPartnerPsychologist} psychologist={partnerPsychologist} location={location} dontDisplay={psychologist} settingPartnerPsychologist={true}/>
                </div>}
            {location && <DisplayLocationDetails location={location}/>}
            {client && <p>Client Details:</p>}
            {user &&
            (user.type == "Admin" || user.type == "Psychologist") ? 
            <GenerateClientDataFields user={user} client={client} setClient={setClient}/> :
            client && <DisplayPersonDetails person={client}/>}
            {appointment && <p>Date: {appointment.date}</p>}
            {appointment && <p>Start: {appointment.start}</p>}
            {appointment && <p>End: {appointment.end}</p>}
            {appointment && user && (user.type == "Admin" || (user.type == "Psychologist" && appointment.psychologistId == user.id)) ?
            <input type="number" onChange={(e) => setPrice(e.target.value)} defaultValue={price}></input> :
            appointment && <p>Price: {appointment.price} HUF</p>}
            <button onClick={() => handleSubmit(false)}>{submitButtonText}</button>
            {user && appointment && !appointment.blank && user.type != "Manager" && <button onClick={cancelBooking}>Cancel Booking</button>}
            {user && (user.type == "Admin" || (user.type == "Psychologist" && appointment && appointment.psychologistId == user.id)) && 
            <button onClick={deleteAppointment}>Delete Appointment</button>}
    </div>
    );

    /*
    return(
        <div>
            <div>
                {user && (user.type == "Admin" || user.type == "Psychologist") && <button onClick={() => navigate("/appointments/add")}>Add New Appointment</button>}
                <form onSubmit={handleSubmit}>
                    {appointment && <p>Location: </p>}
                    {appointment && <ShowAndChangeData data={location} setData={setLocation} 
                    alternative={<GetLocations handleLocationChange={setLocation} />} />}
                    {appointment && <p>Psychologist: </p>}
                    {appointment && <ShowAndChangeData data={psychologist} setData={setPsychologist} 
                    alternative={<GeneratePsychologistDataField setPsychologist={setPsychologist} psychologist={psychologist} location={location} />}/>}
                    {appointment && <p>Client: </p>}
                    {appointment && client && <ShowAndChangeData data={client.name} setData={setClient} 
                    alternative={user && <GenerateClientDataFields user={user} client={client}/>}/>}
                    {appointment && <p>Select date:</p>}
                    {appointment && <ShowAndChangeData data={date} setData={setDate} alternative={<ChooseDate setDate={setDate}/>}/>}
                    {appointment && <p>Select time slot for session: </p>}
                    {appointment && <ShowAndChangeData data={slot} setData={setSlot} 
                    alternative={<GetTimeSlots psychologist={psychologist} handleChange={handleSlotChange}/>}/>}
                    {appointment && <p>Recurring session?</p>}
                    {appointment && <ShowAndChangeData data={frequency} setData={setFrequency} alternative={<select onChange={(e) => setFrequency(e.target.value)} defaultValue="weekly">
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="None">None (only one session)</option>
                    </select>}/>}
                    {appointment && <p>Please describe the problem briefly!</p>}
                    {appointment && <input type="textarea" onChange={(e) => setDescription(e.target.value)} defaultValue={description}></input>}
                    {appointment && <button onClick={deleteAppointment}>Delete Appointment</button>}
                    {appointment && <input type="submit" value="Submit"></input>}
                </form>
            </div>
        </div>
    )
    */
}

export function ShowAndChangeData({data, setData, alternative}){
    const [change, setChange] = useState(false);

    return(
        <div>
            {!change ? <div><p>{data}</p><button onClick={() => setChange(!change)}>Change</button></div> : alternative}
        </div>
    )
}

export function ClickCalendarEvent(calendarEvent){
    let choice;
    
    if(calendarEvent.client == ""){
        choice = window.confirm(
        `
            Psychologist: ${calendarEvent.psychologist} \n
            Partner Psychologist: ${calendarEvent.partnerPsychologist} \n
            Price: ${calendarEvent.price} \n
            Start: ${calendarEvent.start} \n
            End: ${calendarEvent.end}
            Would you like to book this session?
        `
        );
    } else {
        choice = window.confirm(
        `
            Psychologist: ${calendarEvent.psychologist} \n
            Partner Psychologist: ${calendarEvent.partnerPsychologist} \n
            ${calendarEvent.client != "" && `Client: ${calendarEvent.client} \n`}
            Price: ${calendarEvent.price} \n
            Start: ${calendarEvent.start} \n
            End: ${calendarEvent.end}
            Would you like to edit this session?
        `
        );
    }

    if(choice){
        sessionStorage.setItem("sessionId", calendarEvent.id);
        window.location.href = `/appointments/edit`;
    }

}

export function DisplayLocationDetails({location}){
    return(
    <div>
        <p>Location name: {location.name}</p>
        <p>Address: </p>
        <p>Country: {location.address.country}</p>
        <p>City: {location.address.city}</p>
        <p>ZIP: {location.address.zip}</p>
        <p>Street: {location.address.street}</p>
        <p>Rest of address: {location.address.rest}</p>
    </div>
    );
}

export function DisplayPersonDetails({person}){
    return(
    <div>
        <p>Name: {person.name}</p>
        <p>Email: {person.email}</p>
        <p>Phone: {person.phone}</p>
    </div>
    );
}