import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function EditAppointment(){
    const {user, retreiveUser} = useContext(UserContext);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type == "client"){
            navigate("/unauthorized");
        }
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);
        const id = searchParams.get("id");
        
        console.log(id);

        //is it null/undefined? --> navigate("/appointments")
        //fetch appointment information
        //is user not associated with appointment && type != "admin"? --> navigate("/appointments")
        //setAppointment(result)
        
    }, [user]);

    return(
        <div>
            
        </div>
    )
}