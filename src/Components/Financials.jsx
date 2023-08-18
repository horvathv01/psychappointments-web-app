import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function Financials(){
    const {user, retreiveUser} = useContext(UserContext);
    const [finances, setFinances] = useState(null);
    const [incomeDetails, setIncomeDetails] = useState(false);
    const [billsDetails, setBillsDetails] = useState(false);
    const [location, setLocation] = useState(null);
    const [psychologist, setPsychologist] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        }
    }, [user]);



    async function gatherFinancialData(){
        if(user == null){
            return null;
        }

        let financialData;
        let totalIncome;
        let totalBills

        switch (user.type) {
            case "admin":
                let allLocations //= await fetch().then(data= > data.json());
                let allPsychologists //= await fetch().then(data => data.json());
                //fetch all location names
                //fetch all psychologist names
                if(location == null || psychologist == null){
                    return(
                    <div>
                    <select onChange={(e) => setLocation(e.target.value)} defaultValue="">
                    <option value="" disabled>Choose Location</option>
                    {allLocations.map(l => <option value={l}>{l.name}</option>)}
                    </select>
                    <select onChange={(e) => setPsychologist(e.target.value)} defaultValue="">
                    <option value="" disabled>Choose Psychologist</option>
                    {allPsychologists.map(p => <option value={p}>{p.name}</option>)}
                    </select>
                </div>
                    )
                } else if (location != null){
                //fetch /financials/location + location.id --> returns financialData for associated locations
                //financialData.income = {[{location: "locationName", total: 100000, sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price, psychologistIncome}}]}
                totalIncome = financialData.income.reduce((sum, loc) => sum + loc.total, 0);
                return(
                    <div>
                        <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                        {incomeDetails && financialData.income.map(loc => {
                            return(
                                <div>
                                <p>Location name: {loc.location}, Total income at location: {loc.total}</p>
                                <p>Sessions:</p>
                                {loc.sessions && loc.sessions.map(ses => {
                                    return(
                                        <div>
                                            <p>Session Start: {ses.sessionStart}</p>
                                            <p>Session End: {ses.sessionEnd}</p>
                                            <p>Room number: {ses.roomNumber}</p>
                                            <p>Psychologist: {ses.psychologist}</p>
                                            <p>Session price: {ses.price}</p>
                                            <p>Psychologist's price: {ses.psychologistIncome}</p>
                                        </div>
                                    )
                                })}
                                </div>
                            )
                        })}
                    </div>
                );
                } else {
                //fetch /financials/user + psychologist.id --> returns financialData with income and bills
                //financialData.income = {[{location: "locationName", total: 100000]}, [...]}
                //financialData.bills = {[{location: "locationName", total: 10000}]}, [...]}
                totalIncome = financialData.income.reduce((sum, loc) => sum + loc.total, 0);
                totalBills = financialData.bills.reduce((sum, loc) => sum + loc.total, 0);
                return(
                    <div>
                        <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                        {incomeDetails && financialData.income.map(loc => {
                            return(
                                <p>Location: {loc.location} Income: {loc.total}</p>
                            )
                        })}
                        <p>Total bills: {totalBills}</p><button onClick={() => setBillsDetails(!billsDetails)}>Details</button>
                        {billsDetails && financialData.bills.map(loc => {
                            return(
                                <p>Location: {loc.location} Room price: {loc.total}</p>
                            )
                        })}
                    </div>
                );
                }
            case "psychologist":
                //fetch /financials/user + user.id --> returns financialData with income and bills
                //financialData.income = {[{location: "locationName", total: 100000]}, [...]}
                //financialData.bills = {[{location: "locationName", total: 10000}]}, [...]}
                totalIncome = financialData.income.reduce((sum, loc) => sum + loc.total, 0);
                totalBills = financialData.bills.reduce((sum, loc) => sum + loc.total, 0);
                return(
                    <div>
                        <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                        {incomeDetails && financialData.income.map(loc => {
                            return(
                                <p>Location: {loc.location} Income: {loc.total}</p>
                            )
                        })}
                        <p>Total bills: {totalBills}</p><button onClick={() => setBillsDetails(!billsDetails)}>Details</button>
                        {billsDetails && financialData.bills.map(loc => {
                            return(
                                <p>Location: {loc.location} Room price: {loc.total}</p>
                            )
                        })}
                    </div>
                );
            case "manager":
                //fetch /financials/location + user.id --> returns financialData for associated locations
                //financialData.income = {[{location: "locationName", total: 100000, sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price, psychologistIncome}}]}
                totalIncome = financialData.income.reduce((sum, loc) => sum + loc.total, 0);
                return(
                    <div>
                        <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                        {incomeDetails && financialData.income.map(loc => {
                            return(
                                <div>
                                <p>Location name: {loc.location}, Total income at location: {loc.total}</p>
                                <p>Sessions:</p>
                                {loc.sessions && loc.sessions.map(ses => {
                                    return(
                                        <div>
                                            <p>Session Start: {ses.sessionStart}</p>
                                            <p>Session End: {ses.sessionEnd}</p>
                                            <p>Room number: {ses.roomNumber}</p>
                                            <p>Psychologist: {ses.psychologist}</p>
                                            <p>Session price: {ses.price}</p>
                                            <p>Psychologist's price: {ses.psychologistIncome}</p>
                                        </div>
                                    )
                                })}
                                </div>
                            )
                        })}
                    </div>
                );
            case "client":
                //fetch financials/user + user.id --> returns financialData with person's sessions
                //financialData.bills = {[{location: "locationName", sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price}}]}
                totalBills = financialData.bills.reduce((sum, loc) => sum + loc.sessions.price, 0);
                return(<div>
                    <p>To be paid: {totalBills}</p><button onClick={() => setBillsDetails(!billsDetails)}>Details</button>
                    {billsDetails && financialData.map(loc => {
                        return(
                            <div>
                            <p>Location name: {loc.location}</p>
                            <p>Sessions:</p>
                            {loc.sessions && loc.sessions.map(ses => {
                                return(
                                    <div>
                                        <p>Session Start: {ses.sessionStart}</p>
                                        <p>Session End: {ses.sessionEnd}</p>
                                        <p>Room number: {ses.roomNumber}</p>
                                        <p>Psychologist: {ses.psychologist}</p>
                                        <p>Session price: {ses.price}</p>
                                    </div>
                                )
                            })}
                            </div>
                        )
                    })}
                </div>);        
            default:
                break;
        }
    }

    return(
    <div>
        {finances}
    </div>
    );
}