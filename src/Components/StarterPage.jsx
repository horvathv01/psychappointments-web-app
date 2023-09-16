import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useState } from "react";

export default function StarterPage(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user == null){
            navigate("/login");
        } else if (user.type == "Admin"){
            console.log("admin navigated to: /locations");
            navigate("/locations");
        } else {
            console.log("navigated to: /calendar");
            navigate("/calendar");
        }        
    }, [user]);
    

    return null;
}