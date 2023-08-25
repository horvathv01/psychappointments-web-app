import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function ManagerPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "manager" && retreivedUser.type != "admin"){
            navigate("/unauthorized");
        }
    }, [user]);

    return(
        <div>
            <button onClick={() => navigate("/registration")}>Register User</button>
            <button onClick={() => navigate("/appointments/add")}>Add Appointment</button>
            <button onClick={() => navigate("/appointments/edit")}>Edit Appointments</button>
            <button onClick={() => navigate("/rooms/add")}>Add New Room</button>
            <button onClick={() => navigate("/rooms/edit")}>Edit Rooms</button>
            <button onClick={() => navigate("/rooms/delete")}>Delete Room</button>
        </div>
    )
}