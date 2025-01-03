import { FunctionComponent, lazy } from "react";
import TractionDemo from "../assets/traction.mov";
import SmokeTrailDemo from "../assets/smokeTrail.mov";
import BlobNoiseDemo from "../assets/blobNoise.mov";
import { Home } from "../views/Home";

const TractionScene = lazy(() => import("./../views/Traction/Traction"));
const SmokeTrailScene = lazy(() => import("./../views/SmokeTrail/SmokeTrail"));
const BlobNoiseScene = lazy(() => import("../views/BlobNoise/BlobNoise"));

export const AppRoutes: Array<{
  videoSrc?: string;
  title: string;
  path: string;
  component: FunctionComponent;
}> = [
  {
    path: "/",
    title: "home",
    component: Home,
  },
  {
    videoSrc: TractionDemo,
    path: "/traction",
    title: "traction",
    component: TractionScene,
  },
  {
    videoSrc: SmokeTrailDemo,
    path: "/smoke-trail",
    title: "smoke-trail",
    component: SmokeTrailScene,
  },
  {
    videoSrc: BlobNoiseDemo,
    path: "/blob-noise",
    title: "blob-noise",
    component: BlobNoiseScene,
  },
];
