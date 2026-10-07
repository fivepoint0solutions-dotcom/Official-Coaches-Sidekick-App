import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/* Small "Install app" button for the header. Shows only while the app is
   installable and not yet installed; disappears the moment it is installed. */
let deferredPrompt = null;
const subs = new Set();
const notify = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const isIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

function usePwaInstall() {
  const [, tick] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const f = () => tick((n) => n + 1);
    subs.add(f);
    return () => subs.delete(f);
  }, []);
  const ios = mounted && isIos();
  const show = mounted && !isStandalone() && (!!deferredPrompt || ios);
  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
  }
  return { show, ios: ios && !deferredPrompt, install };
}

export default function InstallAppButton({ className = "", wrapperClassName = "ml-2", style = {}, iconColor = "#FFFFFF" }) {
  const { show, ios, install } = usePwaInstall();
  const [tip, setTip] = useState(false);
  if (!show) return null;
  return (
    <div className={`pointer-events-auto relative flex-shrink-0 ${wrapperClassName}`}>
      <button
        type="button"
        onClick={() => (ios ? setTip((t) => !t) : install())}
        aria-label="Install app"
        title="Install app"
        className={`grid place-items-center active:scale-95 transition-transform ${className}`}
        style={{ width: 36, height: 36, borderRadius: "50%", ...style }}
      >
        <Download size={17} color={iconColor} />
      </button>
      {tip && (
        <div
          role="status"
          onClick={() => setTip(false)}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-white p-3 text-xs text-slate-800 shadow-lg"
        >
          To install: tap the Share icon, then “Add to Home Screen”.
        </div>
      )}
    </div>
  );
}
