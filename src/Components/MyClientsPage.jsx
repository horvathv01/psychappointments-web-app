import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function MyClientsPage(){    
    const {user, retreiveUser} = useContext(UserContext);
    const [allClients, setAllClients] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "psychologist"){
            navigate("/unauthorized");
        }
        //fetch all clients, sessions included
        let sessions = [];
        for(let i = 0; i < 7; i++){
            const start = new Date();
            let end = new Date(start);
            end.setHours(start.getHours() + 1);
            const session = {
                id: i,
                psychologist: retreivedUser,
                location: "tibavár",
                start: start,
                end: end,
                client: null,
                price: i * 1000,
                frequency: "weekly"
            }
            sessions.push(session)
        }

        const client0 = {
            name: "Client0",
            type: "psychologist",
            id: 1,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }, sessions: [sessions[0], sessions[1]]
          }
    
          const client1 = {
            name: "Client1",
            type: "client",
            id: 2,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }, sessions: [sessions[2], sessions[3]]
          }
    
          const client2 = {
            name: "client2",
            type: "client",
            id: 3,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }, sessions: [sessions[4], sessions[5]]
          }
    
          const client3 = {
            name: "Client3",
            type: "admin",
            id: 4,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }, sessions: [sessions[6]]
          }

          const trialUsers = [client0, client1, client2, client3];
          setAllClients(trialUsers);

    }, [user]);
    
    return(<div>    
        <h1>My Clients</h1>
        {allClients && allClients.map(client => <ClientDetails key={"client" + client.id} client={client}/>)}
    </div>);

}

function ClientDetails({client}){
    const [details, setDetails] = useState(false);
    //console.log(client);

    return(
<div>
                <p>Name: {client.name}, Phone: {client.phone}, Email: {client.email}</p>
                <button onClick={() => setDetails(!details)}>Details</button>
                {details && <div>
                    <p>Date of Birth: {client.dateOfBirth}</p>
                    <p>Address: {client.address.country}, {client.address.zip}, {client.address.city}, {client.address.city}, {client.address.street}, {client.address.rest}</p>
                    {client.sessions.map(ses => 
                        <p key={"session" + ses.id}>
                        ID: {ses.id},
                        Location: {ses.location},
                        Start: {ses.start.toString()},
                        End: {ses.end.toString()},
                        Price: {ses.price},
                        Frequency: {ses.frequency}
                    </p>)}
                    </div>}
            </div>
    )
}