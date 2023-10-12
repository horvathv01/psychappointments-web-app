import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServerURLAndPort from "../ServerURLAndPort";

export default function DateRangeSelector({start, end, setStart, setEnd}){
    
    return (
        <div>
            <input type="date" onChange={(e) => setStart(e.target.value)}></input>
            <input type="date" onChange={(e) => setEnd(e.target.value)}></input>
        </div>
    )
}