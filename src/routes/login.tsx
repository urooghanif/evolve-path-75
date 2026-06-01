import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Sparkles, ShieldCheck, Workflow } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([
    "hr_admin", "employee", "delivery_lead", "line_manager", "hod",
    "panel_member", "final_authority", "c_level", "system_admin", "auditor",
  ]),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

const QUICK_ROLES: { role: Role; tag: string }[] = [
  { role: "hr_admin", tag: "HRBP" },
  { role: "employee", tag: "Staff" },
  { role: "delivery_lead", tag: "DL" },
  { role: "line_manager", tag: "LM" },
  { role: "hod", tag: "HOD" },
  { role: "final_authority", tag: "Final" },
  { role: "c_level", tag: "C-Level" },
];

function Login() {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@company.com.pk", password: "demodemo", role: "hr_admin", remember: true },
  });

  const onSubmit = (v: FormValues) => {
    loginAs(v.role as Role);
    toast.success(`Signed in as ${ROLE_LABELS[v.role as Role]}`);
    navigate({ to: "/dashboard", replace: true });
  };

  const activeRole = watch("role");

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#eef0f4] flex items-center justify-center p-3 lg:p-6">
      <div className="w-full max-w-[1240px] h-full max-h-[860px] grid lg:grid-cols-2 bg-canvas rounded-[28px] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] overflow-hidden border border-hairline">
        {/* LEFT — Form */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold">P</div>
            <div>
              <div className="title-md leading-none">Promote</div>
              <div className="text-[11px] text-muted-cb uppercase tracking-wider">HRMS · PK</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
            <h1 className="display-lg">Sign in</h1>
            <p className="text-body text-sm mt-2">Welcome back — choose your role to enter the portal.</p>

            {/* Quick role chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setValue("role", r.role)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                    activeRole === r.role
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-soft text-body border-hairline hover:border-primary/40"
                  }`}
                >
                  {r.tag}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" className="h-12 rounded-xl border-hairline" placeholder="you@company.com.pk" {...register("email")} />
              </Field>

              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    className="h-12 rounded-xl border-hairline pr-11"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-cb hover:text-ink"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Role">
                <Select value={watch("role")} onValueChange={(v) => setValue("role", v as Role)}>
                  <SelectTrigger className="h-12 rounded-xl border-hairline">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                      <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={!!watch("remember")}
                    onCheckedChange={(c) => setValue("remember", !!c)}
                  />
                  <span className="text-sm text-body">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Reset link would be emailed in production.")}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl h-12" disabled={isSubmitting}>
                Sign in
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-hairline" />
                <span className="text-xs text-muted-cb uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 h-px bg-hairline" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Microsoft", icon: <MsIcon /> },
                  { name: "Google", icon: <GIcon /> },
                  { name: "SSO", icon: <ShieldCheck className="h-5 w-5 text-primary" /> },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => toast.info(`${p.name} SSO would launch here.`)}
                    className="h-12 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    {p.icon} <span className="hidden sm:inline">{p.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-cb text-center pt-2">
                Don't have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">Request access</Link>
              </p>
            </form>
          </div>

          <div className="text-xs text-muted-cb mt-6 flex items-center justify-between">
            <span>© 2026 Promote</span>
            <span>Demo environment · Pakistan</span>
          </div>
        </div>

        {/* RIGHT — Visual */}
        <div className="relative hidden lg:block overflow-hidden bg-[#3a3df5] text-on-dark">
          {/* Animated blobs */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#a5b0ff,transparent_60%)] blur-2xl animate-[float_14s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_60%_40%,#7c83ff,transparent_55%)] blur-2xl animate-[float_18s_ease-in-out_infinite_reverse]" />
            <div className="absolute -bottom-32 left-1/4 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle_at_40%_60%,#c7cdff,transparent_60%)] blur-2xl animate-[float_22s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1de8]/50 via-[#3a3df5]/30 to-[#0d10b8]/60" />
            {/* Grain */}
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
              }}
            />
          </div>

          <div className="relative h-full p-8 xl:p-12 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold text-white border border-white/30">
                <Sparkles className="h-3.5 w-3.5" /> AI-assisted promotion workflows
              </div>
              <h2 className="display-xl text-white mt-6 leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                Start your<br />promotion<br />
                <span className="italic font-light">journey with us.</span>
              </h2>
              <p className="mt-5 text-white/90 max-w-md leading-relaxed">
                One disciplined workflow for eligibility, achievements, evaluations and final approvals — auditable end-to-end across all nine roles.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-3">
              {[
                { i: <Workflow className="h-4 w-4" />, t: "9 role-based workspaces", s: "HR → Employee → DL → LM → HOD → Panel → Final" },
                { i: <Sparkles className="h-4 w-4" />, t: "AI scoring & rewrite", s: "Score achievements and suggest skill gaps" },
                { i: <ShieldCheck className="h-4 w-4" />, t: "Immutable audit trail", s: "Every decision tracked, every change logged" },
              ].map((f) => (
                <div key={f.t} className="flex items-center gap-3 p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                  <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center text-white">{f.i}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{f.t}</div>
                    <div className="text-xs text-white/85 truncate">{f.s}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-white/85">
              <span>Trusted by HR teams in Pakistan</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold tracking-widest text-white">SOC2</span>
                <span>·</span>
                <span className="font-semibold tracking-widest text-white">ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-30px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-cb font-semibold">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

function GIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 11v3.2h5.3c-.2 1.4-1.7 4-5.3 4-3.2 0-5.8-2.6-5.8-5.9S8.8 6.4 12 6.4c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.9 14.5 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.9-.1-1.1H12z"/>
    </svg>
  );
}
function MsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <rect x="2" y="2" width="9" height="9" fill="#F25022"/><rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/><rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}
