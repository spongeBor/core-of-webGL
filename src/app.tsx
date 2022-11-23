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
import RotatedTranslatedTriangle from "./components/RotatedTranslatedTriangle";
import RotatingTriangles from "./components/RotatingTriangles";
import MultiAttributeSize from "./components/MultiAttributeSize";
import MultiAttributeSizeInterleaved from "./components/MultiAttributeSizeInterleaved";
import MultiAttributeColor from "./components/MultiAttributeColor";
import HelloTriangleFragCoord from "./components/HelloTriangleFragCoord";
import TexturedQuad from "./components/TexturedQuad";
import TexturedQuadRepeat from "./components/TexturedQuadRepeat";
import MultiTexture from "./components/MultiTexture";
import LookAtTriangles from "./components/LookAtTriangles";
import LookAtRotatedTriangles from "./components/LookAtRotatedTriangles";
import LookAtTrianglesWithKeys from "./components/LookAtTrianglesWithKeys";
import OrthoView from "./components/OrthoView/index";
import LookAtTrianglesWithKeysViewVolume from "./components/LookAtTrianglesWithKeysViewVolume/index";
import OrthoViewHalfSize from "./components/OrthoViewHalfSize/index";
import OrthoViewHalfWidth from "./components/OrthoViewHalfWidth/index";
import PerspectiveView from "./components/PerspectiveView/index";
import PerspectiveViewMvp from "./components/PerspectiveViewMvp/index";
import PerspectiveViewMvpMatrix from "./components/PerspectiveViewMvpMatrix/index";
import DepthBuffer from "./components/DepthBuffer/index";
import ZFighting from "./components/ZFighting/index";
import HelloCube from "./components/HelloCube/index";
import ColoredCube from "./components/ColoredCube/index";
import ColoredCubeSingleColor from "./components/ColoredCubeSingleColor/index";
import LightedCube from "./components/LightedCube/index";
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
        <Route
          path="/texturedQuadRepeat"
          element={<TexturedQuadRepeat />}
        ></Route>
        <Route path="/multiTexture" element={<MultiTexture />}></Route>
        <Route path="/lootAtTriangles" element={<LookAtTriangles />}></Route>
        <Route
          path="/lookAtRotatedTriangles"
          element={<LookAtRotatedTriangles />}
        ></Route>
        <Route
          path="/lookAtTrianglesWithKeys"
          element={<LookAtTrianglesWithKeys />}
        ></Route>
        <Route path="/orthoView" element={<OrthoView />}></Route>
        <Route
          path="/lookAtTrianglesWithKeysViewVolume"
          element={<LookAtTrianglesWithKeysViewVolume />}
        ></Route>
        <Route
          path="/orthoViewHalfSize"
          element={<OrthoViewHalfSize />}
        ></Route>
        <Route
          path="/orthoViewHalfWidth"
          element={<OrthoViewHalfWidth />}
        ></Route>
        <Route path="/perspectiveView" element={<PerspectiveView />}></Route>
        <Route
          path="/perspectiveViewMvp"
          element={<PerspectiveViewMvp />}
        ></Route>
        <Route
          path="/perspectiveViewMvpMatrix"
          element={<PerspectiveViewMvpMatrix />}
        ></Route>
        <Route path="/depthBuffer" element={<DepthBuffer />}></Route>
        <Route path="/zFighting" element={<ZFighting />}></Route>
        <Route path="/helloCube" element={<HelloCube />}></Route>
        <Route path="/coloredCube" element={<ColoredCube />}></Route>
        <Route path="/coloredCubeSingleColor" element={<ColoredCubeSingleColor />}></Route>
        <Route path="/lightedCube" element={<LightedCube />}></Route>
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
      <Link to="/texturedQuadRepeat">TexturedQuadRepeat</Link>
      <Link to="/multiTexture">MultiTexture</Link>
      <Link to="/lootAtTriangles">LootAtTriangles</Link>
      <Link to="/lookAtRotatedTriangles">LookAtRotatedTriangles</Link>
      <Link to="/lookAtTrianglesWithKeys">LookAtTrianglesWithKeys</Link>
      <Link to="/orthoView">OrthoView</Link>
      <Link to="/lookAtTrianglesWithKeysViewVolume">
        LookAtTrianglesWithKeysViewVolume
      </Link>
      <Link to="/orthoViewHalfSize">OrthoViewHalfSize</Link>
      <Link to="/orthoViewHalfWidth">OrthoViewHalfWidth</Link>
      <Link to="/perspectiveView">PerspectiveView</Link>
      <Link to="/perspectiveViewMvp">PerspectiveViewMvp</Link>
      <Link to="/perspectiveViewMvpMatrix">PerspectiveViewMvpMatrix</Link>
      <Link to="/depthBuffer">DepthBuffer</Link>
      <Link to="/zFighting">ZFighting</Link>
      <Link to="/helloCube">HelloCube</Link>
      <Link to="/coloredCube">ColoredCube</Link>
      <Link to="/coloredCubeSingleColor">ColoredCubeSingleColor</Link>
      <Link to="/lightedCube">LightedCube</Link>
    </div>
  );
}

export default App;
