import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function AdminPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "admin"){
            navigate("/unauthorized");
        }
    }, [user]);

    return(
        <div>
            <button onClick={() => navigate("/registration")}>Register User</button>
            <button onClick={() => navigate("/edituser")}>Edit User</button>
            <button onClick={() => navigate("/manager")}>Manager Page</button>
        </div>
    )
}