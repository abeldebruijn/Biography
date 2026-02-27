export function is_touch_device() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const prefixes = ["-webkit-", "-moz-", "-o-", "-ms-"];

    const mq = (query: string) =>
      !!(window.matchMedia && window.matchMedia(query).matches);

    if (
      "ontouchstart" in window ||
      (typeof (window as any).DocumentTouch !== "undefined" &&
        document instanceof (window as any).DocumentTouch)
    ) {
      return true;
    }

    return mq(["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(""));
  } catch (e) {
    if (typeof console !== "undefined")
      console.error("(Touch detect failed)", e);
    return false;
  }
}
