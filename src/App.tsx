import "./App.css";
import { FunctionComponent } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { AppRoutes } from "./routes/AppRoutes";

const App: FunctionComponent = () => {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Sidebar />
        <Canvas className="cursor-crosshair bg-dark">
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />

          <Routes>
            {AppRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Fallback route (catch-all) */}
            <Route path="*" element={<Navigate to="/traction" />} />
          </Routes>
        </Canvas>
      </BrowserRouter>
    </div>
  );
};

export default App;
