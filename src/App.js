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
import AdminPage from './Components/AdminPage';
import ManagerPage from './Components/ManagerPage';
import Unauthorized from './Components/Unauthorized';
import Registration from './Components/Registration';
import ProfilePage from './Components/ProfilePage';
import AdminEditUser from './Components/AdminEditUser';
import MyClientsPage from './Components/MyClientsPage';
import Appointments from './Components/Appointments';

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
                <Route path="/registration" element={<Registration />} />
                <Route path="/editusers" element={<p>Edit users</p>} />
                <Route path="/error" element={<Error />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/calendar" element={<MainPage />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/financials" element={<Financials/>} />

                <Route path="/admin" element={<AdminPage />} />
                <Route path="/edituser" element={<AdminEditUser />} />
                <Route path="/manager" element={<ManagerPage />} />

                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/myclients" element={<MyClientsPage />} />

                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/add" element={<AddAppointment />} />
                <Route path="/appointments/edit" element={null} />

                <Route path="/rooms/add" element={null} />
                <Route path="/rooms/edit" element={null} />
                <Route path="/rooms/delete" element={null} />
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