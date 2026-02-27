"use client";

import {
  CameraControls,
  CameraControlsImpl,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { SplatMesh as SparkSplatMesh } from "@sparkjsdev/spark";
import { useMemo, useRef } from "react";
import { SparkRenderer } from "./spark-renderer";
import { SplatMesh } from "./splat-mesh";

type SceneProps = {
  mouse: {
    x: number;
    y: number;
  };
  gyro?: {
    available: boolean;
    azimuth: number;
    polar: number;
  };
};

/**
 * Separate `Scene` component to be used in the React Three Fiber `Canvas` component so that we can use React Three Fiber hooks like `useThree`
 */
export function Scene({ mouse, gyro }: SceneProps) {
  const renderer = useThree((state) => state.gl);
  const meshRef = useRef<SparkSplatMesh>(null);
  const controlsRef = useRef<CameraControlsImpl>(null);

  // Memoize the elements inside the `<SparkRenderer />` `args` prop so that we don't re-create the `<SparkRenderer />` on every render
  const sparkRendererArgs = useMemo(() => {
    return { renderer };
  }, [renderer]);

  // Memoize the `SplatMesh` `args` prop so that we don't re-create the `SplatMesh` on every render
  const splatMeshArgs = useMemo(
    () =>
      ({
        url: "/assets/in-de-tuin.rad",
        paged: true,
      }) as const,
    [],
  );

  useFrame((_, delta) => {
    if (controlsRef.current) {
      const targetAzimuth = gyro?.available ? gyro.azimuth : mouse.x * 0.1;
      const targetPolar = gyro?.available
        ? gyro.polar
        : Math.PI / 2 - mouse.y * 0.1;
      const smoothing = 1 - Math.exp(-10 * delta);

      const nextAzimuth =
        controlsRef.current.azimuthAngle +
        (targetAzimuth - controlsRef.current.azimuthAngle) * smoothing;
      const nextPolar =
        controlsRef.current.polarAngle +
        (targetPolar - controlsRef.current.polarAngle) * smoothing;

      controlsRef.current.rotateTo(nextAzimuth, nextPolar, false);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 0, 2]} />

      <CameraControls
        ref={controlsRef}
        makeDefault
        mouseButtons={{
          left: CameraControlsImpl.ACTION.ROTATE,
          middle: CameraControlsImpl.ACTION.NONE,
          right: CameraControlsImpl.ACTION.NONE,
          wheel: CameraControlsImpl.ACTION.NONE,
        }}
        touches={{
          one: CameraControlsImpl.ACTION.NONE,
          two: CameraControlsImpl.ACTION.NONE,
          three: CameraControlsImpl.ACTION.NONE,
        }}
        minPolarAngle={Math.PI / 2 - 0.15}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minAzimuthAngle={-0.1}
        maxAzimuthAngle={0.1}
      />

      <SparkRenderer args={[sparkRendererArgs]}>
        {/* This particular splat mesh is upside down */}
        <group rotation={[-Math.PI + 0.1, 0, 0]} position={[0, -0.5, 0]}>
          <SplatMesh ref={meshRef} args={[splatMeshArgs]} />
        </group>
      </SparkRenderer>
    </>
  );
}
