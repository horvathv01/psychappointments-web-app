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
        } else if (retreivedUser.type != "Manager" && retreivedUser.type != "Admin"){
            navigate("/unauthorized");
        }
    }, [user]);

    return(
        <div>
            <button onClick={() => navigate("/registration")}>Register User</button>
            <button onClick={() => navigate("/edituser")}>Edit User</button>
            <button onClick={() => navigate("/slots/add")}>Add Slots</button>
            <button onClick={() => navigate("/slots/edit")}>Edit Slots</button>
            <button onClick={() => navigate("/appointments/add")}>Add Appointment</button>
            <button onClick={() => navigate("/appointments/edit")}>Edit Appointments</button>
            <button onClick={() => navigate("/locations/add")}>Add New Location</button>
            <button onClick={() => navigate("/locations/edit")}>Edit Locations</button>
        </div>
    )
}