import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  component: Login,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([
    "hr_admin", "employee", "delivery_lead", "line_manager", "hod",
    "panel_member", "final_authority", "system_admin", "auditor",
  ]),
});
type FormValues = z.infer<typeof schema>;

function Login() {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@company.com", password: "demodemo", role: "hr_admin" },
  });

  const onSubmit = (v: FormValues) => {
    loginAs(v.role as Role);
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-1 bg-surface-dark text-on-dark p-16 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">P</div>
          <span className="title-md text-on-dark">Promote</span>
        </div>
        <div className="max-w-lg">
          <h1 className="display-xl text-on-dark">Promotions, decided with discipline.</h1>
          <p className="mt-6 text-on-dark-soft text-lg leading-relaxed">
            One workflow for eligibility, achievements, evaluations, panels, and final approvals — auditable end-to-end.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { k: "9", v: "Roles" },
              { k: "March / Oct", v: "Cycles" },
              { k: "100%", v: "Audited" },
            ].map((s) => (
              <div key={s.v}>
                <div className="tabular text-2xl text-on-dark">{s.k}</div>
                <div className="text-xs text-on-dark-soft mt-1 uppercase tracking-wide">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-on-dark-soft">© 2026 Promote · Demo environment</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-canvas">
        <Card className="w-full max-w-md p-8 border-hairline">
          <h2 className="display-sm">Sign in</h2>
          <p className="text-body text-sm mt-2">Demo portal — pick any role to explore.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-cb">Email</Label>
              <Input id="email" type="email" className="mt-1.5 h-12 rounded-md" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-cb">Password</Label>
              <Input id="password" type="password" className="mt-1.5 h-12 rounded-md" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-cb">Role</Label>
              <Select value={watch("role")} onValueChange={(v) => setValue("role", v as Role)}>
                <SelectTrigger className="mt-1.5 h-12 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="w-full">Sign in</Button>
            <p className="text-xs text-muted-cb text-center">Switch roles anytime from the sidebar to demo every workflow.</p>
          </form>
        </Card>
      </div>
    </div>
  );
}
