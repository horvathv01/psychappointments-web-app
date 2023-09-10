import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useState } from "react";

export default function StarterPage(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(user == null){
            console.log("starterpage user == null reading lefutott")
            navigate("/loginfirst");
        } else if (user.type == "Admin"){
            console.log("admin navigated to: /locations");
            navigate("/locations");
        } else {
            console.log("navigated to: /calendar");
            navigate("/calendar");
        }        
    }, [user]);
    
if(isLoading){
    return <p>Loading...</p>
}

    return null;
}