import { BookOpen, FolderOpen, Home, Lightbulb, ListChecks, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

export interface NavItem {
  key: TranslationKey;
  to: "/" | "/drills" | "/lessons" | "/ideas" | "/materials";
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: "nav.dashboard", to: "/", icon: Home },
  { key: "nav.drills", to: "/drills", icon: ListChecks },
  { key: "nav.myLessons", to: "/lessons", icon: BookOpen },
  { key: "nav.myIdeas", to: "/ideas", icon: Lightbulb },
  { key: "nav.materials", to: "/materials", icon: FolderOpen },
];
