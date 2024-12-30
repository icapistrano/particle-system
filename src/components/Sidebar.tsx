import { FunctionComponent } from "react";
import { useLocation } from "react-router";
import { AppRoutes } from "../routes/AppRoutes";
import { Thumbnail } from "./Thumbnail";

export const Sidebar: FunctionComponent = () => {
  const { pathname } = useLocation();

  return (
    <div className="absolute w-64 h-screen bg-[#2C2C2C]/30 p-4 z-10 backdrop-blur-sm">
      <h1 className="text-white text-md mt-4">
        A collection of particle system
      </h1>
      <div className="border-t border-white my-4"></div>

      <ul className="flex flex-col gap-4">
        {AppRoutes.map(({ img, path }) => (
          <Thumbnail
            key={path}
            imgSrc={img}
            path={path}
            isSelected={pathname === path}
          />
        ))}
      </ul>
    </div>
  );
};
