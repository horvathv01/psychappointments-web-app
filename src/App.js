import './App.css';
import MainPage from './Components/MainPage';
import { UserProvider } from './Components/UserProvider';
import { DateProvider } from './Components/DateProvider';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import StarterPage from './Components/StarterPage';
import Error from './Components/Error';
import AddAppointment from './Components/AddAppointment';
import LoginFirst from './Components/LoginFirst';
import Locations from './Components/Locations';
import Layout from './Components/Layout';
import Financials from './Components/Financials';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <DateProvider>
            <Layout>

              <Routes>

                <Route path="/" element={<StarterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/loginfirst" element={<LoginFirst />} />
                <Route path="/registration" element={<p>registration page</p>} />
                <Route path="/error" element={<Error />} />

                <Route path="/calendar" element={<MainPage />} />

                <Route path="/locations" element={<Locations />} />
                <Route path="/financials" element={< Financials/>} />
                <Route path="/admin" element={null} />
                <Route path="/manager" element={null} />

                <Route path="/profile" element={null} />
                <Route path="/profile/myappointments" element={null} />
                <Route path="/profile/myclients" element={null} />

                <Route path="/appointments/add" element={<AddAppointment />} />
                <Route path="/appointments/edit" element={null} />
              </Routes>
            </Layout>
          </DateProvider>
        </UserProvider>
      </BrowserRouter>      
    </div>
  );
}

export default App;


                // <Nav.Link href="/locations">Locations</Nav.Link>
                // <Nav.Link href="/financials">Financials</Nav.Link>
                // {user && user.type === "admin" ? <Nav.Link href="/admin">Admin page</Nav.Link> : null}
                // {user && user.type === "manager" ? <Nav.Link href="/manager">Management</Nav.Link> : null}
                //   <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                //   <NavDropdown.Item href="/profile/myappointments">My Appointments</NavDropdown.Item>
                //   <NavDropdown.Item href="/profile/myclients">My Clients</NavDropdown.Item>
                //   <NavDropdown.Item onClick={handleLogout} href="/logout">Logout</NavDropdown.Item>