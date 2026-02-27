export function is_touch_device() {
  try {
    const prefixes = ["-webkit-", "-moz-", "-o-", "-ms-"];

    const mq = (query: string) => window.matchMedia(query).matches;

    if (
      "ontouchstart" in window ||
      // @ts-expect-error This is a valid check for older browsers that have a DocumentTouch interface
      (typeof window.DocumentTouch !== "undefined" &&
        // @ts-expect-error This is a valid check for older browsers that have a DocumentTouch interface
        document instanceof window.DocumentTouch)
    ) {
      return true;
    }

    return mq(["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(""));
  } catch (e) {
    console.error("(Touch detect failed)", e);
    return false;
  }
}
