import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function StarterPage(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();


    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            console.log("navigated to: /login");
            navigate("/login");
        } else if (retreivedUser.type == "admin"){
            console.log("admin navigated to: /locations");
            navigate("/locations");
        } else {
            console.log("navigated to: /calendar");
            navigate("/calendar");
        }
    }, [user]);

    return;
}