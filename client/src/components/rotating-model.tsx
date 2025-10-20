import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  scale?: number;
  rotationSpeed?: number;
}

function Model({ url, scale = 1, rotationSpeed = 0.01 }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={scale} />;
}

interface RotatingModelProps {
  modelPath: string;
  className?: string;
  scale?: number;
  rotationSpeed?: number;
  cameraPosition?: [number, number, number];
}

export function RotatingModel({
  modelPath,
  className = "",
  scale = 1,
  rotationSpeed = 0.01,
  cameraPosition = [0, 0, 5],
}: RotatingModelProps) {
  return (
    <div className={className} data-testid="rotating-model">
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Model url={modelPath} scale={scale} rotationSpeed={rotationSpeed} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
