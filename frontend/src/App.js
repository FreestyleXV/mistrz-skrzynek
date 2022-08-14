import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './Components/Router/Homepage/Homepage';
import Case from './Components/Router/Case/Case';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}>
        </Route>
        <Route path="/case/:id" element={<Case />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
