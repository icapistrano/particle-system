import { PerspectiveCamera, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import smoke from "../../assets/smoke_01.png";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";
import { useControls } from "leva";
import { MouseHandler } from "../../components/MouseHandler";

type Particle = {
  position: Vector3;
  velocity: Vector3;
  lifetime: number;
  scale: number;
  angle: number;
};

const SmokeTrailScene: FunctionComponent = () => {
  const { speed, startColor, endColor } = useControls({
    speed: { value: 1, min: 0, max: 1, step: 0.1 },
    startColor: "#ff00ff",
    endColor: "#363bff",
  });

  const mousePositionRef = useRef<Vector3>(new Vector3());

  return (
    <Canvas className="cursor-crosshair bg-dark">
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <MouseHandler mousePositionRef={mousePositionRef} />

      <Particles
        speed={speed}
        startColor={startColor}
        endColor={endColor}
        mousePos={mousePositionRef.current}
      />
    </Canvas>
  );
};

const Particles: FunctionComponent<{
  speed: number;
  startColor: string;
  endColor: string;
  mousePos: Vector3;
  minLifetime?: number;
  maxLifetime?: number;
  particleCount?: number;
}> = ({
  speed,
  startColor,
  endColor,
  mousePos,
  minLifetime = 1,
  maxLifetime = 1.5,
  particleCount = 5000,
}) => {
  const particleRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const positionRef = useRef(new Float32Array(particleCount * 3));
  const scaleRef = useRef(new Float32Array(particleCount));
  const alphaRef = useRef(new Float32Array(particleCount));
  const angleRef = useRef(new Float32Array(particleCount));

  const smokeTexture = useTexture(smoke);

  const particles = useMemo(() => {
    const data: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      data.push({
        position: new Vector3().copy(mousePos),
        velocity: new Vector3(
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
        ),
        lifetime: Math.random() * maxLifetime + minLifetime,
        scale: Math.random() * 1 + 0.5,
        angle: Math.random() * Math.PI * 2,
      });
    }

    return data;
  }, [particleCount, speed, minLifetime, maxLifetime]);

  const uniforms = useMemo(() => {
    return {
      uScaleFactor: { value: 1000 },
      uTexture: { value: smokeTexture },
      uEndColor: { value: new Color(endColor) },
      uStartColor: { value: new Color(startColor) },
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uStartColor.value.set(startColor);
      materialRef.current.uniforms.uEndColor.value.set(endColor);
    }
  }, [startColor, endColor]);

  useFrame((_, delta) => {
    if (!particleRef.current) return;

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i];

      if (particle.lifetime <= 0) {
        particle.position.copy(mousePos);

        particle.velocity.set(
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
        );

        particle.lifetime = Math.random() * maxLifetime + minLifetime;
      }

      particle.lifetime -= delta;
      particle.position.addScaledVector(particle.velocity, delta);

      positionRef.current[i * 3] = particle.position.x;
      positionRef.current[i * 3 + 1] = particle.position.y;
      positionRef.current[i * 3 + 2] = particle.position.z;

      scaleRef.current[i * 3] = particle.scale;
      alphaRef.current[i] = Math.max(particle.lifetime / maxLifetime, 0);
      angleRef.current[i] += particle.angle * (delta * 0.01);
    }

    particleRef.current.geometry.attributes.alpha.needsUpdate = true;
    particleRef.current.geometry.attributes.angle.needsUpdate = true;
    particleRef.current.geometry.attributes.scale.needsUpdate = true;
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
          attach={"attributes-alpha"}
          array={alphaRef.current}
          itemSize={1}
          count={particleCount}
        />
        <bufferAttribute
          attach={"attributes-scale"}
          array={scaleRef.current}
          itemSize={1}
          count={particleCount}
        />
        <bufferAttribute
          attach={"attributes-angle"}
          array={angleRef.current}
          itemSize={1}
          count={particleCount}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        depthTest={false}
        transparent
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default SmokeTrailScene;
