import { FunctionComponent } from "react";
import tractionThumbnail from "./../assets/traction-thumbnail.png";
import smokeTrailThumbnail from "./../assets/smoke-trail-thumbnail.png";
import { Traction } from "./../views/Traction/Traction";
import { SmokeTrail } from "./../views/SmokeTrail/SmokeTrail";

export const AppRoutes: Array<{
  img: string;
  path: string;
  component: FunctionComponent;
}> = [
  {
    img: tractionThumbnail,
    path: "/traction",
    component: Traction,
  },
  {
    img: smokeTrailThumbnail,
    path: "/smoke-trail",
    component: SmokeTrail,
  },
];
