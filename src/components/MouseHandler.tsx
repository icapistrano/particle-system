import { Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { FunctionComponent } from "react";
import { Vector3 } from "three";

export const MouseHandler: FunctionComponent<{
  mousePositionRef: React.RefObject<Vector3>;
}> = ({ mousePositionRef }) => {
  const { viewport } = useThree();

  return (
    <Plane
      args={[viewport.width, viewport.height, 1]} // Plane size based on the viewport
      onPointerMove={(e) => {
        if (mousePositionRef.current) {
          mousePositionRef.current.copy(e.point);
        }
      }}
      onPointerLeave={() => {
        if (mousePositionRef.current) {
          mousePositionRef.current.set(0, 0, 0);
        }
      }}
      visible={false} // Plane is not visible but still interactive
    />
  );
};
