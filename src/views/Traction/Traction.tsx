import { Canvas, useFrame } from "@react-three/fiber";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import {
  Points,
  Vector3,
  AdditiveBlending,
  Color,
  ShaderMaterial,
} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { useControls } from "leva";
import { MouseHandler } from "../../components/MouseHandler";
import { PerspectiveCamera } from "@react-three/drei";

type Particle = {
  position: Vector3;
  velocity: Vector3;
};

const TractionScene: FunctionComponent = () => {
  const { radius, nearColor, farColor } = useControls({
    radius: { value: 1, min: 1, max: 3, step: 1 },
    nearColor: "#ffb600",
    farColor: "#0000ff",
  });

  const mousePositionRef = useRef<Vector3>(new Vector3());

  return (
    <Canvas className="cursor-crosshair bg-dark pointer-events-none">
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <MouseHandler mousePositionRef={mousePositionRef} />

      <Particles
        radius={radius}
        nearColor={nearColor}
        farColor={farColor}
        mousePos={mousePositionRef.current}
      />
    </Canvas>
  );
};

const Particles: FunctionComponent<{
  radius: number;
  nearColor: string;
  farColor: string;
  mousePos: Vector3;
  particleCount?: number;
}> = ({ radius, nearColor, farColor, mousePos, particleCount = 5000 }) => {
  const particleRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const positionRef = useRef(new Float32Array(particleCount * 3));
  const colorRef = useRef(new Float32Array(particleCount));
  const dirRef = useRef(new Vector3());

  const particles = useMemo(() => {
    const data: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      data.push({
        position: new Vector3(
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          0,
        ),
        velocity: new Vector3(Math.random() * 0.5, Math.random() * 0.5, 0),
      });
    }
    return data;
  }, [particleCount]);

  const uniforms = useMemo(() => {
    return {
      uNearColor: { value: new Color(nearColor) },
      uFarColor: { value: new Color(farColor) },
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uNearColor.value.set(nearColor);
      materialRef.current.uniforms.uFarColor.value.set(farColor);
    }
  }, [nearColor, farColor]);

  useFrame((_, delta) => {
    if (!particleRef.current) return;

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i];

      const distance = particle.position.distanceTo(mousePos);
      const direction = dirRef.current
        .copy(mousePos)
        .sub(particle.position)
        .normalize();

      if (distance <= radius) {
        const pushOut = radius - distance;
        particle.position.addScaledVector(
          direction.negate(),
          pushOut * 10 * delta,
        );
      } else {
        const acceleration = 1 / Math.pow(distance, 2);
        particle.velocity.addScaledVector(direction, acceleration);
        particle.velocity.multiplyScalar(1 - acceleration * delta * 10);
      }

      particle.position.addScaledVector(particle.velocity, delta);

      positionRef.current[i * 3] = particle.position.x;
      positionRef.current[i * 3 + 1] = particle.position.y;
      positionRef.current[i * 3 + 2] = particle.position.z;

      colorRef.current[i] = Math.min(100, distance) / 10;
    }

    particleRef.current.geometry.attributes.color.needsUpdate = true;
    particleRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          array={positionRef.current}
          itemSize={3}
          count={particleCount}
        />
        <bufferAttribute
          attach={"attributes-color"}
          array={colorRef.current}
          itemSize={1}
          count={particleCount}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </points>
  );
};

export default TractionScene;
