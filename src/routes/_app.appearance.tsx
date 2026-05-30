import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/appearance")({ component: AppearancePage });

const ACCENTS = [
  { id: "blue", label: "Coinbase Blue", color: "#0052ff" },
  { id: "green", label: "Emerald", color: "#05b169" },
  { id: "amber", label: "Amber", color: "#f4b000" },
  { id: "red", label: "Crimson", color: "#cf202f" },
  { id: "violet", label: "Violet", color: "#7c3aed" },
  { id: "graphite", label: "Graphite", color: "#0a0b0d" },
];

function applyTheme(mode: string) {
  const root = document.documentElement;
  const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && sys);
  root.classList.toggle("dark", dark);
}

function AppearancePage() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("appearance.theme") || "light");
  const [accent, setAccent] = useState<string>(() => localStorage.getItem("appearance.accent") || "blue");
  const [density, setDensity] = useState<number>(() => Number(localStorage.getItem("appearance.density") || 100));

  useEffect(() => {
    localStorage.setItem("appearance.theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("appearance.accent", accent);
    const color = ACCENTS.find((a) => a.id === accent)?.color;
    if (color) document.documentElement.style.setProperty("--primary", color);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("appearance.density", String(density));
    document.documentElement.style.fontSize = `${density}%`;
  }, [density]);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <h1 className="display-md">Appearance</h1>
      <p className="text-body mt-2">Personalize how Promote looks. Changes are saved instantly.</p>

      <Card className="p-6 mt-8">
        <h3 className="title-md">Theme</h3>
        <p className="text-sm text-muted-cb mt-1">Pick a mode for the interface.</p>
        <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          {[
            { v: "light", l: "Light", icon: Sun },
            { v: "dark", l: "Dark", icon: Moon },
            { v: "system", l: "System", icon: Monitor },
          ].map((o) => (
            <Label
              key={o.v}
              className={cn(
                "border rounded-2xl p-5 cursor-pointer transition-colors flex items-center gap-3",
                theme === o.v ? "border-primary bg-primary/5" : "border-hairline hover:bg-surface-soft",
              )}
            >
              <RadioGroupItem value={o.v} className="sr-only" />
              <o.icon className="h-5 w-5" />
              <span className="font-medium">{o.l}</span>
            </Label>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="title-md">Accent color</h3>
        <p className="text-sm text-muted-cb mt-1">Drives buttons, links, and key highlights.</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={cn(
                "rounded-2xl p-3 border flex flex-col items-center gap-2 transition-colors",
                accent === a.id ? "border-ink" : "border-hairline hover:bg-surface-soft",
              )}
            >
              <span className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: a.color }}>
                {accent === a.id && <Check className="h-5 w-5 text-white" />}
              </span>
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="title-md">Density</h3>
        <p className="text-sm text-muted-cb mt-1">Adjust the base font size across the app.</p>
        <div className="mt-5 flex items-center gap-4">
          <span className="text-xs text-muted-cb">Compact</span>
          <Slider value={[density]} min={85} max={120} step={5} onValueChange={(v) => setDensity(v[0])} className="flex-1" />
          <span className="text-xs text-muted-cb">Spacious</span>
          <span className="tabular text-sm w-12 text-right">{density}%</span>
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Appearance saved")}>Done</Button>
      </div>
    </div>
  );
}
