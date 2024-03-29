import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Chair = () => {
    const chair = useGLTF("./office_chair/scene.gltf");
  
    return (
      <primitive object={chair.scene} scale={11.5} position-y={-6} rotation-y={5} />
    );
};

const ChairCanvas = () => {
    return (
      <div
        style={{
          width: "60%", // Ajuste a largura para ocupar metade da tela
          height: "80%",
          position: "absolute", // Adicione position relative
          zIndex: 1, // Defina um valor para o z-index
        }}
      >
        <Canvas
          shadows
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 100, // Reduza esse valor para trazer a Terra mais próxima
            position: [-2, 3, 20], // Ajuste a posição da câmera aqui
          }}
          style={{ position: "absolute" }}
        >
        <ambientLight intensity={0.5} />
        <directionalLight color="white" intensity={1} position={[5, 10, 2]} castShadow />
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate
              autoRotateSpeed={5.0}
              enableRotate={true}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 2.2}
            />
            <Chair />
  
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    );
  };
  
  export default ChairCanvas;