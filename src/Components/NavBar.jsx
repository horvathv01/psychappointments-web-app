import React, {useState, useEffect, useContext} from "react";
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { UserProvider } from "./UserProvider";
import { UserContext } from "../UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import ServerURLAndPort from "../ServerURLAndPort";

export default function NavBar(){

    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const [online, setOnline] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        
      //retreiveUser();
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
      fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/access/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      .then((response) => response.text())
      .then(data => {
        logout();
        navigate("/login");
      })
      .catch(info => console.log(info));
      
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
                {user && user.type != "Admin" && user.type != "Manager" && <Nav.Link href="/calendar">My Events</Nav.Link>}
                {user && user.type != "Client" && <Nav.Link href="/locations">Locations</Nav.Link>}
                <Nav.Link href="/financials">Financials</Nav.Link>
                {user && user.type === "Admin" ? <Nav.Link href="/admin">Admin page</Nav.Link> : null}
                {user && user.type === "Manager" ? <Nav.Link href="/manager">Management</Nav.Link> : null}
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
                  {user && user.type != "Client" && <option value="/slots/edit">Slots</option>}
                  <option value="/appointments">Appointments</option>
                  {user && user.type == "Psychologist" && <option value="/profile/myclients">Clients</option>}
                  {user != null && <option value="logout">Log out</option>}
                </select>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>
        );
}