
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function KinderEggModel() {
  const { scene } = useGLTF("/attached_assets/kinder_surprise_egg_1760961737682.glb");
  return <primitive object={scene} scale={2} />;
}

export function KinderEgg3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <KinderEggModel />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
