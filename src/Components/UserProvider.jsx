import React, {useState} from "react";
import { UserContext } from "../UserContext";

export const UserProvider = ({children}) => {
const [user, setUser] = useState(null);
const login = (userData) => {
    console.log(`User logged in: ${JSON.stringify(userData)}`);
    //save user to session storage!
    setUser(userData);
};

const logout = () => {
    //clear session storage!
    setUser(null);
};

const readSessionStorage = () => {
    //if page reloads and context user is empty
    return;
};

return (
    <UserContext.Provider value={{user, login, logout, readSessionStorage}}>
        {children}
    </UserContext.Provider>
);

};