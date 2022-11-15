import React from "react";
import DrawPoint from "./components/DrawPoint/index";
import DrawPoint2 from "./components/DrawPoint2/index";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/drawPoint" element={<DrawPoint />}></Route>
        <Route path="/drawPoint2" element={<DrawPoint2 />}></Route>
      </Routes>
    </div>
  );
}
function Main() {
  return (
    <div className="main">
      <Link to="/drawPoint">DrawPoint</Link>
      <Link to="/drawPoint2">DrawPoint2</Link>
    </div>
  );
}

export default App;
