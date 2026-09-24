import { useEffect, useState } from "react";
import adminSystemService from "../../services/adminSystemService";
import SettingToggle from "../../components/admin/SettingToggle";

const defaults = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  allowNewBookings: true,
  enableNotifications: true,
  enableReviews: true,
};

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminSystemService.getSettings()
      .then((res) => {
        const data = res.data || res.settings || {};
        setSettings({ ...defaults, ...data });
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await adminSystemService.updateSettings(settings);
      setMessage("System settings updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading system settings...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">System Management</h1>
        <p className="text-sm text-gray-500">
          Control platform-wide StudNest behavior.
        </p>
      </div>

      {message && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <section className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">Platform Controls</h2>

        <SettingToggle
          label="Maintenance Mode"
          description="Temporarily restrict normal platform operations."
          checked={settings.maintenanceMode}
          onChange={(value) => setSettings({ ...settings, maintenanceMode: value })}
        />

        <SettingToggle
          label="Student Registrations"
          description="Allow new students to create accounts."
          checked={settings.allowNewRegistrations}
          onChange={(value) => setSettings({ ...settings, allowNewRegistrations: value })}
        />

        <SettingToggle
          label="New Bookings"
          description="Allow students to create new hostel bookings."
          checked={settings.allowNewBookings}
          onChange={(value) => setSettings({ ...settings, allowNewBookings: value })}
        />

        <SettingToggle
          label="Notifications"
          description="Enable platform notification delivery."
          checked={settings.enableNotifications}
          onChange={(value) => setSettings({ ...settings, enableNotifications: value })}
        />

        <SettingToggle
          label="Reviews"
          description="Allow eligible students to submit reviews."
          checked={settings.enableReviews}
          onChange={(value) => setSettings({ ...settings, enableReviews: value })}
        />
      </section>

      {settings.maintenanceMode && (
        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          Maintenance mode is enabled. Make sure your backend actually enforces this
          setting before relying on this UI.
        </div>
      )}

      <button
        disabled={saving}
        onClick={save}
        className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
