import CalendarV02 from "./CalendarV02";
import React, {useState, useEffect} from "react";
import NavBar from "./NavBar";

export default function MainPage(){

    return(
        <div>
            <div>
                <NavBar />
            </div>
            <CalendarV02 />
        </div>
    );

}