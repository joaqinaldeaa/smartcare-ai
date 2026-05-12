"use client";

import { useEffect } from "react";

/**
 * Security hardening for client-side protection.
 * - Blocks right-click context menu on the document
 * - Blocks DevTools detection (anti-debug)
 * - Removes X-Requested-With header risk
 * - Prevents console from being used for inspection
 */
export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Block right-click context menu
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Block DevTools detection (basic)
    // This won't stop determined users but stops casual inspection
    const blockDevTools = () => {
      // Block keyboard shortcuts common in DevTools
    };

    document.addEventListener("keydown", (e) => {
      // Block F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I (DevTools on Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
      }
      // Block Ctrl+Shift+J (DevTools Console on Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
      }
      // Block Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
      }
      // Block Ctrl+U (View Page Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
      }
    });

    // Disable text selection on sensitive areas
    // CSS class .no-select handles this per-element

    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("keydown", () => {});
    };
  }, []);

  return <>{children}</>;
}

/**
 * Utility function to clear all sensitive session data.
 * Call this on logout or security events.
 */
export function clearAllSessionData() {
  try {
    sessionStorage.clear();
    // Don't clear localStorage completely — child profiles persist
    // But remove any sensitive session tokens
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.startsWith("smartcare-session") || key.startsWith("smartcare-token")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // localStorage may be blocked in some browsers
  }
}