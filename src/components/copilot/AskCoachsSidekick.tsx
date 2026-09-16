import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUp, MessageCircleHeart, Sparkles } from "lucide-react";
import { aiProvider, type ChatMemory, type ChatSuggestion } from "@/lib/ai";
import { createDraft, updateDraft } from "@/lib/draft";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useT, type TranslationKey } from "@/lib/i18n";

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestions?: ChatSuggestion[];
};

const STARTER_KEYS: TranslationKey[] = [
  "chat.starter1",
  "chat.starter2",
  "chat.starter3",
  "chat.starter4",
];

export function AskCoachsSidekick() {
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([
    { id: "opening", role: "assistant", text: t("chat.opening") },
  ]);
  const [memory, setMemory] = useState<ChatMemory>({ context: {} });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function send(message: string) {
    if (!message.trim() || thinking) return;
    const userTurn: ChatTurn = { id: `u-${Date.now()}`, role: "user", text: message };
    setTurns((prev) => [...prev, userTurn]);
    setInput("");
    setThinking(true);
    scrollToEnd();

    const reply = await aiProvider.converse(message, memory);
    setMemory(reply.memory);
    setTurns((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: reply.text,
        suggestions: reply.suggestions,
      },
    ]);
    setThinking(false);
    scrollToEnd();
  }

  function applySuggestion(suggestion: ChatSuggestion) {
    const draft = createDraft({
      mode: suggestion.mode,
      type:
        suggestion.mode === "inspire"
          ? "brainstorm"
          : suggestion.mode === "busywork"
            ? "drill-sheet"
            : "practice-plan",
      context: suggestion.context ?? memory.context,
    });
    if (suggestion.ideas || suggestion.critique || suggestion.challengeText) {
      updateDraft(draft.id, {
        ideas: suggestion.ideas ?? [],
        critique: suggestion.critique ?? null,
        challengeText: suggestion.challengeText ?? "",
      });
    }
    setOpen(false);
    navigate({ to: "/workspace", search: { draft: draft.id, mode: undefined } });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("chat.button")}
        className="gradient-hero gradient-motion big-cta fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-5 py-4 text-sm font-bold text-white sm:bottom-7 sm:right-7"
      >
        <MessageCircleHeart className="size-5" />
        {t("chat.button")}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle className="flex items-center gap-2 font-display">
              <span className="gradient-hero grid size-8 place-items-center rounded-lg text-white">
                <Sparkles className="size-4" />
              </span>
              Coach's Sidekick
            </SheetTitle>
            <SheetDescription>{t("chat.subtitle")}</SheetDescription>
          </SheetHeader>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    turn.role === "user"
                      ? "bg-interactive text-interactive-foreground"
                      : "card-soft text-foreground",
                  )}
                >
                  <p>{turn.text}</p>
                  {turn.suggestions && turn.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {turn.suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applySuggestion(s)}
                          className="rounded-xl border border-border-strong bg-card px-3 py-2 text-left text-sm font-semibold text-interactive transition-refined hover:border-interactive hover:bg-secondary"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="card-soft flex gap-1.5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-float rounded-full bg-interactive"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {turns.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTER_KEYS.map((key) => {
                  const label = t(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      className="chip"
                      onClick={() => void send(label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-border p-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder={t("chat.placeholder")}
              rows={2}
              className="max-h-32 flex-1 resize-none text-sm"
            />
            <Button
              type="button"
              variant="hero"
              size="icon"
              className="shrink-0 rounded-xl"
              disabled={!input.trim() || thinking}
              onClick={() => void send(input)}
              aria-label={t("chat.send")}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AskCoachsSidekick;
