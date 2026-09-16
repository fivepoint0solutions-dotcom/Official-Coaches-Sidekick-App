import type {
  AIProvider,
  BuildQuestion,
  ChatMemory,
  ChatReply,
  ContentBlock,
  CreationContext,
  CreationType,
  CritiqueResult,
  GenerationResult,
  IdeaOption,
  QuickAction,
} from "./types";
import { translate, type TranslationKey } from "@/lib/i18n";
import { DEFAULT_LANGUAGE, isLanguageCode } from "@/lib/i18n/languages";

function langOf(ctx: CreationContext) {
  return ctx.language && isLanguageCode(ctx.language) ? ctx.language : DEFAULT_LANGUAGE;
}

/** Localized block heading for the coach's chosen interface language. */
function h(ctx: CreationContext, key: TranslationKey): string {
  return translate(langOf(ctx), key);
}

/**
 * Reference implementation of `AIProvider`.
 *
 * It's a template engine, not a model — it exists so the whole app (UI,
 * state, editing, saving) can be built and demoed without an API key.
 * Point `aiProvider` in `./index.ts` at a real model later and every
 * screen keeps working unchanged.
 */

let counter = 0;
function id(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

function delay(min = 550, max = 1100) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pick<T>(arr: T[], seed = Math.random()): T {
  return arr[Math.floor(seed * arr.length) % arr.length] as T;
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0] as T);
  }
  return out;
}

function topicOf(ctx: CreationContext) {
  return ctx.topic?.trim() || ctx.idea?.trim() || "this focus area";
}

function sportOf(ctx: CreationContext) {
  return ctx.sport?.trim() || "your team";
}

function ageGroupOf(ctx: CreationContext) {
  const g = ctx.ageGroup?.trim();
  if (!g || g === "Mixed") return "your";
  return `${g}`;
}

const APPROACHES = [
  "Hands-on reps",
  "Small-sided games",
  "Competitive & scored",
  "Visual walkthrough",
  "Game-situation",
  "Conditioning-built-in",
  "Partner work",
  "Station rotation",
  "Film & discussion",
];

const HOOK_STARTERS = [
  (t: string) =>
    `Open with a 2-minute challenge tied to ${t} and see who can crack it before you explain the fix.`,
  (t: string) =>
    `Show two clips or reps — one clean, one broken — related to ${t} and ask "what's different?"`,
  (t: string) =>
    `Start with a quick show-of-hands on confidence with ${t} to see where the team actually stands.`,
  (t: string) => `Tell a 60-second story about a game moment that came down to ${t}.`,
  (t: string) => `Pose a game-situation scenario tied to ${t} and have players call out what they'd do.`,
];

const ACTIVITY_STARTERS = [
  (t: string, g: string) =>
    `Small groups run a rep-based drill isolating ${t} for ${g} players, then rotate.`,
  (t: string) => `Players rotate through 3 stations, each drilling ${t} from a different angle.`,
  (t: string) =>
    `Pair players up for a "coach each other" rep where each one cues the other through ${t}.`,
  (t: string) => `Run a small-sided game or scrimmage segment where ${t} is the only way to score or win the rep.`,
  (t: string) =>
    `Give players a live game-like scenario involving ${t} and see how they respond under pressure.`,
];

const ASSESSMENT_STARTERS = [
  (t: string) =>
    `A quick 3-rep check to see whether players can execute ${t} live, not just walk through it.`,
  (t: string) => `A one-sentence "explain it to a rookie" summary of ${t}.`,
  (t: string) =>
    `Thumbs up / sideways / down confidence check on ${t}, followed by one clarifying question.`,
  (t: string) =>
    `A quick partner check where players watch each other's reps on ${t} against 2 coaching points.`,
];

const CLOSING_STARTERS = [
  (t: string) =>
    `Players share one thing that clicked for them about ${t} before heading to the locker room.`,
  (t: string) =>
    `Circle back to the opening challenge and ask players to answer it now, knowing what they know about ${t}.`,
  (t: string) => `Quick round-robin: one word each to describe how ${t} felt today.`,
];

