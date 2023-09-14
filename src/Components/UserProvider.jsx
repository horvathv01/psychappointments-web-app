import React, {useState, useEffect} from "react";
import { UserContext } from "../UserContext";

export const UserProvider = ({children}) => {
const [user, setUser] = useState(null);

const login = (userData) => {
    
    if(userData == undefined){
        return;
    }
    //console.log(`User logged in: ${JSON.stringify(userData)}`);
    //save user to session storage!
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
};

const logout = () => {
    console.log("LOGOUT");
    //clear session storage!
    sessionStorage.clear();
    setUser(null);
};

const retreiveUser = () => {
    if(user != null){
        console.log("User found in context");
        return user;
    }
    //if page reloads and context user is empty
    const storedUserString = sessionStorage.getItem("user");
    if (storedUserString != "undefined" && storedUserString != null) {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
        console.log("User successfully retreived from sessionStorage");
        return storedUser;
    } else {
        console.log("User could not be retreived from sessionStorage");
        //logout();
        return null;
    }
};

const updateUser = async (newUser) => {
    if(!newUser){
        console.log("User update not successful.")
        return;
    }

    await sessionStorage.clear();
    login(newUser);
    console.log("User update successful.")
};

return (
    <UserContext.Provider value={{user, login, logout, retreiveUser, updateUser}}>
        {children}
    </UserContext.Provider>
);

};