import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, PresentationControls } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Loader2, Cube } from "lucide-react";

interface Model3DProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
}

function Model3D({ modelPath, scale = 1, autoRotate = true }: Model3DProps) {
  const modelRef = useRef<any>();
  const { scene } = useGLTF(modelPath);

  useFrame((state) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene.clone()} 
      scale={scale}
    />
  );
}

interface ModelViewerProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  className?: string;
  fallbackImage?: string;
}

export function ModelViewer({ 
  modelPath, 
  scale = 1, 
  autoRotate = true,
  className = "",
  fallbackImage
}: ModelViewerProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 ${className}`}>
      <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Cube className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold mb-2">3D Model Viewer</p>
            <p className="text-sm text-muted-foreground">Interactive 3D Kinder Egg model will appear here</p>
            <p className="text-xs text-muted-foreground mt-2">(Requires WebGL support in browser)</p>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            onCreated={({ gl }) => {
              try {
                gl.setClearColor('#000000', 0);
              } catch (err) {
                setError(true);
              }
            }}
            onError={() => setError(true)}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Environment preset="sunset" />
              
              <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
              >
                <Model3D 
                  modelPath={modelPath} 
                  scale={scale} 
                  autoRotate={autoRotate}
                />
              </PresentationControls>
              
              <OrbitControls 
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={10}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
      {!error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground">
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </Card>
  );
}