function makeIdea(ctx: CreationContext, approach: string): IdeaOption {
  const t = topicOf(ctx);
  const g = ageGroupOf(ctx);
  const templates: Record<string, () => { title: string; description: string }> = {
    "Hands-on reps": () => ({
      title: `Build it: high-rep reps on ${t}`,
      description: `${g} players get heavy repetition on ${t} in isolation before you layer in decision-making or defense.`,
    }),
    "Small-sided games": () => ({
      title: `Small-sided game built around ${t}`,
      description: `A tight-numbers game (2v2, 3v3, or similar) where the only way to win a rep is to execute ${t}.`,
    }),
    "Competitive & scored": () => ({
      title: `Turn ${t} into a competition`,
      description: `A lightweight, low-prep contest (points, a bracket, or a race) where winning depends on ${t}.`,
    }),
    "Visual walkthrough": () => ({
      title: `Walk it through: a visual breakdown of ${t}`,
      description: `Players walk through ${t} at half speed, whiteboard or cone it out, then build back up to full speed.`,
    }),
    "Game-situation": () => ({
      title: `Live look: ${t} under game pressure`,
      description: `Set up a game-realistic rep — score, clock, or numbers — where players have to execute ${t} live.`,
    }),
    "Conditioning-built-in": () => ({
      title: `Make ${t} the conditioning`,
      description: `Structure the work rate so players are getting fitness work while the reps happen to be ${t}.`,
    }),
    "Partner work": () => ({
      title: `Partner up on ${t}`,
      description: `Pair players so one executes ${t} while the other gives a live coaching cue, then swap.`,
    }),
    "Station rotation": () => ({
      title: `Rotate through ${t}`,
      description: `Break the group into stations, each drilling one piece of ${t}, and rotate every few minutes.`,
    }),
    "Film & discussion": () => ({
      title: `Show them the tape on ${t}`,
      description: `Use game or practice film (or a quick sketch) to show ${t} done well and done poorly, then discuss.`,
    }),
  };
  const gen = templates[approach] ?? templates["Hands-on reps"]!;
  const { title, description } = gen();
  return { id: id("idea"), title, approach, description };
}

function makeBlocks(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  const g = ageGroupOf(ctx);
  const time = ctx.timeAvailable?.trim() || "one practice session";
  return [
    { id: id("blk"), heading: h(ctx, "block.hook"), body: pick(HOOK_STARTERS)(t) },
    {
      id: id("blk"),
      heading: h(ctx, "block.learningObjective"),
      body:
        ctx.objective?.trim() ||
        `By the end of ${time}, players will be able to execute ${t} in a live rep, not just a drill.`,
    },
    { id: id("blk"), heading: h(ctx, "block.mainActivity"), body: pick(ACTIVITY_STARTERS)(t, g) },
    {
      id: id("blk"),
      heading: h(ctx, "block.checkUnderstanding"),
      body: pick(ASSESSMENT_STARTERS)(t),
    },
    { id: id("blk"), heading: h(ctx, "block.closing"), body: pick(CLOSING_STARTERS)(t) },
  ];
}

function makeDrillSheet(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.instructions"),
      body: `Work through the reps below on ${t}. Focus on the coaching points, not just getting through it.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.warmUp"),
      body: `1. In your own words, what is the goal of "${t}"?\n2. Show one example of ${t} at half speed before going live.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.practice"),
      body: `3. Execute ${t} in the following rep: [insert scenario here]\n4. Explain why the technique works.\n5. What changes if the defender/opponent reacts differently?`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.challengeOptional"),
      body: `6. Run ${t} against a live partner and have them give you one coaching cue.`,
    },
  ];
}

function makeScoutingReport(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.directions"),
      body: `Scouting notes on ${t}. Use these to build a game plan — you have ${ctx.timeAvailable?.trim() || "this week"} to prep.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.question1MultipleChoice"),
      body: `What is their go-to tendency around ${t}?\nA) [tendency]\nB) [tendency]\nC) [tendency]\nD) [tendency]`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.question2ShortAnswer"),
      body: `Describe one situation where they lean on ${t}, in 2-3 sentences.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.question3Applied"),
      body: `Given [a specific game situation], how should your team counter ${t}?`,
    },
  ];
}

function makeAnswerKey(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.answerKey"),
      body: `1. [Correct read + why it's correct]\n2. [Model short answer touching on ${t}]\n3. [Worked-through counter]`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.commonMistakes"),
      body: `Players often confuse ${t} with a related-but-different read — give credit for reasoning that's on the right track.`,
    },
  ];
}

