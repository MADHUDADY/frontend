import React, { useState, useEffect } from "react";
import { Pencil, RefreshCw } from "lucide-react";
import { clinicAPI } from "../../services/api";

const ViewClinic = () => {
  const [clinic,   setClinic]  = useState<any | null>(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");
  const [editing,  setEditing] = useState(false);
  const [saving,   setSaving]  = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saved,    setSaved]   = useState(false);

  useEffect(() => { fetchClinic(); }, []);

  const fetchClinic = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await clinicAPI.getDetails();
      setClinic(res.data.data);
      setEditData(res.data.data);
    } catch (err: any) {
      setError(`Failed to load clinic: ${err?.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await clinicAPI.updateDetails(clinic.ID, {
        COMPANYNAME:     editData.COMPANYNAME,
        COMPANYADDRESS:  editData.COMPANYADDRESS,
        COMPANYADDRESS2: editData.COMPANYADDRESS2,   // ← NEW
        KIOSKMESSAGE1:   editData.KIOSKMESSAGE1,
        KIOSKMESSAGE2:   editData.KIOSKMESSAGE2,
      });
      setClinic({ ...clinic, ...editData });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Save failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Clinic Details</h1>
        <button onClick={fetchClinic}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-xl p-16 text-center text-gray-500">
          ⏳ Loading clinic from database...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 text-sm">
          ❌ {error}
          <button onClick={fetchClinic} className="ml-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs">
            Retry
          </button>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm text-center">
          ✅ Clinic details updated successfully!
        </div>
      )}

      {!loading && !error && clinic && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{clinic.COMPANYNAME}</h2>
                <p className="text-indigo-200 text-sm mt-1">{clinic.COMPANYADDRESS}</p>
                {clinic.COMPANYADDRESS2 && (
                  <p className="text-indigo-200 text-sm">{clinic.COMPANYADDRESS2}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                clinic.ACTIVE === "Y" ? "bg-green-400 text-white" : "bg-red-400 text-white"
              }`}>
                {clinic.ACTIVE === "Y" ? "🟢 Active" : "🔴 Inactive"}
              </span>
            </div>
          </div>

          {/* Details grid */}
          {!editing ? (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  { label: "Company Name",    value: clinic.COMPANYNAME },
                  { label: "Company ID",      value: clinic.COMPANYID },
                  { label: "Phone / Address", value: clinic.COMPANYADDRESS },
                  { label: "Address 2",       value: clinic.COMPANYADDRESS2 || "—" },  // ← shown
                  { label: "Kiosk Message 1", value: clinic.KIOSKMESSAGE1  || "—" },
                  { label: "Kiosk Message 2", value: clinic.KIOSKMESSAGE2  || "—" },
                  { label: "Print Language",  value: clinic.PRINTLANGUAGE  || "—" },
                  { label: "Backup Expiry",   value: clinic.BACKUPEXPIRY
                      ? new Date(clinic.BACKUPEXPIRY).toLocaleDateString() : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b pb-3">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                  <Pencil size={14} /> Edit Clinic
                </button>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Clinic Details</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input value={editData.COMPANYNAME || ""}
                    onChange={(e) => setEditData({ ...editData, COMPANYNAME: e.target.value })}
                    className={inputCls} placeholder="Enter company name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">📞 Phone / Address</label>
                  <input value={editData.COMPANYADDRESS || ""}
                    onChange={(e) => setEditData({ ...editData, COMPANYADDRESS: e.target.value })}
                    className={inputCls} placeholder="e.g. Phone: 04 561 5645" />
                </div>

                {/* COMPANYADDRESS2 — now editable */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">📍 Address 2</label>
                  <input value={editData.COMPANYADDRESS2 || ""}
                    onChange={(e) => setEditData({ ...editData, COMPANYADDRESS2: e.target.value })}
                    className={inputCls} placeholder="e.g. Plot 333, Satwa, Dubai" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kiosk Message 1</label>
                  <input value={editData.KIOSKMESSAGE1 || ""}
                    onChange={(e) => setEditData({ ...editData, KIOSKMESSAGE1: e.target.value })}
                    className={inputCls} placeholder="Enter message 1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kiosk Message 2</label>
                  <input value={editData.KIOSKMESSAGE2 || ""}
                    onChange={(e) => setEditData({ ...editData, KIOSKMESSAGE2: e.target.value })}
                    className={inputCls} placeholder="Enter message 2" />
                </div>

              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditing(false)}
                  className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !clinic && (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500">
          No clinic data found in database.
        </div>
      )}
    </div>
  );
};

export default ViewClinic;