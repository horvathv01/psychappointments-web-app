import React, {useState, useEffect, useContext} from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { validateAddress, validateEmail, validatePhone, checkPasswordMatch, validatePassword, validateUserName, validateBirthDate } from "./Registration";

export default function ProfilePage({incomingUser}){
    const {user, retreiveUser, updateUser, logout} = useContext(UserContext);
    const [edit, setEdit] = useState(false);
    const [editableUser, setEditableUser] = useState(null);    

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } if(incomingUser == undefined){
          setEditableUser(retreivedUser);
        } else {
          setEditableUser(incomingUser);
        }
    }, [user]);

    function saveProfile(userDto){
        updateUser(userDto);
        setUpdatedUser(userDto);
        setEdit(false);
    }

    function deleteProfile(){
        const result = window.confirm("Are you sure you want to delete your profile?");
        if(result){
            window.alert("Profile will be deleted.");
        }
        logout();
        navigate("/loginfirst");
    }

    return(<div>
        <h1>Profile Page</h1>
        {!edit && <button onClick={() => setEdit(!edit)}>Edit own profile</button>}
        {editableUser && editableUser.type != "Client" && <button onClick={() => navigate("/slots/add")}>Add Slots</button>}
        {editableUser && editableUser.type != "Client" && <button onClick={() => navigate("/slots/edit")}>Edit Slots</button>}
        <button onClick={() => navigate("/appointments/add")}>Add Appointments</button>
        <button onClick={() => navigate("/appointments")}>My Appointments</button>
        <button onClick={() => navigate("/profile/myclients")}>My Clients</button>
        <button onClick={() => navigate("/registration")}>Register User</button>
        <p>Profile details</p>
        {editableUser && !edit && <ProfileDetails user={editableUser}/>}
        {useditableUserer && edit && <EditProfile user={editableUser} saveProfile={saveProfile} loggedIn={editableUser}/>}
        <br/>
        {edit && <button onClick={() => setEdit(false)}>Cancel</button>}
        {edit && <button onClick={() => deleteProfile()}>Delete Profile</button>}
    </div>);
};

export function ProfileDetails({incomingUser}){
    return(incomingUser && <div>
        {<div><p>Type: </p><p>{incomingUser.type}</p></div>}
        {<div><p>ID: </p><p>{incomingUser.id}</p></div>}
        {<div><p>Name: </p><p>{incomingUser.name}</p></div>}
        {<div><p>Email: </p><p>{incomingUser.email}</p></div>}
        {<div><p>Phone: </p><p>{incomingUser.phone}</p></div>}
        {<div><p>Birth date: </p><p>{incomingUser.dateOfBirth}</p></div>}
        <p>Address: </p>
        {<div><p>Country: </p><p>{incomingUser.address.country}</p></div>}
        {<div><p>ZIP or Postal Code: </p><p>{incomingUser.address.zip}</p></div>}
        {<div><p>City: </p><p>{incomingUser.address.city}</p></div>}
        {<div><p>Street: </p><p>{incomingUser.address.street}</p></div>}
        {<div><p>Rest of Address: </p><p>{incomingUser.address.rest}</p></div>}
    </div>);
}

export function EditProfile({user, saveProfile, loggedIn, registeredByUser, newRegistration}){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState(!newRegistration ? user.phone : "");
    const [email, setEmail] = useState(!newRegistration ? user.email : "");
    const [birthDate, setBirthDate] = useState(!newRegistration ? user.dateOfBirth : "");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [country, setCountry] = useState(!newRegistration ? user.address.country : "");
    const [zip, setZip] = useState(!newRegistration ? user.address.zip : "");
    const [city, setCity] = useState(!newRegistration ? user.address.city : "");
    const [street, setStreet] = useState(!newRegistration ? user.address.street : "");
    const [addressRest, setAddressRest] = useState(!newRegistration ? user.address.rest : "");

    const [registeredBy, setRegisteredBy] = useState(registeredByUser);
    const [userType, setUserType] = useState(!newRegistration ? user.type : "Client");


    useEffect(() => {
    if(!newRegistration){
        const userName = user.name.split(" ");
        setFirstName(userName[0]);
        userName.shift();
        setLastName(userName.join());
    }
    
    }, []);

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

    function handleChange(e){
      e.preventDefault();
        if(!validateUserInput()){
            return;
        }

        const userDto = {
          Id: 0,
          Name: firstName + " " + lastName,
          Type: userType,
          Email: email,
          Phone: phone,
          DateOfBirth: birthDate,
          Address: {
              Country: country,
              Zip: zip,
              City: city,
              Street: street,
              Rest: addressRest
          },
          Password: password,
          RegisteredBy: registeredBy,
          SessionIds: [],
          PsychologistIds: [],
          ClientIds: null,
          SlotIds: null,
          LocationIds: null
      };
          saveProfile(userDto);
    }

    function SelectUserType(){
        return(
            <div>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>Select User Type
                <option value="Client">Client</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Manager">Manager</option>
                {loggedIn && loggedIn.type == "Admin" && <option value="Admin">Admin</option>}
                </select>
            </div>
        )
    }


    return( 
    <div>
    {loggedIn && (loggedIn.type == "Admin" || loggedIn.type == "Manager") && <SelectUserType />}
    <div>
    <Form onSubmit={(e) => {
        e.preventDefault();
         handleChange();
         }}>
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

      <Button onClick={(e) => handleChange(e)} variant="primary" type="submit">
        Save
      </Button>
    </Form>
  </div>

</div>);
}

export function validateUserData(firstName, lastName, birthDate, email, password, passwordConfirm, phone, country, zip, city, street, addressRest){
  if(!validateUserName(firstName, lastName)){
      window.alert("Username is required!");
      //setFirstName("");
      //setLastName("");
      return false;
  }
  if(!validateBirthDate(birthDate)){
      window.alert("Birth date cannot be empty!");
      //setBirthDate("");
      return false;
  }
  if(!validateEmail(email)){
      window.alert("Invalid e-mail address!");
      //setEmail("");
      return false;
  }
  if(!checkPasswordMatch(password, passwordConfirm)){
      window.alert("Passwords do not match!");
      //setPassword("");
      //setPasswordConfirm("");
      return false;
  }
  if(!validatePassword(password, passwordConfirm)){
      window.alert("A password has to be at least 6 characters long, and has to contain at least one of these: uppercase letters, lowercase letters, numbers, symbols (!@#$%^&*)!");
      //setPassword("");
      //setPasswordConfirm("");
      return false;
  }
  if(!validatePhone(phone)){
      window.alert("Invalid phone number!");
      //setPhone("");
      return false;
  }
  if(!validateAddress(country, zip, city, street, addressRest)){
      window.alert("Address is invalid!");
      return false;
  }
  return true;
}