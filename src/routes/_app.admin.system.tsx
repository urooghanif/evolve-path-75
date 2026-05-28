import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, KeyRound, Webhook, Database, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/system")({ component: SystemPage });

function SystemPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <p className="caption-strong text-muted-cb">System Administrator</p>
        <h1 className="display-md mt-2">System settings</h1>
        <p className="text-body mt-2">SSO, security policy, integrations, and platform health.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Card className="p-5"><div className="caption-strong text-muted-cb">Uptime (30d)</div><div className="tabular text-2xl mt-2 text-success">99.98%</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">Active sessions</div><div className="tabular text-2xl mt-2">412</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">API p95</div><div className="tabular text-2xl mt-2">128ms</div></Card>
        <Card className="p-5"><div className="caption-strong text-muted-cb">Storage used</div><div className="tabular text-2xl mt-2">38.2 GB</div></Card>
      </div>

      <Tabs defaultValue="security">
        <TabsList className="bg-surface-soft p-1 rounded-full">
          {[["security", "Security"], ["sso", "SSO & SCIM"], ["integrations", "Integrations"], ["health", "Health"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-white px-4 h-9">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="security" className="mt-6 space-y-4">
          <Card className="p-6">
            <h3 className="title-md flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Authentication</h3>
            <div className="mt-5 space-y-4">
              {[
                ["Require MFA for all users", true],
                ["Require MFA for HR Admin & Final Authority", true],
                ["Block sign-in from unmanaged devices", false],
                ["Session timeout after 30 minutes", true],
                ["Enforce IP allowlist (corporate VPN)", false],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between"><div className="text-sm">{l}</div><Switch defaultChecked={v as boolean} /></div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="title-md">Password policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div><Label>Min length</Label><Input type="number" defaultValue={12} className="mt-2" /></div>
              <div><Label>Rotate every (days)</Label><Input type="number" defaultValue={90} className="mt-2" /></div>
              <div><Label>History to prevent reuse</Label><Input type="number" defaultValue={5} className="mt-2" /></div>
            </div>
            <Button className="mt-5" onClick={() => toast.success("Security policy saved")}><Save className="h-4 w-4" /> Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="mt-6 space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="title-md flex items-center gap-2"><KeyRound className="h-5 w-5" /> SAML SSO</h3>
                <p className="text-sm text-body mt-1">Connected to Okta · synced 2 minutes ago</p>
              </div>
              <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Entity ID</Label><Input defaultValue="urn:promote:saml" className="mt-2 font-mono text-xs" readOnly /></div>
              <div><Label>ACS URL</Label><Input defaultValue="https://promote.co/auth/saml/callback" className="mt-2 font-mono text-xs" readOnly /></div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="title-md">SCIM provisioning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div><div className="text-xs text-muted-cb">Users provisioned</div><div className="tabular text-2xl mt-1">412</div></div>
              <div><div className="text-xs text-muted-cb">Groups synced</div><div className="tabular text-2xl mt-1">28</div></div>
              <div><div className="text-xs text-muted-cb">Last sync</div><div className="tabular text-lg mt-1">2 min ago</div></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Workday HRIS", icon: Database, status: "Connected", desc: "Employee master · 412 records" },
            { name: "Slack notifications", icon: Webhook, status: "Connected", desc: "#promotions channel" },
            { name: "DocuSign", icon: Webhook, status: "Connected", desc: "Letter signing workflow" },
            { name: "BI export (Snowflake)", icon: Database, status: "Disconnected", desc: "Nightly outcomes warehouse" },
          ].map((i) => (
            <Card key={i.name} className="p-6">
              <div className="flex justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-surface-strong flex items-center justify-center"><i.icon className="h-5 w-5" /></div><div><h4 className="font-semibold">{i.name}</h4><p className="text-xs text-muted-cb mt-0.5">{i.desc}</p></div></div>{i.status === "Connected" ? <Badge variant="success">Connected</Badge> : <Badge variant="muted">Off</Badge>}</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">{i.status === "Connected" ? "Manage" : "Connect"}</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <Card className="p-6">
            <h3 className="title-md flex items-center gap-2"><Activity className="h-5 w-5" /> Service health</h3>
            <div className="mt-5 space-y-3">
              {[
                ["Web app", "operational"],
                ["API gateway", "operational"],
                ["Database (primary)", "operational"],
                ["AI rewrite service", "degraded"],
                ["Letter generation", "operational"],
                ["Email worker", "operational"],
              ].map(([n, s]) => (
                <div key={n} className="flex items-center justify-between p-3 rounded-md border border-hairline-soft">
                  <span className="text-sm font-medium">{n}</span>
                  {s === "operational" ? <Badge variant="success">Operational</Badge> : <Badge variant="warning">Degraded</Badge>}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
