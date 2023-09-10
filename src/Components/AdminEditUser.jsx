import React, {useState, useEffect, useContext} from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { validateAddress, validateEmail, validatePhone, checkPasswordMatch, validatePassword, validateUserName, validateBirthDate } from "./Registration";
import { ProfileDetails, EditProfile } from "./ProfilePage";

export default function AdminEditUser(){
    const {user, retreiveUser} = useContext(UserContext);
    const [allUsers, setAllUsers] = useState([]);
    const [editableUser, setEditableUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [updatedUser, setUpdatedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "Admin" && retreivedUser.type != "Manager"){
            navigate("/unauthorized");
        }
        //fetch all users, then setAllUsers(result)
        const psych1 = {
            name: "Psychologist1",
            type: "Psychologist",
            id: 1,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }
          }
    
          const client1 = {
            name: "Client1",
            type: "Client",
            id: 2,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }
          }
    
          const manager1 = {
            name: "Manager1",
            type: "Manager",
            id: 3,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }
          }
    
          const admin1 = {
            name: "Admin1",
            type: "Admin",
            id: 4,
            email: "csirke@pulyka.ru",
            phone: "+361/123-4567",
            dateOfBirth: "1994-07-24",
            address: {
              country: "Hungary",
              zip: "1196",
              city: "Budapest",
              street: "Petőfi utca",
              rest: "134/b"
          }
          }

          const trialUsers = [psych1, client1, manager1, admin1];
          setAllUsers(trialUsers);

    }, [user]);

    useEffect(() => {
        //user has been updated in updatedUser
        //POST fetch with new profile details to server
    }, [updatedUser])

    function saveProfile(userDto){
        setEditableUser(userDto);
        setUpdatedUser(userDto);
        setEdit(false);
    }

    function deleteProfile(){
        const result = window.confirm("Are you sure you want to delete your profile?");
        if(result){
            window.alert("Profile will be deleted.");
        }
    };

    function chooseUserToEdit(id){
        setEditableUser(allUsers.filter(u => u.id == id)[0]);
        //setEdit(true);
    }

    function GenerateUsersList(){
        return(<div>
            <select defaultValue="" onChange={(e) => chooseUserToEdit(e.target.value)}>
            <option value="">Select user to edit</option>
            {allUsers.map(u => <option key={u.id} value={u.id}>ID: {u.id} Name: {u.name}</option>)}
            </select>
        </div>);
    };



    return(<div>
        <h1>Edit Users</h1>
        <GenerateUsersList />
        {editableUser && !edit && <ProfileDetails user={editableUser}/>}
        {editableUser && edit && <EditProfile user={editableUser} saveProfile={saveProfile} loggedIn={user}/>}
        <br/>
        <br/>
        <br/>
        {!edit && editableUser && <button onClick={() => setEdit(!edit)}>Edit profile</button>}
        {edit && <button onClick={() => setEdit(false)}>Cancel</button>}
        {edit && <button onClick={() => deleteProfile()}>Delete Profile</button>}
    </div>);
}