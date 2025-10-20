
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
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

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function KinderEggModel() {
  const { scene } = useGLTF('/attached_assets/kinder_surprise_egg (1)_1760977420232.glb');
  return <primitive object={scene} scale={2} />;
}

function CanvasWrapper() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <KinderEggModel />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Suspense>
    </Canvas>
  );
}

export function RotatingModel() {
  return (
    <div className="w-full h-[400px]">
      <ErrorBoundary>
        <CanvasWrapper />
      </ErrorBoundary>
    </div>
  );
}
