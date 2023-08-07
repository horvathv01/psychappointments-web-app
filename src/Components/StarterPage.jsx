import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function StarterPage(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        navigateToPage();
    }, [])

    function navigateToPage(){
        if(retreiveUser() == null){
            console.log("navigated to: /login");
            navigate("/login");
        } else {
            console.log("navigated to: /calendar");
            navigate("/calendar");
        }
    };

    return;
}