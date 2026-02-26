export const DEVICE_ORIENTATION_PERMISSION_GRANTED_EVENT =
  "deviceorientationpermissiongranted";

export type DeviceOrientationPermissionState =
  | "granted"
  | "denied"
  | "required"
  | "unsupported";

type DeviceOrientationEventWithPermission = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const getDeviceOrientationEvent = () =>
  DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;

export const getDeviceOrientationPermissionState =
  (): DeviceOrientationPermissionState => {
    if (
      typeof window === "undefined" ||
      typeof DeviceOrientationEvent === "undefined"
    ) {
      return "unsupported";
    }

    return typeof getDeviceOrientationEvent().requestPermission === "function"
      ? "required"
      : "granted";
  };

export const requestDeviceOrientationPermission = async (): Promise<
  "granted" | "denied"
> => {
  const state = getDeviceOrientationPermissionState();

  if (state === "unsupported") {
    return "denied";
  }

  if (state === "granted") {
    return "granted";
  }

  try {
    const permission = await getDeviceOrientationEvent().requestPermission?.();
    return permission === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
};
