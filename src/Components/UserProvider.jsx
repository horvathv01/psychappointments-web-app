import React, {useState} from "react";
import { UserContext } from "../UserContext";

export const UserProvider = ({children}) => {
const [user, setUser] = useState(null);
const login = (userData) => {
    console.log(`User logged in: ${JSON.stringify(userData)}`);
    //save user to session storage!
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
};

const logout = () => {
    //clear session storage!
    sessionStorage.clear();
    setUser(null);
};

const retreiveUser = () => {
    if(user != null){
        return user;
    }
    //if page reloads and context user is empty
    const storedUserString = sessionStorage.getItem("user");
    if(storedUserString != null){
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
        console.log("User successfully retreived from sessionStorage");
    } else {
        console.log("User could not be retreived from sessionStorage");
        return null;
    }
};

return (
    <UserContext.Provider value={{user, login, logout, retreiveUser}}>
        {children}
    </UserContext.Provider>
);

};