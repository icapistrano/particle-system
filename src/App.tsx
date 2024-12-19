import { useThree } from "@react-three/fiber";
import "./App.css";
import { PerspectiveCamera, Plane } from "@react-three/drei";
import { SmokeParticles } from "./components/SmokeParticles";
import { useRef } from "react";
import { Vector3 } from "three";

function App() {
  const spherePositionRef = useRef(new Vector3());
  const viewport = useThree((state) => state.viewport);

  return (
    <group>
      <Plane
        args={[viewport.width, viewport.height, 1]}
        onPointerMove={(e) => {
          spherePositionRef.current.copy(e.point);
        }}
        visible={false}
      ></Plane>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <SmokeParticles origin={spherePositionRef.current} />
    </group>
  );
}

export default App;
