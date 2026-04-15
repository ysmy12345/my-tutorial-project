export const checkIsMobileDevice = (): {
  isSafari: boolean;
  isMobileDevice: boolean;
} => {
  if (typeof navigator === "undefined") {
    return {
      isSafari: false,
      isMobileDevice: false,
    };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);

  let device: "iPhone" | "iPad" | "Mac" | "Unknown" = "Unknown";
  let isMobileDevice = false;

  if (/iPad/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1)) {
    device = "iPad";
    isMobileDevice = true;
  } else if (/iPhone/.test(ua)) {
    device = "iPhone";
    isMobileDevice = true;
  } else if (/Macintosh/.test(platform)) {
    device = "Mac";
  }

  return {
    isSafari,
    isMobileDevice,
  };
};
