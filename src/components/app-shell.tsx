import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Settings, Palette } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABELS, ROLE_NAV } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const GLOBAL_NAV = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/appearance", label: "Appearance", icon: Palette },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const nav = ROLE_NAV[user.role];

  return (
    <div className="h-screen flex bg-canvas overflow-hidden">
      {/* Sidebar — fixed full-height */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-hairline bg-canvas h-screen sticky top-0">
        <div className="h-16 px-6 flex items-center gap-2 border-b border-hairline shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="title-md tracking-tight">Promote</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition-colors",
                  active ? "bg-surface-strong text-ink" : "text-body hover:bg-surface-soft hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-hairline">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }}>
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs text-muted-cb truncate">{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start mt-1" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 flex items-center justify-between border-b border-hairline bg-canvas">
          <div className="flex items-center gap-3">
            <Badge variant="muted" className="font-mono normal-case tracking-normal">{user.id}</Badge>
            <span className="text-sm text-muted-cb">{user.department}</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 min-w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                {[
                  { msg: "Case PC-1003 requires interview panel assignment", time: "10m ago" },
                  { msg: "Cycle March 2026 submission deadline in 14 days", time: "2h ago" },
                  { msg: "New achievement submitted for review", time: "Yesterday" },
                ].map((n, i) => (
                  <div key={i} className="p-3 rounded-md bg-surface-soft border border-hairline-soft">
                    <p className="text-sm text-ink">{n.msg}</p>
                    <p className="text-xs text-muted-cb mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
