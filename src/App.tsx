import "./App.css";
import { FunctionComponent, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Vector3 } from "three";
import { BrowserRouter, Routes, Route } from "react-router";
import { SmokeTrail } from "./views/SmokeTrail/SmokeTrail";
import { Traction } from "./views/Traction/Traction";
import { MouseHandler } from "./components/MouseHandler";

const App: FunctionComponent = () => {
  const mousePositionRef = useRef(new Vector3());

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <MouseHandler mousePositionRef={mousePositionRef} />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<SmokeTrail origin={mousePositionRef.current} />}
          />
          <Route
            path="/traction"
            element={<Traction origin={mousePositionRef.current} />}
          />
        </Routes>
      </BrowserRouter>
    </Canvas>
  );
};

export default App;
