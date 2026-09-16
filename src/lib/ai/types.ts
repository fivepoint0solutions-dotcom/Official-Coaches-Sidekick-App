export type Mode = "inspire" | "build" | "busywork" | "challenge";

export type CreationType =
  | "practice-plan"
  | "drill"
  | "drill-sheet"
  | "scouting-report"
  | "evaluation-rubric"
  | "team-message"
  | "brainstorm"
  | "other";

export interface CreationContext {
  ageGroup?: string;
  sport?: string;
  topic?: string;
  timeAvailable?: string;
  objective?: string;
  playerLevel?: string;
  creativity?: number;
  idea?: string;
  audience?: string;
  tone?: string;
  keyPoints?: string;
  /** The coach's chosen interface language — threaded through so a real
   * AI provider can generate content natively in that language. */
  language?: string;
}

export interface ContentBlock {
  id: string;
  heading: string;
  body: string;
}

export interface IdeaOption {
  id: string;
  title: string;
  approach: string;
  description: string;
}

export interface CritiqueResult {
  strengths: string[];
  considerations: string[];
  questions: string[];
  alternatives: string[];
}

export interface BuildQuestion {
  id: string;
  prompt: string;
  choices: string[];
}

export interface GenerationResult {
  summaryTitle: string;
  blocks: ContentBlock[];
}

export type QuickAction =
  | "three-approaches"
  | "more-creative"
  | "simpler"
  | "more-challenging"
  | "different-approach"
  | "improve"
  | "boring-parts";

/** What the "Ask Coach's Sidekick" assistant remembers between turns of one conversation. */
export interface ChatMemory {
  context: CreationContext;
  awaiting?: "topic-for-inspire" | "grade-objective-for-build" | "lesson-for-challenge";
}

export interface ChatSuggestion {
  label: string;
  mode: Mode;
  context?: CreationContext;
  ideas?: IdeaOption[];
  critique?: CritiqueResult;
  challengeText?: string;
}

export interface ChatReply {
  text: string;
  suggestions: ChatSuggestion[];
  memory: ChatMemory;
}

/**
 * Every AI backend the app can ever plug in implements this shape.
 * Swap `aiProvider` in `src/lib/ai/index.ts` to change providers —
 * nothing else in the app needs to know.
 */
export interface AIProvider {
  inspire(context: CreationContext): Promise<IdeaOption[]>;
  buildQuestion(context: CreationContext, askedCount: number): Promise<BuildQuestion | null>;
  buildDraft(context: CreationContext, answers: string[]): Promise<GenerationResult>;
  busywork(type: CreationType, context: CreationContext): Promise<GenerationResult>;
  challenge(ideaText: string, context: CreationContext): Promise<CritiqueResult>;
  applyQuickAction(
    action: QuickAction,
    blocks: ContentBlock[],
    context: CreationContext,
  ): Promise<ContentBlock[]>;
  /**
   * The natural-language entry point behind "Ask Coach's Sidekick" — plain
   * coach language in, a plain-language reply and a few tappable next
   * steps out. No prompts, models, or parameters ever surface above this.
   */
  converse(message: string, memory: ChatMemory): Promise<ChatReply>;
}
