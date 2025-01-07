import { Canvas, useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { MouseHandler } from "../../components/MouseHandler";
import { Line, PerspectiveCamera } from "@react-three/drei";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

type Particle = {
  velocity: Vector3;
  trail: Vector3[];
  alpha: number;
};

export const LightTrailScene: FunctionComponent = () => {
  const mousePositionRef = useRef<Vector3>(new Vector3());
  return (
    <Canvas className="cursor-crosshair bg-dark">
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <MouseHandler mousePositionRef={mousePositionRef} />

      <Particles mousePos={mousePositionRef.current} />
    </Canvas>
  );
};

const Particles: FunctionComponent<{
  mousePos: Vector3;
  particleCount?: number;
  speedFactor?: number;
  minZ?: number;
  maxZ?: number;
}> = ({ particleCount = 2000, speedFactor = 5, minZ = -10, maxZ = 10 }) => {
  const dirRef = useRef(new Vector3());
  const trailRefs = useRef<(Line2 | null)[]>([]);

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => {
      const x = Math.random() * 15 - 7.5;
      const y = Math.random() * 15 - 7.5;
      const z = Math.random() * (maxZ * 2) - maxZ;

      return {
        velocity: new Vector3(0, 0, Math.random() * 2 + 1),
        trail: [new Vector3(x, y, z), new Vector3(x, y, z)],
        alpha: 1,
      };
    });
  }, [particleCount, maxZ]);

  const updateParticle = (particle: Particle, delta: number) => {
    const [p1, p2] = particle.trail;

    if (p2.z >= maxZ) {
      p1.z = minZ;
      p2.z = minZ - 1;
      particle.velocity.set(0, 0, Math.random() * 2 + 1);
      particle.alpha = 1;
    }

    p1.addScaledVector(particle.velocity, delta * speedFactor);

    const dir = dirRef.current.subVectors(p2, p1).normalize();
    const lerpT = (p1.z + maxZ) / (maxZ * 2); // normalise to [0,1]
    p2.copy(p1).addScaledVector(dir, Math.pow(lerpT, 2) + 1);

    particle.alpha = Math.pow(lerpT, 3);
  };

  useFrame((_, delta) => {
    particles.forEach((particle, i) => {
      updateParticle(particle, delta);

      const line = trailRefs.current[i];
      if (!line) return;

      const [p1, p2] = particle.trail;

      const instanceStart = line.geometry.attributes.instanceStart.array;
      instanceStart.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);

      const instanceEnd = line.geometry.attributes.instanceEnd.array;
      instanceEnd.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);

      line.geometry.attributes.instanceStart.needsUpdate = true;
      line.geometry.attributes.instanceEnd.needsUpdate = true;

      (line.material as LineMaterial).opacity = particle.alpha;
    });
  });

  return (
    <group>
      {particles.map((particle, i) => (
        <Line
          ref={(ref) => (trailRefs.current[i] = ref as Line2 | null)}
          key={i}
          points={particle.trail}
          lineWidth={5}
          color={"blue"}
          vertexColors={[
            [1, 0, 0],
            [0, 0, 1],
          ]}
          transparent
        ></Line>
      ))}
    </group>
  );
};

export default LightTrailScene;
