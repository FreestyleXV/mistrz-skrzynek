import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './Components/Router/Homepage/Homepage';
import Case from './Components/Router/Case/Case';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';


function App() {
  return (
    <BrowserRouter>
        <div>
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/case/:id" element={<Case />}/>
          </Routes>
          <Footer></Footer>
        </div>
    </BrowserRouter>
  );
}

export default App;
