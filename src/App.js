import './App.css';
import CalendarV01 from './Components/CalendarV01';
import CalendarV02 from './Components/CalendarV02';
import { UserProvider } from './UserProvider';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <UserProvider>
      <Routes>
      <Route path="/" element={<CalendarV02/>}/>
      </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
