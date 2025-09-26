import { BrowserRouter } from 'react-router-dom';
import './App.css';
import RoutingAll from './RoutingAll';
import Header from './Components/Header';
import Announcement from './Components/Announcement';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Announcement/>
       <Header/>
       <RoutingAll/>
      </BrowserRouter>
    </div>
  );
}

export default App;
