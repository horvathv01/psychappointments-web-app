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
    const [allLocations, setAllLocations] = useState(null);
    const [allPsychologists, setAllPsychologists] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const retreivedUser = retreiveUser();
        if(retreivedUser == null){
            navigate("/loginfirst");
        };

        //setFinances(gatherFinancialData());
    }, [user]);

    useEffect(() => {
        if(user != null){
        switch (user.type) {
            case "Admin":
                //fetch all location names
                //setAllLocations(locationFetchResult)
                //fetch all psychologist names
                //setAllPsychologists(psychologistFetchResult)
                break;
            case "Psychologist":
                //fetch /financials/user + user.id --> returns financialData with income and bills
                //financialData.income = {[{location: "locationName", total: 100000]}, [...]}
                //financialData.bills = {[{location: "locationName", total: 10000}]}, [...]}
                //setFinances(fetchResult);
                break;
            case "Manager":
                //fetch /financials/location + user.id --> returns financialData for associated locations
                //financialData.income = {[{location: "locationName", total: 100000, sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price, psychologistIncome}}]}
                //setFinances(fetchResult);
                break;
            case "Client":
                //fetch financials/user + user.id --> returns financialData with person's sessions
                //financialData.bills = {[{location: "locationName", sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price}}]}
                //setFinances(fetchResult);
                break;
            default:
                break;

        };
    }
    }, []);

    useEffect(() => {
        if(location != null){
            //fetch data of location
            //setFinances(fetchResult)
        } else if (psychologist != null){
            //fetch data of psychologist
            //setFinances(fetchResult)
        }

    }, [location, psychologist]);

    function GenerateLocationAndPsychologistSelector(){
            return(
            <div>
            <select onChange={(e) => setLocation(e.target.value)} defaultValue="">
            <option value="" disabled>Choose Location</option>
            {allLocations && allLocations.map(l => <option value={l}>{l.name}</option>)}
            </select>
            <select onChange={(e) => setPsychologist(e.target.value)} defaultValue="">
            <option value="" disabled>Choose Psychologist</option>
            {allPsychologists && allPsychologists.map(p => <option value={p}>{p.name}</option>)}
            </select>
        </div>
            )
    }

    function GenerateAdmin(){
        if(location == null || psychologist == null){
            return <GenerateLocationAndPsychologistSelector />;
        } else if (location != null){
        //fetch /financials/location + location.id --> returns financialData for associated locations
        //finances.income = {[{location: "locationName", total: 100000, sessions: {sessionStart, sessionEnd, psychologist, roomNumber, price, psychologistIncome}}]}
        const totalIncome = finances && finances.income.reduce((sum, loc) => sum + loc.total, 0);
        return(
            <div>
                <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                {incomeDetails && finances && finances.income.map(loc => {
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
        return(generatePsychologist());
        }
    }

    function GeneratePsychologist(){
        const totalIncome = finances && finances.income.reduce((sum, loc) => sum + loc.total, 0);
        const totalBills = finances && finances.bills.reduce((sum, loc) => sum + loc.total, 0);
        return(
            <div>
                <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                {incomeDetails && finances && finances.income.map(loc => {
                    return(
                        <p>Location: {loc.location} Income: {loc.total}</p>
                    )
                })}
                <p>Total bills: {totalBills}</p><button onClick={() => setBillsDetails(!billsDetails)}>Details</button>
                {billsDetails && finances && finances.bills.map(loc => {
                    return(
                        <p>Location: {loc.location} Room price: {loc.total}</p>
                    )
                })}
            </div>
        );
    }

    function GenerateClient(){
        const totalBills = finances && finances.bills.reduce((sum, loc) => sum + loc.sessions.price, 0);
        return(<div>
            <p>To be paid: {totalBills}</p><button onClick={() => setBillsDetails(!billsDetails)}>Details</button>
            {billsDetails && finances && finances.map(loc => {
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
    }

    function GenerateManager(){
        if(location == null || psychologist == null){
            return <GenerateLocationAndPsychologistSelector />;
        } else {       

        const totalIncome = finances && finances.income.reduce((sum, loc) => sum + loc.total, 0);
        return(
            <div>
                <p>Total income: {totalIncome}</p><button onClick={() => setIncomeDetails(!incomeDetails)}>Details</button>
                {incomeDetails && finances && finances.income.map(loc => {
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
    }
}

    function GatherFinancialData(){
        if(user == null){
            return null;
        }
        switch (user.type) {
            case "Admin":
                return <GenerateAdmin />;
            case "Psychologist":
                return <GeneratePsychologist/>;
            case "Manager":
                return  <GenerateManager />;
            case "Client":
                return <GenerateClient />;
            default:
                break;
        }
    }


    return(    
    <div>
        <h1>Finances</h1>
        <GatherFinancialData />
    </div>
    );
}