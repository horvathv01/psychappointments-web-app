import CalendarV02 from "./CalendarV02";
import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function MainPage(){
    const {retreiveUser} = useContext(UserContext);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(user == null){
            const retreivedUser = retreiveUser();
            if(retreivedUser != null){
                setUser(retreiveUser());
            }
        }
    }, []);
    

    return(
        <div>
            <div>
                <NavBar />
            </div>
            {user != null && user.type == "psychologist" ? <button onClick={() => navigate("/addappointment")}>Add Appointment</button> : null}
            <CalendarV02 />
        </div>
    );

}