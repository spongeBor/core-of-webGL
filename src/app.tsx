import React from "react";
import DrawPoint from "./components/DrawPoint";
import DrawPoint2 from "./components/DrawPoint2";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./app.module.scss";
import ClickPoint from "./components/ClickPoint";
import MultPoints from "./components/MultPoints";
import HelloTriangle from "./components/HelloTriangle";
import HelloRectangle from "./components/HelloRectangle";
import TranslatedTriangle from "./components/TranslatedTriangle";
import RotatedTriangle from "./components/RotatedTriangle";
import RotatedTriangleMatrix from "./components/RotatedTriangleMatrix";
import RotatedTriangleMatrix4 from "./components/RotatedTriangleMatrix4";
import RotatedTranslatedTriangle from "./components/RotatedTranslatedTriangle/index";
import RotatingTriangles from "./components/RotatingTriangles/index";
import MultiAttributeSize from "./components/MultiAttributeSize/index";
import MultiAttributeSizeInterleaved from "./components/MultiAttributeSizeInterleaved/index";
import MultiAttributeColor from "./components/MultiAttributeColor/index";
import HelloTriangleFragCoord from "./components/HelloTriangleFragCoord/index";
import TexturedQuad from "./components/TexturedQuad/index";
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
        <Route
          path="/rotatedTriangleMatrix4"
          element={<RotatedTriangleMatrix4 />}
        ></Route>
        <Route
          path="/rotatedTranslatedTriangle"
          element={<RotatedTranslatedTriangle />}
        ></Route>
        <Route
          path="/rotatingTriangles"
          element={<RotatingTriangles />}
        ></Route>
        <Route
          path="/multiAttributeSize"
          element={<MultiAttributeSize />}
        ></Route>
        <Route
          path="/multiAttributeSizeInterleaved"
          element={<MultiAttributeSizeInterleaved />}
        ></Route>
        <Route
          path="/multiAttributeColor"
          element={<MultiAttributeColor />}
        ></Route>
        <Route
          path="/helloTriangleFragCoord"
          element={<HelloTriangleFragCoord />}
        ></Route>
        <Route path="/texturedQuad" element={<TexturedQuad />}></Route>
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
      <Link to="/rotatedTriangleMatrix4">RotatedTriangleMatrix4</Link>
      <Link to="/rotatedTranslatedTriangle">RotatedTranslatedTriangle</Link>
      <Link to="/rotatingTriangles">RotatingTriangles</Link>
      <Link to="/multiAttributeSize">MultiAttributeSize</Link>
      <Link to="/multiAttributeSizeInterleaved">
        MultiAttributeSizeInterleaved
      </Link>
      <Link to="/multiAttributeColor">MultiAttributeColor</Link>
      <Link to="/helloTriangleFragCoord">HelloTriangleFragCoord</Link>
      <Link to="/texturedQuad">TexturedQuad</Link>
    </div>
  );
}

export default App;
