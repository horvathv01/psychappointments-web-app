import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function Unauthorized(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate("/"), 3000);
    }, [])

    return(
        <h1>401 - You are not authorized to visit this page.</h1>
    );
}