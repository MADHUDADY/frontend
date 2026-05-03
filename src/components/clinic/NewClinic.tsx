import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clinicAPI } from "../../services/api";

const NewClinic = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    COMPANYNAME:     "",
    COMPANYADDRESS:  "",
    COMPANYADDRESS2: "",
    KIOSKMESSAGE1:   "",
    KIOSKMESSAGE2:   "",
  });

  const [existingId, setExistingId] = useState<number | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await clinicAPI.getDetails();
        const c = res.data.data;
        if (c) {
          setExistingId(c.ID);
          setForm({
            COMPANYNAME:     c.COMPANYNAME     || "",
            COMPANYADDRESS:  c.COMPANYADDRESS  || "",
            COMPANYADDRESS2: c.COMPANYADDRESS2 || "",
            KIOSKMESSAGE1:   c.KIOSKMESSAGE1   || "",
            KIOSKMESSAGE2:   c.KIOSKMESSAGE2   || "",
          });
        }
      } catch {
        // no existing clinic — new entry
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.COMPANYNAME.trim()) {
      setError("Clinic name is required");
      return;
    }
    try {
      setSaving(true);
      setError("");
      if (existingId) {
        await clinicAPI.updateDetails(existingId, {
          COMPANYNAME:     form.COMPANYNAME,
          COMPANYADDRESS:  form.COMPANYADDRESS,
          COMPANYADDRESS2: form.COMPANYADDRESS2,   // ← FIX: was missing before
          KIOSKMESSAGE1:   form.KIOSKMESSAGE1,
          KIOSKMESSAGE2:   form.KIOSKMESSAGE2,
        });
      }
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/ViewClinic"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Save failed. Check backend.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (err?: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white transition ${
      err ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400" style={{ animation: "fadeIn .4s ease" }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
        ⏳ Loading clinic data...
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm"
          style={{ animation: "pop .4s ease" }}>
          <style>{`@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}`}</style>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <h2 className="text-lg font-bold text-green-700">Clinic Saved!</h2>
          <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen" style={{ animation: "slideIn .35s ease" }}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {existingId ? "✏️ Update Clinic Details" : "🏥 New Clinic"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {existingId ? "Edit your clinic information" : "Add new clinic to the system"}
            </p>
          </div>
          <button onClick={() => navigate("/dashboard/ViewClinic")}
            className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
            ← View Clinic
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">

            <h3 className="text-base font-semibold text-gray-800 border-b pb-3">
              🏥 Clinic Information
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Clinic Name <span className="text-red-500">*</span>
              </label>
              <input name="COMPANYNAME" value={form.COMPANYNAME}
                onChange={handleChange}
                placeholder="e.g. Paradise Medical Center"
                className={inputCls(!form.COMPANYNAME && !!error)} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">📞 Phone Number</label>
                <input name="COMPANYADDRESS" value={form.COMPANYADDRESS}
                  onChange={handleChange}
                  placeholder="e.g. Phone: 04 561 5645"
                  className={inputCls()} />
                <p className="text-xs text-gray-400 mt-1">Shown on tickets &amp; kiosk</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">📍 Address</label>
                <input name="COMPANYADDRESS2" value={form.COMPANYADDRESS2}
                  onChange={handleChange}
                  placeholder="e.g. Plot 333, Satwa, Dubai"
                  className={inputCls()} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">📺 Kiosk Display Messages</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kiosk Message 1</label>
                  <input name="KIOSKMESSAGE1" value={form.KIOSKMESSAGE1}
                    onChange={handleChange}
                    placeholder="Welcome message for patients"
                    className={inputCls()} />
                  <p className="text-xs text-gray-400 mt-1">Shown on patient-facing kiosk</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kiosk Message 2</label>
                  <input name="KIOSKMESSAGE2" value={form.KIOSKMESSAGE2}
                    onChange={handleChange}
                    placeholder="Secondary kiosk message"
                    className={inputCls()} />
                </div>
              </div>
            </div>

            {existingId && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                ℹ️ <strong>Read-only:</strong> Company ID is fixed by the system and cannot be changed.
              </div>
            )}

          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button type="button"
              onClick={() => navigate("/dashboard/ViewClinic")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-7 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 text-sm font-semibold transition">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...</>
              ) : existingId ? "💾 Update Clinic" : "💾 Save Clinic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClinic;