import type { ReactNode } from "react";
import TabsNav from "./TabsNav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <TabsNav />
      <div>{children}</div>
    </div>
  );
}
