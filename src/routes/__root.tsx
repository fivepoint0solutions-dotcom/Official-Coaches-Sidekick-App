import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { WatermarkBackdrop } from "../components/motion/WatermarkBackdrop";
import { AppHeader } from "../components/navigation/AppHeader";
import { AskCoachsSidekick } from "../components/copilot/AskCoachsSidekick";
import { FeedbackFab } from "../components/navigation/FeedbackFab";
import { BetaBanner } from "../components/navigation/BetaBanner";
import { SiteFooter } from "../components/brand/SiteFooter";
import { HockeySkins } from "../components/brand/HockeySkins";
import { SwipeNav } from "../components/navigation/SwipeNav";
import { Toaster } from "../components/ui/sonner";
import { LanguageProvider } from "../lib/i18n";
import { fontScaleInitScript } from "../lib/font-scale";
import { colorThemeInitScript } from "../lib/color-theme";
import { brandInitScript, applyBrand, readBrand } from "../lib/brand";
import { syncThemeColor } from "../lib/theme-color";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f3f8ff" },
      { title: "Coach's Sidekick" },
      {
        name: "description",
        content:
          "An AI coaching assistant that amplifies your strategy, expertise and confidence. You're still the coach — AI just helps you do more with your game plan.",
      },
      { property: "og:title", content: "Coach's Sidekick" },
      {
        property: "og:description",
        content: "You're still the coach. AI just helps you do more with your game plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=block",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: "var(--background, #f3f8ff)" }}>
      <head>
        <HeadContent />
        {/* Apply the saved text size and color palette before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: fontScaleInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: colorThemeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: brandInitScript() }} />
        {/* No flash on load: the page stays hidden until the fonts are ready and the app has drawn, then fades in once. */}
        <style dangerouslySetInnerHTML={{ __html: "html.sk-pre body{opacity:0}body{transition:opacity .3s ease}" }} />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var d=document.documentElement;d.classList.add('sk-pre');var f=false,r=false,x=false;function go(){if(x||!(f&&r))return;x=true;requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove('sk-pre')})})}window.__skReady=function(){r=true;go()};(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){f=true;go()});setTimeout(function(){x=true;d.classList.remove('sk-pre')},3000)})();" }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    applyBrand(readBrand());
    syncThemeColor();
  }, []);
  useEffect(() => {
    (window as unknown as { __skReady?: () => void }).__skReady?.();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <HockeySkins />
        <WatermarkBackdrop />
        <div className="beta-banner-clearance relative z-10 min-h-screen pt-24 pb-24 sm:pb-12 lg:pt-0">
          <AppHeader />
          <div className="w-full px-4 lg:pr-8">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <SwipeNav>
              <Outlet />
            </SwipeNav>
            <SiteFooter />
          </div>
        </div>
        <AskCoachsSidekick />
        <FeedbackFab />
        <BetaBanner />
        <Toaster position="bottom-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
