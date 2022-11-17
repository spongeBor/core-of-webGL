import React from "react";
import DrawPoint from "./components/DrawPoint/index";
import DrawPoint2 from "./components/DrawPoint2/index";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./app.module.scss";
import ClickPoint from "./components/ClickPoint/index";
import MultPoints from "./components/MultPoints/index";
import HelloTriangle from "./components/HelloTriangle/index";
import HelloRectangle from "./components/HelloRectangle/index";
import TranslatedTriangle from "./components/TranslatedTriangle/index";
import RotatedTriangle from "./components/RotatedTriangle/index";
import RotatedTriangleMatrix from "./components/RotatedTriangleMatrix/index";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/drawPoint" element={<DrawPoint />}></Route>
        <Route path="/drawPoint2" element={<DrawPoint2 />}></Route>
        <Route path="/clickPoint" element={<ClickPoint />}></Route>
        <Route path="/multPoints" element={<MultPoints />}></Route>
        <Route path="/helloTriangle" element={<HelloTriangle />}></Route>
        <Route path="/helloRectangle" element={<HelloRectangle />}></Route>
        <Route
          path="/translatedTriangle"
          element={<TranslatedTriangle />}
        ></Route>
        <Route path="/rotatedTriangle" element={<RotatedTriangle />}></Route>
        <Route
          path="/rotatedTriangleMatrix"
          element={<RotatedTriangleMatrix />}
        ></Route>
      </Routes>
    </div>
  );
}
function Main() {
  return (
    <div className={styles.main}>
      <Link to="/drawPoint">DrawPoint</Link>
      <Link to="/drawPoint2">DrawPoint2</Link>
      <Link to="/clickPoint">ClickPoint</Link>
      <Link to="/multPoints">MultPoints</Link>
      <Link to="/helloTriangle">HelloTriangle</Link>
      <Link to="/helloRectangle">HelloRectangle</Link>
      <Link to="/translatedTriangle">TranslatedTriangle</Link>
      <Link to="/rotatedTriangle">RotatedTriangle</Link>
      <Link to="/rotatedTriangle">RotatedTriangle</Link>
      <Link to="/rotatedTriangleMatrix">RotatedTriangleMatrix</Link>
    </div>
  );
}

export default App;
