import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Promote — HRMS Promotion Management" },
      { name: "description", content: "Enterprise promotion management portal for HR cycles, eligibility, evaluations, and approvals." },
      { property: "og:title", content: "Promote — HRMS Promotion Management" },
      { name: "twitter:title", content: "Promote — HRMS Promotion Management" },
      { property: "og:description", content: "Enterprise promotion management portal for HR cycles, eligibility, evaluations, and approvals." },
      { name: "twitter:description", content: "Enterprise promotion management portal for HR cycles, eligibility, evaluations, and approvals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8467f715-2785-436b-ae35-fba103c5a5a3/id-preview-1b5747e0--9ab69e64-b395-41d4-aa39-ea634e619bff.lovable.app-1780321999155.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8467f715-2785-436b-ae35-fba103c5a5a3/id-preview-1b5747e0--9ab69e64-b395-41d4-aa39-ea634e619bff.lovable.app-1780321999155.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center">
        <h1 className="display-lg">404</h1>
        <p className="text-body mt-2">Page not found</p>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
