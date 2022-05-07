import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import Home from "./Home/Home";
import GraphicsPlayground from "./GraphicsPlayground/GraphicsPlayground";
import GraphicsPlayground2 from './GraphicsPlayground2/GraphicsPlayground2';
import GraphicsPlayground3 from './GraphicsPlayground3/GraphicsPlayground3';

function App() {
  return (
    <div className="App">
      <div className="site-title-box">
        <h1>Physics Game Engine Demo</h1>
      </div>
      <div className="horizontal-container">
        <NavBar />
        <div id="main_page">
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/graphics_playground" element={<GraphicsPlayground />}></Route>
            <Route path="/graphics_playground_2" element={<GraphicsPlayground2 />}></Route>
            <Route path="/graphics_playground_3" element={<GraphicsPlayground3 />}></Route>

            <Route path="/" element={<Navigate to="/home" />}></Route>
            <Route path="/*" element={<p>Page not found.</p>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
