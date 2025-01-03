import "./App.css";
import { FunctionComponent } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import { AppRoutes } from "./routes/AppRoutes";

const App: FunctionComponent = () => {
  return (
    <div className="w-screen h-screen">
      <HashRouter basename="/">
        <Routes>
          {AppRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
