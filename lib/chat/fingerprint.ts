"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;
let cachedVisitorId: string | null = null;

/**
 * Initializes and retrieves the device visitor ID using FingerprintJS.
 * Runs strictly on the client side with graceful fallback.
 */
export async function getVisitorFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  if (cachedVisitorId) {
    return cachedVisitorId;
  }

  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    if (result && typeof result.visitorId === "string" && result.visitorId.length > 0) {
      cachedVisitorId = result.visitorId;
      return cachedVisitorId;
    }
  } catch (err) {
    console.warn("FingerprintJS client error, using localStorage fallback:", err);
  }

  // Graceful local device ID fallback (e.g. if strict ad-blocker blocked canvas/audio fingerprinting)
  try {
    const storageKey = "gyanendra_device_fp";
    let fallbackId = localStorage.getItem(storageKey);
    if (!fallbackId || fallbackId.length !== 32) {
      const randomBytes = new Uint8Array(16);
      crypto.getRandomValues(randomBytes);
      fallbackId = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(storageKey, fallbackId);
    }
    cachedVisitorId = fallbackId;
    return cachedVisitorId;
  } catch {
    return "00000000000000000000000000000000";
  }
}
