import { useTheme } from "@/hooks/use-theme";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border transition-colors duration-300 dark:bg-card-dark dark:border-border-dark">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              Toggle between light and dark theme
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="switch-root"
          />
        </div>
      </div>
    </div>
  );
}