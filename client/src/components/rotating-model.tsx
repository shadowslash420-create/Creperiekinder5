import { useRef, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
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
  fallbackContent?: ReactNode;
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function RotatingModel({
  modelPath,
  className = "",
  scale = 1,
  rotationSpeed = 0.02,
  cameraPosition = [0, 0, 3],
  fallbackContent = <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-400 rounded-full" />,
}: RotatingModelProps) {
  return (
    <div className={className} data-testid="rotating-model">
      <ErrorBoundary fallback={fallbackContent}>
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Model url={modelPath} scale={scale} rotationSpeed={rotationSpeed} />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
