import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Save,
  ShieldCheck,
  Star,
  UserPlus,
  CalendarCheck,
  Wrench,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";
import adminSystemService from "../../services/adminSystemService";
import SettingToggle from "../../components/admin/SettingToggle";

const defaults = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  allowNewBookings: true,
  enableNotifications: true,
  enableReviews: true,
};

const settingItems = [
  {
    key: "maintenanceMode",
    label: "Maintenance Mode",
    description: "Temporarily restrict normal platform operations.",
    icon: Wrench,
    tone: "amber",
  },
  {
    key: "allowNewRegistrations",
    label: "Student Registrations",
    description: "Allow new students to create accounts.",
    icon: UserPlus,
    tone: "indigo",
  },
  {
    key: "allowNewBookings",
    label: "New Bookings",
    description: "Allow students to create new hostel bookings.",
    icon: CalendarCheck,
    tone: "blue",
  },
  {
    key: "enableNotifications",
    label: "Notifications",
    description: "Enable platform notification delivery.",
    icon: Bell,
    tone: "violet",
  },
  {
    key: "enableReviews",
    label: "Reviews",
    description: "Allow eligible students to submit reviews.",
    icon: Star,
    tone: "emerald",
  },
];

const toneClasses = {
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
};

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    );
  });

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          localStorage.getItem("theme") === "dark"
      );
    };

    window.addEventListener("studnest-theme-changed", syncTheme);
    window.addEventListener("storage", syncTheme);
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("studnest-theme-changed", syncTheme);
      window.removeEventListener("storage", syncTheme);
      observer.disconnect();
    };
  }, []);

  const loadSettings = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      setMessage("");

      const res = await adminSystemService.getSettings();
      const data = res?.data?.settings || res?.data || res?.settings || {};
      setSettings({ ...defaults, ...data });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load settings."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage("");
    setError("");
  };

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await adminSystemService.updateSettings(settings);
      setMessage("System settings updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update settings."));
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = settingItems.filter((item) => settings[item.key]).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-white dark:bg-slate-900" />
          <div className="h-96 rounded-2xl bg-white dark:bg-slate-900" />
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Loading system settings...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-4 w-4" /> Admin Control Center
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage platform-wide settings and control how students use StudNest.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadSettings(true)}
            disabled={refreshing || saving}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh settings
          </button>
        </motion.header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enabled controls</p>
                <p className="mt-2 text-3xl font-bold">{enabledCount}<span className="ml-1 text-base font-medium text-slate-400">/ {settingItems.length}</span></p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Current state of your platform controls</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Platform availability</p>
                <p className="mt-2 text-xl font-bold">{settings.maintenanceMode ? "Maintenance mode" : "Operational"}</p>
              </div>
              <div className={`rounded-2xl p-3 ${settings.maintenanceMode ? "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"}`}>
                {settings.maintenanceMode ? <Wrench className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Based on the saved maintenance setting</p>
          </div>
        </section>

        {message && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{message}</span>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button type="button" onClick={() => loadSettings()} className="shrink-0 font-semibold underline underline-offset-4">Retry</button>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold">Platform controls</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Changes are applied after you save.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 px-4 dark:divide-slate-800 sm:px-6">
            {settingItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <div className="shrink-0 sm:min-w-28 sm:text-right">
                    <SettingToggle
                      label={item.label}
                      description={item.description}
                      checked={Boolean(settings[item.key])}
                      onChange={(value) => updateSetting(item.key, value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {settings.maintenanceMode && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-200">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Maintenance mode is enabled</p>
              <p className="mt-1 leading-5 text-amber-800 dark:text-amber-300/90">Confirm that your backend enforces this setting. Changing this switch in the UI alone does not automatically block platform operations.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Review your changes before saving them to the system.</p>
          <button
            type="button"
            disabled={saving || refreshing}
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-indigo-900/60"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving settings..." : "Save settings"}
          </button>
        </div>
      </div>
    </main>
  );
}
