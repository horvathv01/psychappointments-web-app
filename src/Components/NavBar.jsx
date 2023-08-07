import React, {useState, useEffect, useContext} from "react";
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { UserProvider } from "./UserProvider";
import { UserContext } from "../UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import ServerUrlAndPort from '../ServerURLAndPort.js';

export default function NavBar(){

    const {user, login, logout, retreiveUser} = useContext(UserContext);
    const navigate = useNavigate();



    const isOnline = () => {
        return false;
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
            {retreiveUser() && user.name ? <p>Hello, {user.name}! <br> User type: {user.type}</br></p> : null}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {user == null ? <Nav.Link href="/login">Log In</Nav.Link> : null}
                <Nav.Link href="/calendar">Event Calendar</Nav.Link>
                <Nav.Link href="/locations">Locations</Nav.Link>
                <Nav.Link href="/financials">Financials</Nav.Link>
                {retreiveUser() && user.type === "admin" ? <Nav.Link href="/admin">Admin page</Nav.Link> : null}
                {retreiveUser() && user.type === "manager" ? <Nav.Link href="/manager">Management</Nav.Link> : null}
                <span className={`nav-link ${isOnline() ? 'text-success' : 'text-danger'}`}>
                  {isOnline() ? 'Online' : 'Offline'}
                </span>
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