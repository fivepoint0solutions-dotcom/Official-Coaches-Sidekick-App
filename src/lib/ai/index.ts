import { mockProvider } from "./mockProvider";
import type { AIProvider } from "./types";

/**
 * Single seam for AI functionality. Every screen calls `aiProvider.*`
 * and never touches a specific vendor SDK. To switch providers, write
 * a new module implementing `AIProvider` and swap the export below —
 * no other file in the app changes.
 */
export const aiProvider: AIProvider = mockProvider;

export * from "./types";
