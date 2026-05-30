import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { toast } from "sonner";
import { Bell, Lock, User as UserIcon, Globe } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <h1 className="display-md">Settings</h1>
      <p className="text-body mt-2">Manage your account, security, and notification preferences.</p>

      <Card className="p-6 mt-8">
        <div className="flex items-center gap-2 mb-4"><UserIcon className="h-4 w-4 text-primary" /><h3 className="title-md">Profile</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Full name</Label><Input defaultValue={user.name} className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue={user.email} className="mt-1.5" /></div>
          <div><Label>Employee ID</Label><Input defaultValue={user.id} disabled className="mt-1.5 font-mono" /></div>
          <div><Label>Role</Label><Input defaultValue={ROLE_LABELS[user.role]} disabled className="mt-1.5" /></div>
          <div><Label>Department</Label><Input defaultValue={user.department} className="mt-1.5" /></div>
          <div><Label>Designation</Label><Input defaultValue={user.designation} className="mt-1.5" /></div>
        </div>
        <div className="mt-5 flex justify-end"><Button onClick={() => toast.success("Profile updated")}>Save changes</Button></div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4"><Lock className="h-4 w-4 text-primary" /><h3 className="title-md">Security</h3></div>
        <Row title="Two-factor authentication" desc="Require a one-time code on every sign-in." defaultChecked />
        <Separator className="my-4" />
        <Row title="Single sign-on (SAML)" desc="Sign in via your company identity provider." defaultChecked />
        <Separator className="my-4" />
        <Row title="Session timeout (30 min)" desc="Auto sign-out after inactivity." />
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" /><h3 className="title-md">Notifications</h3></div>
        <Row title="Case stage transitions" desc="Email when a case you own changes stage." defaultChecked />
        <Separator className="my-4" />
        <Row title="SLA breach alerts" desc="Notify when a case crosses its SLA." defaultChecked />
        <Separator className="my-4" />
        <Row title="Weekly digest" desc="Summary of your pending reviews every Monday." />
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4"><Globe className="h-4 w-4 text-primary" /><h3 className="title-md">Localization</h3></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Language</Label><Input defaultValue="English (Pakistan)" className="mt-1.5" /></div>
          <div><Label>Timezone</Label><Input defaultValue="Asia/Karachi (PKT)" className="mt-1.5" /></div>
        </div>
      </Card>
    </div>
  );
}

function Row({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-sm text-muted-cb mt-0.5">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
