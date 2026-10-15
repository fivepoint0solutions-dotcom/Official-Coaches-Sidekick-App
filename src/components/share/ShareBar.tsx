import { FileDown, Printer, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Print, Save as PDF and Send, always in plain sight. Used on every planning page so a finished play or practice goes to the team in one tap. */
export function ShareBar({ title, text, className = "" }: { title: string; text: string; className?: string }) {
  function print() {
    window.print();
  }

  function pdf() {
    toast.message("In the print window, choose “Save as PDF” as the printer.");
    window.print();
  }

  async function send() {
    const subject = title.trim() || "From Coach's Sidekick";
    const body = text.trim();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: subject, text: body });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className={`flex flex-wrap gap-2 print:hidden ${className}`} role="group" aria-label="Print, save as PDF or send">
      <Button type="button" variant="outline" size="sm" onClick={print}>
        <Printer /> Print
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={pdf}>
        <FileDown /> Save as PDF
      </Button>
      <Button type="button" variant="puck" size="default" onClick={send}>
        <Send /> Send
      </Button>
    </div>
  );
}

export default ShareBar;
