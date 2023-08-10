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
        if(user == null){
            const retreivedUser = retreiveUser();
            if(retreivedUser != null){
                setUser(retreivedUser);
            }
        }
        isOnline();
    }, []);


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
            {user && user.name ? <p>Hello, {user.name}! <br> User type: {user.type}</br></p> : null}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {user == null ? <Nav.Link href="/login">Log In</Nav.Link> : null}
                <Nav.Link href="/calendar">My Events</Nav.Link>
                <Nav.Link href="/locations">Locations</Nav.Link>
                <Nav.Link href="/financials">Financials</Nav.Link>
                {user && user.type === "admin" ? <Nav.Link href="/admin">Admin page</Nav.Link> : null}
                {user && user.type === "manager" ? <Nav.Link href="/manager">Management</Nav.Link> : null}
                <span className={`nav-link ${online ? 'text-success' : 'text-danger'}`}>
                  {online ? 'Online' : 'Offline'}
                </span>
                <select onChange={(e) => navigate(e.target.value)} value="">
                  <option disabled value="">Profile Menu</option>
                  <option value="/profile">My Profile</option>
                  <option value="/profile/myappointments">My Appointments</option>
                  {user && user.type == "psychologist" && <option value="/profile/myclients">My Clients</option>}
                  {user && <option value="/" onClick={handleLogout}>Log out</option>}
                </select>
                <NavDropdown id="basic-nav-dropdown" align = "end">
                  <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/profile/myappointments">My Appointments</NavDropdown.Item>
                  <NavDropdown.Item href="/profile/myclients">My Clients</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} href="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>
        );
}