function makeRubric(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.criterionUnderstanding"),
      body: `4 — Executes ${t} correctly and consistently.\n3 — Executes ${t} with minor breakdowns.\n2 — Shows partial grasp of ${t}.\n1 — Little to no execution of ${t}.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.criterionApplication"),
      body: `4 — Applies ${t} correctly in live/game reps.\n3 — Applies ${t} with small errors under pressure.\n2 — Attempts application with significant breakdowns.\n1 — Does not attempt application in live reps.`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.criterionCommunication"),
      body: `4 — Communicates and hustles at a high level.\n3 — Mostly communicates and competes.\n2 — Inconsistent effort or communication.\n1 — Rarely communicates or competes.`,
    },
  ];
}

function makeTeamMessage(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  const tone = ctx.tone?.trim() || "warm and clear";
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.subjectLine"),
      body: `A quick update from ${sportOf(ctx)}`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.message"),
      body: `Hi team,\n\nThis week we've been working on ${t} at practice. ${ctx.keyPoints?.trim() ? ctx.keyPoints.trim() + " " : ""}Players can keep practicing by walking through ${t} at home or before the next session.\n\nThanks for the support.\n\nCoach\n[Your name]`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.toneNote"),
      body: `Written to sound ${tone} — adjust freely to match your voice.`,
    },
  ];
}

function makeDrill(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.setup"),
      body: `Equipment and grouping for a ${t} drill — adjust to what you have on hand (cones, pinnies, balls, space).`,
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.directions"),
      body: pick(ACTIVITY_STARTERS)(t, ageGroupOf(ctx)),
    },
    {
      id: id("blk"),
      heading: h(ctx, "block.debriefQuestion"),
      body: `What did this drill reveal about ${t} that you didn't expect?`,
    },
  ];
}

function makeOther(ctx: CreationContext): ContentBlock[] {
  const t = topicOf(ctx);
  return [
    {
      id: id("blk"),
      heading: h(ctx, "block.draft"),
      body: `Here's a starting point for ${t} — tell me more about what you need and I'll reshape it.`,
    },
  ];
}

function generatorFor(type: CreationType): (ctx: CreationContext) => ContentBlock[] {
  switch (type) {
    case "practice-plan":
      return makeBlocks;
    case "drill-sheet":
      return makeDrillSheet;
    case "scouting-report":
      return makeScoutingReport;
    case "evaluation-rubric":
      return makeRubric;
    case "team-message":
      return makeTeamMessage;
    case "drill":
      return makeDrill;
    case "brainstorm":
      return makeOther;
    default:
      return makeOther;
  }
}

const BUILD_QUESTIONS: ((ctx: CreationContext) => BuildQuestion)[] = [
  (ctx) => ({
    id: id("q"),
    prompt: `What matters most for this practice on ${topicOf(ctx)} — depth on one skill, or covering more ground?`,
    choices: ["Go deep on one skill", "Cover more ground", "Not sure yet — suggest one"],
  }),
  (ctx) => ({
    id: id("q"),
    prompt: `How do you want ${ageGroupOf(ctx)} players to spend most of their time?`,
    choices: ["Live reps & competition", "Isolated technical work", "Small-sided games"],
  }),
  () => ({
    id: id("q"),
    prompt: "Is there a specific bad habit you want to head off?",
    choices: ["Yes — I'll add it as I edit", "No particular one", "Not sure"],
  }),
];

const STRENGTH_TEMPLATES = [
  (t: string) =>
    `The core rep around ${t} is clear and gives players something concrete to execute.`,
  (t: string) =>
    `There's a natural competitive hook here — players will likely buy in fast on ${t}.`,
  () => `The structure leaves room for players to problem-solve rather than just follow instructions.`,
];

const CONSIDERATION_TEMPLATES = [
  (t: string) =>
    `It's not yet clear how you'll know a struggling player has actually grasped ${t} versus just gone through the motions.`,
  (t: string) =>
    `The pacing may be tight if players need more reps to groove ${t} than expected — worth a built-in checkpoint.`,
  () =>
    `Consider whether every player gets real reps, or whether this favors the players who are already confident.`,
];

const QUESTION_TEMPLATES = [
  (t: string) =>
    `What will you do in the moment if half the team already has ${t} down and half doesn't?`,
  () => `What does success look like here — for you, not just for a stat line?`,
  (t: string) =>
    `Is there a simpler version of ${t} you could start with for players who need it?`,
];

const ALTERNATIVE_TEMPLATES = [
  (t: string) =>
    `You could flip the order — let players struggle through a live rep involving ${t} before you break down the technique.`,
  (t: string) =>
    `Consider a smaller-group version so quieter or less confident players get more reps on ${t}.`,
  () =>
    `A shorter, tighter version focused on one clear win might serve you better than covering everything today.`,
];

const AGE_GROUP_ALIASES: Record<string, string> = {
  varsity: "Varsity",
  jv: "JV",
  "junior varsity": "JV",
  rec: "Adult/Rec",
  recreational: "Adult/Rec",
};

