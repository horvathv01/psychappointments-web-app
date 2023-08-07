import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../../UserContext';

function NavBar(){
    const [isOnline, setIsOnline] = useState(false);
    const [user, login, logout] = useContext(UserContext);
    const navigate = useNavigate();

    return (
    <div>
    <Navbar data-testid="header" bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <FontAwesomeIcon icon={""} className="me-2" />
          PsychAppointments
        </Navbar.Brand>
        <Navbar.Text>{user && user.username}</Navbar.Text>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {user && user.name ? <p>Hello, {user.name}!</p> : <p></p>}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user == null ?? <Nav.Link href="/login">Log In</Nav.Link>}
            <Nav.Link href="/calendar">Event Calendar</Nav.Link>
            <Nav.Link href="/locations">Locations</Nav.Link>
            <Nav.Link href="/financials">Financials</Nav.Link>
            {user.type == "admin" ?? <Nav.Link href="/admin">Admin page</Nav.Link>}
            {user.type == "manager" ?? <Nav.Link href="/manager">Management</Nav.Link>}
            <span className={`nav-link ${isOnline ? 'text-success' : 'text-danger'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <NavDropdown title={<FontAwesomeIcon icon={faUser} />} id="basic-nav-dropdown" align = "end">
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