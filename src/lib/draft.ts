import type {
  BuildQuestion,
  ContentBlock,
  CreationContext,
  CreationType,
  CritiqueResult,
  IdeaOption,
  Mode,
} from "./ai";

export interface Draft {
  id: string;
  mode: Mode;
  type: CreationType;
  context: CreationContext;
  blocks: ContentBlock[];
  ideas: IdeaOption[];
  critique: CritiqueResult | null;
  challengeText: string;
  buildQuestion: BuildQuestion | null;
  buildAnswers: string[];
  askedCount: number;
  savedLibraryId: string | null;
  createdAt: number;
}

const KEY = "tcc.drafts.v1";

function readAll(): Record<string, Draft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Draft>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, Draft>) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(map));
}

export function createDraft(input: {
  mode: Mode;
  type: CreationType;
  context?: CreationContext;
}): Draft {
  const draft: Draft = {
    id: `draft-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6)}`,
    mode: input.mode,
    type: input.type,
    context: input.context ?? {},
    blocks: [],
    ideas: [],
    critique: null,
    challengeText: "",
    buildQuestion: null,
    buildAnswers: [],
    askedCount: 0,
    savedLibraryId: null,
    createdAt: Date.now(),
  };
  const all = readAll();
  all[draft.id] = draft;
  writeAll(all);
  return draft;
}

export function getDraft(id: string): Draft | undefined {
  return readAll()[id];
}

export function updateDraft(id: string, patch: Partial<Draft>): Draft | undefined {
  const all = readAll();
  const existing = all[id];
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  all[id] = updated;
  writeAll(all);
  return updated;
}
