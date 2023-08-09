import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function LoginFirst(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate("/login"), 3000);
    }, [])

    return(
        <h1>Please log in!</h1>
    );
}