import React, { useEffect, useState } from "react";

const STORAGE_KEY = "csk_demo_email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THEME = {
  bg: "#EDE8DE",
  card: "#FFFFFF",
  ink: "#151922",
  accent: "#B3141F",
  accentInk: "#fff",
  line: "#D6CFC2",
  radius: 6,
  border: "1px solid #E2DCCF",
  font: "inherit",
};

/* Free-demo email gate. Wraps the whole app so a stray link can't be used
   anonymously — stores the email on this device once entered, no account needed.
   It renders nothing on the server, so link previews and cover pages never show it. */
export default function DemoGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      setEmail(localStorage.getItem(STORAGE_KEY) || "");
    } catch {
      /* private browsing */
    }
    setChecked(true);
  }, []);
  useEffect(() => {
    if (checked && !email) (window as unknown as { __skReady?: () => void }).__skReady?.();
  }, [checked, email]);
  const [draft, setDraft] = useState("");
  const [touched, setTouched] = useState(false);

  if (!checked) return <div style={{ minHeight: "100dvh", background: THEME.bg }} />;
  if (email) return <>{children}</>;

  const valid = EMAIL_RE.test(draft.trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const clean = draft.trim().toLowerCase();
    try {
      localStorage.setItem(STORAGE_KEY, clean);
    } catch {
      /* private browsing — still let them through for this visit */
    }
    setEmail(clean);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: THEME.bg,
        fontFamily: THEME.font,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: THEME.card,
          color: THEME.ink,
          borderRadius: THEME.radius,
          padding: "32px 28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          border: THEME.border,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: THEME.ink }}>
          Try the free demo
        </h1>
        <p style={{ fontSize: 15, opacity: 0.8, margin: "0 0 20px", lineHeight: 1.45 }}>
          Enter your email to start — no account, no password, no payment. It only keeps the free
          demo available for everyone. We won't spam you or share your email with anyone.
        </p>
        <input
          type="email"
          autoFocus
          value={draft}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          placeholder="you@email.com"
          aria-label="Your email"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 12,
            border: touched && !valid ? "2px solid #D9534F" : "2px solid " + THEME.line,
            fontSize: 16,
            marginBottom: 8,
            background: "#fff",
            color: "#222",
          }}
        />
        {touched && !valid && (
          <p style={{ color: "#B42318", fontSize: 14, margin: "0 0 8px" }}>
            Enter a valid email to continue.
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 12,
            padding: "13px 14px",
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            fontSize: 16,
            background: THEME.accent,
            color: THEME.accentInk,
            cursor: "pointer",
            fontFamily: THEME.font,
          }}
        >
          Start the demo
        </button>
      </form>
    </div>
  );
}
