import './App.css';
import MainPage from './Components/MainPage';
import { UserProvider } from './Components/UserProvider';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      
        <BrowserRouter>
          <UserProvider>
            <Routes>
              <Route path="/" element={<MainPage/>}/>
            </Routes>
          </UserProvider>
        </BrowserRouter>
      
    </div>
  );
}

export default App;


