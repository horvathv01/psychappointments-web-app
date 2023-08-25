import React, {useState, useEffect, useContext} from "react";
import { Button, Col, Form, Row} from 'react-bootstrap';
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { EditProfile } from "./ProfilePage";

export default function Registration(){
    const {user, retreiveUser} = useContext(UserContext);
    const [registeredBy, setRegisteredBy] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [country, setCountry] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [addressRest, setAddressRest] = useState("");

    const [userType, setUserType] = useState("client");

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser != null){
            if(retreivedUser.type == "client"){
                navigate("/unauthorized");
            } else {
                setRegisteredBy(retreivedUser);
            }
        }
    }, [user]);

    

    function register(userDto){
        
      
        //   fetch(`${ServerUrlAndPort().host}://${ServerUrlAndPort().url}:${ServerUrlAndPort().port}/access/register`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     credentials: 'include',
        //     body: JSON.stringify(userDto)
        //   })
        //     .then(response => {
        //       if (response.ok) {
        //         window.alert("Registration successful! Please log in!");
        //         navigate('/login');
        //       } else {
        //         window.alert("Something went wrong!");
        //       }
        //     })
        //     .catch(error => {
        //       console.log(error.message);
        //     });
        }


    return(<div>
        <h1>Register to PsychAppointments!</h1>
        <EditProfile user={user} saveProfile={register} loggedIn={user} registeredBy={registeredBy} newRegistration={true}/>
    </div>);
};


export function validatePassword(pw1, pw2){
    /*if(!checkPasswordMatch(pw1, pw2)) return false;
    if(pw1.length < 6) return false;
    if(!/[A-Z]/.test(pw1)) return false;
    if(!/[a-z]/.test(pw1)) return false;
    if(!/\d/.test(pw1)) return false;
    if(!/[!@+#$%^&*]/.test(pw1)) return false;*/
    return true;
}

export function checkPasswordMatch(pw1, pw2){
    if(pw1 !== pw2){
        return false;
    }
    return true;
}

export function validatePhone(phoneNum){
    //cannot be empty --> return false
    if(phoneNum === ""){
        return false;
    }
    //should contain numbers + a few allowed characters only: "+", "/", "-"
    const allowedChars = "+/-0123456789";
    for(let i = 0; i < phoneNum.length; i++){
        const char = phoneNum.charAt(i);
        if(!allowedChars.includes(char)){
            return false;
        }
    }
    const lastChar = phoneNum.charAt(phoneNum.length - 1);
    if (!/\d/.test(lastChar)) {
      return false;
    }
    //should have min. length of 7, max length of 16? (I don't really know)
    if(phoneNum.length < 7 || phoneNum.length > 16){
        return false;
    }
    //valid:
    return true;
}

export function validateEmail(emailAddress){
    //cannot be empty --> return false
    if(!emailAddress || emailAddress === "") return false;
    //search for @ --> should have only one
    const atIndex = emailAddress.indexOf("@");
    if(atIndex === -1 || emailAddress.indexOf("@", atIndex + 1) !== -1) return false;
    //should have at least one dot around end
    if(emailAddress.lastIndexOf(".") < atIndex + 2) return false;
    //should have stuff before @
    //should have stuff after @
    if(atIndex === 0 || atIndex === emailAddress.length - 1) return false;
    //cannot have dot before/after @
    if(emailAddress[atIndex - 1] === "." || emailAddress[atIndex + 1] === ".") return false;
    return true;
    //if all above are true: setEmail(email); return true;
    //else: setEmail(null);, window.alert("Invalid e-mail address!"); return false;
}

export function validateAddress(country, zip, city, street, addressRest){
    for(let i = 0; i < arguments.length; i++){
        if(!arguments[i] || arguments[i] === "") return false;
    }
    return true;
}

export function validateUserName(firstName, lastName) {
    function validate(input){
    if(input == "" || input == undefined || input == null){
      return false;
    }
      const alphabetAndNumbers = "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz0123456789 ";
      for(let i = 0; i < input.length; i++){
        if(!alphabetAndNumbers.includes(input[i].toLowerCase())){
          window.alert("Invalid username! A user name can only include letters and numbers (no space or special characters).");              
          return false;
        }
      }
      return true;
    }
      return (validate(firstName) && validate(lastName));
    }

export function validateBirthDate(birthDate){
    if(birthDate == "" || birthDate == undefined || birthDate == null){
        return false;
      }
    return true;
}