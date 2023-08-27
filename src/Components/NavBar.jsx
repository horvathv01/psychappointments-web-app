import React, {useState, useEffect, useContext} from "react";
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { UserProvider } from "./UserProvider";
import { UserContext } from "../UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import ServerUrlAndPort from '../ServerURLAndPort.js';

export default function NavBar(){

    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const [online, setOnline] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        retreiveUser();
    }, [user]);

    useEffect(() => {
      isOnline();
    }, [])


    const isOnline = () => {
      let fetchResult = false;  
      //fetch to see if server is online
      setOnline(fetchResult);
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
        <Navbar data-testid="header" bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">
              PsychAppointments
            </Navbar.Brand>
            <Navbar.Text>{user && user.username}</Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {user && user.name ? <p>Hello, {user.name}! User type: {user.type}</p> : null}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {user == null ? <Nav.Link href="/login">Log In</Nav.Link> : null}
                {user && user.type != "admin" && user.type != "manager" && <Nav.Link href="/calendar">My Events</Nav.Link>}
                {user && user.type != "client" && <Nav.Link href="/locations">Locations</Nav.Link>}
                <Nav.Link href="/financials">Financials</Nav.Link>
                {user && user.type === "admin" ? <Nav.Link href="/admin">Admin page</Nav.Link> : null}
                {user && user.type === "manager" ? <Nav.Link href="/manager">Management</Nav.Link> : null}
                <span className={`nav-link ${online ? 'text-success' : 'text-danger'}`}>
                  {online ? 'Online' : 'Offline'}
                </span>
                <select onChange={(e) => {
                  if(e.target.value == "logout"){
                    handleLogout();
                  } else {
                    navigate(e.target.value)}  
                  }
                  } value="">
                  <option disabled value="">Profile Menu</option>
                  <option value="/profile">My Profile</option>
                  <option value="/appointments">Appointments</option>
                  {user && user.type == "psychologist" && <option value="/profile/myclients">My Clients</option>}
                  {user != null && <option value="logout">Log out</option>}
                </select>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>
        );
}