import React, {useState, useEffect, useContext} from "react";
import { Button, Col, Form, Row} from 'react-bootstrap';
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

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

    


    function validateUserInput(){
        if(!validateUserName(firstName, lastName)){
            window.alert("Username is required!");
            setFirstName("");
            setLastName("");
            return false;
        }
        if(!validateBirthDate(birthDate)){
            window.alert("Birth date cannot be empty!");
            setBirthDate("");
            return false;
        }
        if(!validateEmail(email)){
            window.alert("Invalid e-mail address!");
            setEmail("");
            return false;
        }
        if(!checkPasswordMatch(password, passwordConfirm)){
            window.alert("Passwords do not match!");
            setPassword("");
            setPasswordConfirm("");
            return false;
        }
        if(!validatePassword(password, passwordConfirm)){
            window.alert("A password has to be at least 6 characters long, and has to contain at least one of these: uppercase letters, lowercase letters, numbers, symbols (!@#$%^&*)!");
            setPassword("");
            setPasswordConfirm("");
            return false;
        }
        if(!validatePhone(phone)){
            window.alert("Invalid phone number!");
            setPhone("");
            return false;
        }
        if(!validateAddress(country, zip, city, street, addressRest)){
            window.alert("Address is invalid!");
            return false;
        }
        return true;
    }

    function register(){
        if(!validateUserInput()){
            return;
        }
        const userName = firstName + " " + lastName;
        const address = {
            country: country,
            zip: zip,
            city: city,
            street: street,
            rest: addressRest
        }

        const userDto = {
            name: userName,
            email: email,
            password: password,
            phone: phone,
            type: userType,
            dateOfBirth: birthDate,
            address: address,
            registeredBy: registeredBy,
            type: userType
          };
          console.log(userDto);
      
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


    function SelectUserType(){
        return(
            <div>
                <select defaultValue="client" onChange={(e) => setUserType(e.target.value)}>Select User Type
                <option value="client">Client</option>
                <option value="psychologist">Psychologist</option>
                <option value="manager">Manager</option>
                {user && user.type == "admin" && <option value="admin">Admin</option>}
                </select>
            </div>
        )
    }


    return(<div>
        <h1>Register to PsychAppointments!</h1>
        {user && (user.type == "admin" || user.type == "manager") && <SelectUserType />}
        <div>
        <Form onSubmit={(e) => {
            e.preventDefault();
             register();
             }}>
                <p>Personal Details</p>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridFirstName">
              <Form.Label>First Name: </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter user name!"
              />
            </Form.Group>
  
            <Form.Group as={Col} controlId="formGridLastName">
              <Form.Label>Last Name: </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter user name!"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Phone number: </Form.Label>
              <Form.Control
                type="text"
                name="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number!"
              />
            </Form.Group>
  
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type="text"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address!"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridBirthDate">
              <Form.Label>Date of Birth: </Form.Label>
              <Form.Control
                type="date"
                name="BirthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Enter email address!"
              />
            </Form.Group>
          </Row>
          <p>Address</p>

          <Row>
          <Form.Group as={Col} controlId="formGridCountry">
              <Form.Label>Country: </Form.Label>
              <Form.Control
                type="text"
                name="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter your country!"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>ZIP or Postal Code: </Form.Label>
              <Form.Control
                type="text"
                name="Zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter your ZIP or Postal Code!"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City: </Form.Label>
              <Form.Control
                type="text"
                name="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city!"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridStreet">
              <Form.Label>Street: </Form.Label>
              <Form.Control
                type="text"
                name="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter your Street!"
              />
            </Form.Group>


            <Form.Group as={Col} controlId="formGridAddressRest">
              <Form.Label>Rest of Address: </Form.Label>
              <Form.Control
                type="text"
                name="AddressRest"
                value={addressRest}
                onChange={(e) => setAddressRest(e.target.value)}
                placeholder="Enter the rest of your address!"
              />
            </Form.Group>
          </Row>

             <p>Password</p>
  
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password: </Form.Label>
              <Form.Control
                type="password"
                name="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="User password"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPasswordConfirm">
              <Form.Label>Confirm password: </Form.Label>
              <Form.Control
                type="password"
                name="PasswordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm user password"
              />
            </Form.Group>
          </Row>
  
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>

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