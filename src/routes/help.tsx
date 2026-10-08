import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { GuideDiagram } from "@/components/help/HelpDiagram";
import { GUIDE_GROUPS, type GuideTopic } from "@/lib/helpGuide";
import { DisplaySettings } from "@/components/navigation/AppHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [
    { title: "Help — Coach's Sidekick" },
    { name: "description", content: "A step-by-step guide to everything in Coach's Sidekick." },
    { property: "og:title", content: "Help — Coach's Sidekick" },
    { property: "og:description", content: "A step-by-step guide to everything in Coach's Sidekick." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HelpPage,
});

const CARD = "anchor-card-gradient card-tint-inspire rounded-3xl text-white";

function matches(topic: GuideTopic, q: string) {
  const hay = [topic.title, topic.intro, ...topic.steps, ...(topic.tips ?? [])].join(" ").toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
}

/* Every Help section is the same collapsed pill with a chevron; tap to open or close. */
function Pill({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(CARD, "overflow-hidden transition-[border-radius] duration-200")}
      style={{ borderRadius: open ? 28 : 35 }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-6 text-left"
        style={{ minHeight: 64 }}
      >
        <span className="min-w-0 flex-1 text-base font-bold leading-tight text-white">{title}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-white transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="space-y-3 px-5 pb-5">{children}</div>}
    </div>
  );
}

function Topic({ topic, open, onToggle }: { topic: GuideTopic; open: boolean; onToggle: () => void }) {
  return (
    <Pill title={topic.title} open={open} onToggle={onToggle}>
      <>
          <p className="text-sm text-white/90">{topic.intro}</p>
          {topic.diagram && <GuideDiagram spec={topic.diagram} />}
          <ol className="space-y-2.5">
            {topic.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-white">
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold"
                  style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.5)" }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          {topic.tips?.map((tip, i) => (
            <div
              key={i}
              className="rounded-2xl px-4 py-3 text-sm text-white"
              style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)" }}
            >
              <span className="font-bold">Tip: </span>
              {tip}
            </div>
          ))}
          {topic.go && (
            <Link
              to={topic.go.to}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.7)" }}
            >
              {topic.go.label}
              <ArrowRight className="size-4" />
            </Link>
          )}
      </>
    </Pill>
  );
}

function HelpPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const q = query.trim().toLowerCase();
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const groups = useMemo(
    () =>
      GUIDE_GROUPS.map((g) => ({ ...g, topics: q ? g.topics.filter((tp) => matches(tp, q)) : g.topics })).filter(
        (g) => g.topics.length > 0,
      ),
    [q],
  );

  return (
    <div className="container-app py-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-headline">Help</h1>
          <p className="text-body mt-2 text-muted-foreground">
            Everything in Coach's Sidekick, one step at a time. Tap a heading to open it.
          </p>
        </div>

        <label className="relative mb-6 block">
          <span className="sr-only">Search the help guide</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: drills, diagram, swipe, save…"
            className="w-full rounded-full border-2 border-border bg-card py-3 pl-12 pr-4 text-base text-foreground"
          />
        </label>

        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.id} aria-label={g.title}>
              <h2 className="text-title mb-3">{g.title}</h2>
              <div className="space-y-3">
                {g.topics.map((tp) => (
                  <Topic
                    key={tp.id}
                    topic={tp}
                    open={Boolean(q) || Boolean(open[tp.id])}
                    onToggle={() => setOpen((o) => ({ ...o, [tp.id]: !o[tp.id] }))}
                  />
                ))}
              </div>
            </section>
          ))}
          {groups.length === 0 && (
            <div className={cn(CARD, "p-6 text-center")}>
              <p className="font-bold">Nothing matched "{query}".</p>
              <p className="mt-1 text-sm text-white/90">Try a shorter word, or email us below.</p>
            </div>
          )}

          {!q && (
            <section aria-label="Settings">
              <h2 className="text-title mb-3">Settings</h2>
              <Pill title="Text size and colors" open={Boolean(open["settings"])} onToggle={() => toggle("settings")}>
                <DisplaySettings />
              </Pill>
            </section>
          )}

          <section aria-label="Still stuck">
            <h2 className="text-title mb-3">Still stuck?</h2>
            <Pill title="Contact us" open={Boolean(open["contact"])} onToggle={() => toggle("contact")}>
              <p className="text-sm text-white/90">
                Tap the megaphone at the bottom left to send feedback, or write to us and we will help.
              </p>
              <a
                href="mailto:fivepoint0solutions@gmail.com?subject=Coach's Sidekick Help"
                className="inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.7)" }}
              >
                Email us
              </a>
            </Pill>
          </section>
        </div>
      </div>
    </div>
  );
}
