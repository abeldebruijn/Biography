/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> This is only used to make mouse events work in the background scene </explanation> */
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@/components/canvas";
import {
  DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
  type DeviceOrientationPermissionState,
  getDeviceOrientationPermissionState,
  requestDeviceOrientationPermission,
} from "@/components/gaussian-splat/deviceOrientationPermissions";
import { Scene } from "@/components/gaussian-splat/Scene";
import { cn } from "@/lib/utils";
import { StaggeredNav } from "./staggered-nav";
import { is_touch_device } from "@/lib/is-touch-device";

type GyroData = {
  available: boolean;
  azimuth: number;
  polar: number;
};

const CAMERA_AZIMUTH_LIMIT = 0.1;
const CAMERA_POLAR_LIMIT = 0.15;
const GYRO_AUTO_DISABLE_MS = 30_000;
const IS_TOUCH_DEVICE = is_touch_device();

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function BackgroundScene() {
  // mouse position in viewport, normalized to -1..1
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [gyro, setGyro] = useState<GyroData | undefined>(undefined);
  const [permissionState, setPermissionState] =
    useState<DeviceOrientationPermissionState>("unsupported");
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);

  useEffect(() => {
    const nextPermissionState = getDeviceOrientationPermissionState();
    setPermissionState(nextPermissionState);
    setIsGyroEnabled(nextPermissionState === "granted");

    const handlePermissionGranted = () => {
      setPermissionState("granted");
      setIsGyroEnabled(true);
    };

    window.addEventListener(
      DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
      handlePermissionGranted,
    );

    return () => {
      window.removeEventListener(
        DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT,
        handlePermissionGranted,
      );
    };
  }, []);

  useEffect(() => {
    if (permissionState !== "granted" || !isGyroEnabled) {
      setGyro(undefined);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) {
        return;
      }

      setGyro({
        available: true,
        azimuth: (event.gamma / 45) * CAMERA_AZIMUTH_LIMIT,
        polar: Math.PI / 2 - (event.beta / 60) * CAMERA_POLAR_LIMIT,
      });
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [isGyroEnabled, permissionState]);

  useEffect(() => {
    if (!isGyroEnabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsGyroEnabled(false);
      setGyro(undefined);
    }, GYRO_AUTO_DISABLE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isGyroEnabled]);

  const handleEnableGyroscope = async () => {
    if (permissionState === "granted") {
      setIsGyroEnabled(true);
      return;
    }

    const permission = await requestDeviceOrientationPermission();
    setPermissionState(permission);

    if (permission === "granted") {
      setIsGyroEnabled(true);
      window.dispatchEvent(
        new CustomEvent(DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT),
      );
      return;
    }

    setIsGyroEnabled(false);
  };

  return (
    <header className="relative isolate min-h-svh w-full overflow-hidden text-[#f2f4f8] bg-[#987D57]">
      <div
        className="absolute top-10 z-10 w-full flex-col lg:flex-row px-10 py-12 sm:px-20 flex gap-8 lg:items-end justify-between"
        onMouseMove={(e) => {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>We know that `e.currentTarget.parentElement` will always be there since this is the `nav` element's parent and it will always be in the DOM</explanation>
          const rect = e.currentTarget.parentElement!.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
          setMouse({ x, y });
        }}
      >
        <div className="max-w-3xl">
          <h1 className="animate-hero-enter font-(family-name:--font-cormorant) text-[clamp(2.8rem,10vw,7.1rem)] leading-[0.9] font-semibold tracking-[-0.03em]">
            Abel de Bruijn
          </h1>
          <p
            className="animate-hero-enter mt-2 max-w-lg text-base text-[#d9e3f4]/90 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Web developer based in the Netherlands / Amsterdam
          </p>
        </div>

        <div className="relative">
          {/* <div className="pointer-events-none absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-linear-to-b from-transparent via-[#9ec9ff] to-transparent" /> */}
          <StaggeredNav
            orientation="column"
            buttonClassName="w-48 justify-start rounded-full border-[#afd2ff]/50 bg-background/70 text-foreground hover:bg-background/90 transition-colors hover:text-white"
            delayStartMs={500}
            delayStepMs={120}
          />
        </div>
      </div>

      <div className="h-svh w-full">
        <Canvas gl={{ antialias: false }}>
          <Scene mouse={mouse} gyro={gyro} />
        </Canvas>
      </div>

      <div
        className={cn(
          "pointer-events-auto absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.22),rgba(0,0,0,0.33))]",
        )}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
          setMouse({ x, y });
        }}
      />

      {IS_TOUCH_DEVICE &&
      (permissionState === "required" ||
        (permissionState === "granted" && !isGyroEnabled)) ? (
        <button
          type="button"
          onClick={handleEnableGyroscope}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#afd2ff]/70 bg-black/35 px-4 py-2 text-sm font-medium text-[#f2f4f8] backdrop-blur-sm transition-colors hover:bg-black/45"
        >
          Enable gyroscope
        </button>
      ) : null}
    </header>
  );
}