function extractAgeGroup(message: string): string | undefined {
  const uMatch = message.match(/\bu[- ]?(\d{1,2})\b/i);
  if (uMatch) return `U${uMatch[1]}`;
  const gradeMatch =
    message.match(/(\d{1,2})(?:st|nd|rd|th)\s*grade(rs)?/i) ??
    message.match(/grade\s*(\d{1,2})/i);
  if (gradeMatch?.[1]) return `${gradeMatch[1]}th`;
  for (const [needle, label] of Object.entries(AGE_GROUP_ALIASES)) {
    if (message.toLowerCase().includes(needle)) return label;
  }
  return undefined;
}

function extractTopic(message: string): string | undefined {
  const patterns = [
    /(?:work(?:ing)? on|drill(?:ing)?|coach(?:ing)?|teach(?:ing)?)\s+(?:my\s+\w+\s+)?(?:team\s+|players?\s+)?([a-z0-9][a-z0-9 ,'-]{2,60}?)(?:\s+to\b|\s+for\b|\.|,|$)/i,
    /(?:about|on)\s+([a-z0-9][a-z0-9 ,'-]{2,60}?)(?:\.|,|$)/i,
    /idea for (?:an?|my)\s+([a-z0-9 ,'-]{2,60}?)(?:\.|,|$| but)/i,
  ];
  for (const p of patterns) {
    const m = message.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return undefined;
}

type ChatIntent = "inspire" | "build" | "busywork" | "challenge";

function classifyIntent(message: string): ChatIntent {
  const m = message.toLowerCase();
  if (/challenge|weak(ness)?|flaw|missing|second opinion|critique|poke holes|what.?s wrong/.test(m))
    return "challenge";
  if (/three (different )?(ways|approaches|options)|multiple approaches|give me options/.test(m))
    return "inspire";
  if (/bored|boring|fun|engaging|exciting|spice up|creative way/.test(m)) return "inspire";
  if (/drill sheet|scouting report|rubric|team (message|email|note)|answer key/.test(m))
    return "busywork";
  return "build";
}

const ENCOURAGERS = [
  "Good starting point.",
  "That's a solid thread to pull on.",
  "I like where this is headed.",
  "Nice — plenty to work with here.",
];

async function generateIdeas(ctx: CreationContext): Promise<IdeaOption[]> {
  await delay();
  const approaches = sample(APPROACHES, 4);
  return approaches.map((a) => makeIdea(ctx, a));
}

async function generateCritique(ideaText: string, ctx: CreationContext): Promise<CritiqueResult> {
  await delay(700, 1300);
  const t = ideaText.trim() ? "your idea" : topicOf(ctx);
  return {
    strengths: sample(STRENGTH_TEMPLATES, 2).map((f) => f(t)),
    considerations: sample(CONSIDERATION_TEMPLATES, 2).map((f) => f(t)),
    questions: sample(QUESTION_TEMPLATES, 2).map((f) => f(t)),
    alternatives: sample(ALTERNATIVE_TEMPLATES, 2).map((f) => f(t)),
  };
}

export const mockProvider: AIProvider = {
  async converse(message, memory) {
    await delay(300, 650);
    const ageGroup = extractAgeGroup(message) ?? memory.context.ageGroup;
    const topic =
      extractTopic(message) ?? (memory.awaiting ? message.trim() : memory.context.topic);
    const context: CreationContext = {
      ...memory.context,
      ...(ageGroup && { ageGroup }),
      ...(topic && { topic }),
    };

    // Resolving a question we asked last turn.
    if (
      memory.awaiting === "grade-objective-for-build" ||
      memory.awaiting === "topic-for-inspire"
    ) {
      const resolvedTopic = topic ?? message.trim();
      const ideas = await generateIdeas({ ...context, topic: resolvedTopic });
      return {
        text: "Based on that, I have three approaches. Pick one, combine them, or tell me to head in a completely different direction.",
        suggestions: ideas.map((idea) => ({
          label: idea.title,
          mode: "build",
          context: {
            ...context,
            topic: resolvedTopic,
            idea: `${idea.title} — ${idea.description}`,
          },
        })),
        memory: { context: { ...context, topic: resolvedTopic } },
      };
    }

    if (memory.awaiting === "lesson-for-challenge") {
      const critique = await generateCritique(message, context);
      return {
        text: `Here's one thing you might want to consider: ${critique.considerations[0]}`,
        suggestions: [
          {
            label: "See the full breakdown",
            mode: "challenge",
            challengeText: message,
            critique,
            context,
          },
        ],
        memory: { context },
      };
    }

    const intent = classifyIntent(message);

    if (intent === "challenge") {
      const looksLikeContent = message.split(/\s+/).length > 12;
      if (!looksLikeContent) {
        return {
          text: "Happy to take a look. Paste the play, practice plan, or idea here, or describe it in a sentence or two, and I'll point out what's worth a second look.",
          suggestions: [],
          memory: { context, awaiting: "lesson-for-challenge" },
        };
      }
      const critique = await generateCritique(message, context);
      return {
        text: `Here's one thing you might want to consider: ${critique.considerations[0]} There's also real strength here — ${critique.strengths[0]?.toLowerCase()}`,
        suggestions: [
          {
            label: "See the full breakdown",
            mode: "challenge",
            challengeText: message,
            critique,
            context,
          },
        ],
        memory: { context },
      };
    }

    if (intent === "inspire") {
      if (!topic) {
        return {
          text: "I can do that. What's the skill or focus area you'd like fresh angles on?",
          suggestions: [],
          memory: { context, awaiting: "topic-for-inspire" },
        };
      }
      const ideas = await generateIdeas({ ...context, topic });
      return {
        text: `${pick(ENCOURAGERS)} Here are a few different angles on ${topic} — none of these are finished practice plans, just directions worth trying.`,
        suggestions: ideas.map((idea) => ({
          label: idea.title,
          mode: "build",
          context: { ...context, topic, idea: `${idea.title} — ${idea.description}` },
          ideas,
        })),
        memory: { context: { ...context, topic } },
      };
    }

    if (intent === "busywork") {
      return {
        text: `Sure — I can put together a ${topic ? "draft on " + topic : "first draft"} for you to look over and adjust. Want me to take a first pass?`,
        suggestions: [{ label: "Take a first pass", mode: "busywork", context }],
        memory: { context },
      };
    }

    // build
    if (!topic || !ageGroup) {
      return {
        text: "Great — what age group or level are you coaching, and what should the team be able to do by the end of this practice?",
        suggestions: [],
        memory: { context, awaiting: "grade-objective-for-build" },
      };
    }
    return {
      text: "Here's where I'd start — want to build this out together, step by step?",
      suggestions: [{ label: "Build this with me", mode: "build", context }],
      memory: { context },
    };
  },

  async inspire(ctx) {
    return generateIdeas(ctx);
  },

  async buildQuestion(ctx, askedCount) {
    await delay(350, 700);
    if (askedCount >= 2) return null;
    const gen = BUILD_QUESTIONS[askedCount % BUILD_QUESTIONS.length]!;
    return gen(ctx);
  },

  async buildDraft(ctx, _answers) {
    await delay();
    const t = topicOf(ctx);
    return {
      summaryTitle: `${t[0]!.toUpperCase()}${t.slice(1)} — draft practice plan`,
      blocks: makeBlocks(ctx),
    };
  },

  async busywork(type, ctx) {
    await delay();
    const t = topicOf(ctx);
    return {
      summaryTitle: `${t[0]!.toUpperCase()}${t.slice(1)} — ${type.replace(/-/g, " ")}`,
      blocks: generatorFor(type)(ctx),
    };
  },

  async challenge(ideaText, ctx) {
    return generateCritique(ideaText, ctx);
  },

  async applyQuickAction(action, blocks, ctx) {
    await delay(400, 850);
    const t = topicOf(ctx);
    switch (action) {
      case "more-creative":
        return blocks.map((b) => ({
          ...b,
          body: `${b.body}\n\nCreative twist: reframe this as a competition, race, or game-on-the-line moment tied to ${t}.`,
        }));
      case "simpler":
        return blocks.map((b) => ({
          ...b,
          body: b.body.split("\n")[0] ?? b.body,
        }));
      case "more-challenging":
        return blocks.map((b) => ({
          ...b,
          body: `${b.body}\n\nStretch: add a defender, a time limit, or a scoring pressure to ${t}.`,
        }));
      case "different-approach": {
        const approach = pick(APPROACHES);
        const idea = makeIdea(ctx, approach);
        return [{ id: id("blk"), heading: idea.title, body: idea.description }, ...blocks.slice(1)];
      }
      case "improve":
        return blocks.map((b) => ({
          ...b,
          body: `${b.body}\n\nSharper version: be explicit about the one coaching cue players should hear first.`,
        }));
      case "boring-parts":
        return blocks.map((b) =>
          /instruction|direction|format|answer key/i.test(b.heading)
            ? { ...b, body: `${b.body}\n\n(Formatted and ready to hand out.)` }
            : b,
        );
      case "three-approaches":
      default:
        return blocks;
    }
  },
};
