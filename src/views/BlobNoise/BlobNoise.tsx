import { Canvas, useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import { Points, ShaderMaterial, Vector3 } from "three";
import { MouseHandler } from "../../components/MouseHandler";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { PerspectiveCamera } from "@react-three/drei";

type Particle = {
  originalPosition: Vector3;
  position: Vector3;
  velocity: Vector3;
  scale: number;
  color: Vector3;
};

const rgb = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const pickRGB = () => rgb[Math.floor(Math.random() * rgb.length)];

export const BlobNoiseScene: FunctionComponent = () => {
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
  distanceThreshold?: number;
  sphereRad?: number;
  minSize?: number;
  maxSize?: number;
  particleCount?: number;
}> = ({
  mousePos,
  distanceThreshold = 2.5,
  sphereRad = 2,
  minSize = 30,
  maxSize = 200,
  particleCount = 3000,
}) => {
  const dirRef = useRef(new Vector3());

  const particleRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const positionRef = useRef(new Float32Array(particleCount * 3));
  const colorRef = useRef(new Float32Array(particleCount * 3));
  const scaleRef = useRef(new Float32Array(particleCount));

  const particles = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: particleCount }, (_, i) => {
      const theta = goldenAngle * i;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const x = sphereRad * Math.sin(phi) * Math.cos(theta);
      const y = sphereRad * Math.sin(phi) * Math.sin(theta);
      const z = sphereRad * Math.cos(phi);

      return {
        originalPosition: new Vector3(x, y, z),
        position: new Vector3(x, y, z),
        velocity: new Vector3(),
        scale: minSize,
        color: new Vector3().fromArray(pickRGB()),
      };
    });
  }, [particleCount, sphereRad, minSize]);

  const updateParticle = (particle: Particle, delta: number) => {
    const distance = particle.position.distanceTo(mousePos);

    const isWithinThreshold =
      mousePos.x + mousePos.y + mousePos.z !== 0 &&
      distance <= distanceThreshold;

    dirRef.current.set(0, 0, 0);
    if (isWithinThreshold) {
      // Attract to mouse
      dirRef.current.subVectors(mousePos, particle.position);
      dirRef.current.normalize();
      const strength = Math.max(0.2, 1 - distance / 3);
      particle.velocity.addScaledVector(dirRef.current, strength * delta);
      particle.scale = Math.min(
        maxSize,
        particle.scale + Math.log(distance * 1.5),
      );
    } else {
      // Return to origin
      dirRef.current.subVectors(particle.originalPosition, particle.position);
      particle.velocity.addScaledVector(dirRef.current, delta);
      particle.velocity.multiplyScalar(0.95);
      particle.scale = Math.max(
        minSize,
        particle.scale - Math.log(particle.scale),
      );
    }

    particle.position.add(particle.velocity);
  };

  useFrame((_, delta) => {
    if (!particleRef.current) return;

    particles.forEach((particle, i) => {
      updateParticle(particle, delta);

      // Update attributes
      const idx = i * 3;
      positionRef.current[idx] = particle.position.x;
      positionRef.current[idx + 1] = particle.position.y;
      positionRef.current[idx + 2] = particle.position.z;

      colorRef.current[idx] = particle.color.x;
      colorRef.current[idx + 1] = particle.color.y;
      colorRef.current[idx + 2] = particle.color.z;

      scaleRef.current[i] = particle.scale;
    });

    const geometry = particleRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.scale.needsUpdate = true;
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positionRef.current}
          itemSize={3}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colorRef.current}
          itemSize={3}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-scale"
          array={scaleRef.current}
          itemSize={1}
          count={particleCount}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          maxSize: { value: maxSize },
        }}
      />
    </points>
  );
};

export default BlobNoiseScene;
