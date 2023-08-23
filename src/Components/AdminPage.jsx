import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function AdminPage(){
    const {user, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null || retreivedUser.type != "admin"){
            navigate("/loginfirst");
        }
    }, [user]);

    return(
        <div>
            <button onClick={() => navigate("/admin/registration")}>Register User</button>
            <button onClick={() => navigate("/admin/delete")}>Delete User</button>
        </div>
    )
}