import React, {useState, useEffect, useContext} from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { validateAddress, validateEmail, validatePhone, checkPasswordMatch, validatePassword, validateUserName, validateBirthDate } from "./Registration";
import { ProfileDetails, EditProfile } from "./ProfilePage";
import ServerURLAndPort from "../ServerURLAndPort";

export default function AdminEditUser(){
    const {user, retreiveUser} = useContext(UserContext);
    const [allUsers, setAllUsers] = useState([]);
    const [editableUser, setEditableUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        } else if (retreivedUser.type != "Admin" && retreivedUser.type != "Manager"){
            navigate("/unauthorized");
        }
        //fetch all users, then setAllUsers(result)
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if(!response.ok){
                console.log("AllUsers fetch failed.");
                return [];
            }
            return response.json()})
        .then(info => {
            setAllUsers(info);
        })

        
          

    }, [user]);

    function saveProfile(userDto){
        const failMessage = `Update user id ${editableUser.id} fetch failed.`;
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${editableUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userDto)
        })
        .then(response => {
            if(!response.ok){
                return failMessage;
            }
            return response.text()})
        .then(info => {
            window.alert(info);
            if(info != failMessage){
                setEdit(false);
            }
            window.alert(info);
        });
        
    }

    function deleteProfile(){
        const failMessage = `Delete user id ${editableUser.id} fetch failed.`;
        const result = window.confirm("Are you sure you want to delete your profile?");
        if(result){
            fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${editableUser.id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => {
                if(!response.ok){
                    return failMessage;
                }
                return response.text()})
            .then(info => {
                window.alert(info);
                if(info != failMessage){
                    setEdit(false);
                }
                window.alert(info);
            });
        }
    };

    function chooseUserToEdit(id){
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/user/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => {
            if(!response.ok){
                console.log(`User id ${id} fetch failed.`);
                return [];
            }
            return response.json()})
        .then(info => {
            setEditableUser(info);
            //setEdit(true);
        });
    }

    function GenerateUsersList(){
        return(<div>
            <select defaultValue="" onChange={(e) => chooseUserToEdit(e.target.value)}>
            <option value="">Select user to edit</option>
            {allUsers.length > 0 && allUsers.map(u => <option key={u.id} value={u.id}>ID: {u.id} Name: {u.name}</option>)}
            </select>
        </div>);
    };



    return(<div>
        <h1>Edit Users</h1>
        {!edit && <GenerateUsersList />}
        {editableUser && !edit && <ProfileDetails incomingUser={editableUser}/>}
        {editableUser && edit && <EditProfile user={editableUser} saveProfile={saveProfile} loggedIn={user}/>}
        <br/>
        <br/>
        <br/>
        {!edit && editableUser && <button onClick={() => setEdit(!edit)}>Edit profile</button>}
        {edit && <button onClick={() => setEdit(false)}>Cancel</button>}
        {edit && <button onClick={() => deleteProfile()}>Delete Profile</button>}
    </div>);
}