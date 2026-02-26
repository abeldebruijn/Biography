"use client";

import {
  CameraControls,
  CameraControlsImpl,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { SplatMesh as SparkSplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo, useRef } from "react";
import {
  DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
  getDeviceOrientationPermissionState,
} from "./deviceOrientationPermissions";
import { SparkRenderer } from "./spark-renderer";
import { SplatMesh } from "./splat-mesh";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Separate `Scene` component to be used in the React Three Fiber `Canvas` component so that we can use React Three Fiber hooks like `useThree`
 */
export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const pointer = useThree((state) => state.pointer);
  const meshRef = useRef<SparkSplatMesh>(null);
  const controlsRef = useRef<CameraControlsImpl>(null);
  const gyroRef = useRef({
    available: false,
    azimuth: 0,
    polar: Math.PI / 2,
  });

  // Memoize the elements inside the `<SparkRenderer />` `args` prop so that we don't re-create the `<SparkRenderer />` on every render
  const sparkRendererArgs = useMemo(() => {
    return { renderer };
  }, [renderer]);

  // Memoize the `SplatMesh` `args` prop so that we don't re-create the `SplatMesh` on every render
  const splatMeshArgs = useMemo(
    () =>
      ({
        url: "/assets/test-lod.rad",
        paged: true,
      }) as const,
    [],
  );

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) {
        return;
      }

      const normalizedX = clamp(event.gamma / 45, -1, 1);
      const normalizedY = clamp(event.beta / 45, -1, 1);

      gyroRef.current.available = true;
      gyroRef.current.azimuth = normalizedX * 0.1;
      gyroRef.current.polar = Math.PI / 2 + normalizedY * 0.1;
    };

    const startOrientationListener = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    if (getDeviceOrientationPermissionState() === "required") {
      window.addEventListener(
        DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
        startOrientationListener,
      );
    } else {
      startOrientationListener();
    }

    return () => {
      window.removeEventListener(
        DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
        startOrientationListener,
      );
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  useFrame((_, delta) => {
    if (controlsRef.current) {
      const targetAzimuth = gyroRef.current.available
        ? gyroRef.current.azimuth
        : pointer.x * 0.1;
      const targetPolar = gyroRef.current.available
        ? gyroRef.current.polar
        : Math.PI / 2 - pointer.y * 0.1;
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
        <group rotation={[-Math.PI, 0, 0]}>
          <SplatMesh ref={meshRef} args={[splatMeshArgs]} />
        </group>
      </SparkRenderer>
    </>
  );
};
