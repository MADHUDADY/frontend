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

  // Ticket config state
  const [ticketMode, setTicketMode] = useState<"sms"|"print"|"both">("print");

  useEffect(() => {
    fetchClinic();
    // Load saved ticket config
    const cfg = localStorage.getItem("ticketConfig");
    if (cfg) setTicketMode(JSON.parse(cfg).mode || "print");
  }, []);

  const fetchClinic = async () => {
    try {
      setLoading(true); setError("");
      const res = await clinicAPI.getDetails();
      setClinic(res.data.data);
      setEditData(res.data.data);
    } catch (err: any) {
      setError(`Failed to load: ${err?.response?.data?.message || err.message}`);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await clinicAPI.update(clinic.ID, {
        COMPANYNAME:     editData.COMPANYNAME,
        COMPANYADDRESS:  editData.COMPANYADDRESS,
        COMPANYADDRESS2: editData.COMPANYADDRESS2,
        KIOSKMESSAGE1:   editData.KIOSKMESSAGE1,
        KIOSKMESSAGE2:   editData.KIOSKMESSAGE2,
      });
      // Save ticket mode to localStorage (clinic level config)
      localStorage.setItem("ticketConfig", JSON.stringify({ mode: ticketMode }));
      setClinic({ ...clinic, ...editData });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Save failed: " + (err?.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm";

  const modeBtnCls = (m: string) =>
    `flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition ${
      ticketMode === m
        ? "border-indigo-600 bg-indigo-600 text-white"
        : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
    }`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Clinic Details</h1>
        <button onClick={fetchClinic}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && <div className="bg-white rounded-xl p-16 text-center text-gray-500">⏳ Loading...</div>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 text-sm">
          ❌ {error}
          <button onClick={fetchClinic} className="ml-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs">Retry</button>
        </div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm text-center">
          ✅ Clinic details updated successfully!
        </div>
      )}

      {!loading && !error && clinic && (
        <>
          {/* ── Clinic Card ── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{clinic.COMPANYNAME}</h2>
                  <p className="text-indigo-200 text-sm mt-1">{clinic.COMPANYADDRESS}</p>
                  {clinic.COMPANYADDRESS2 && <p className="text-indigo-200 text-sm">{clinic.COMPANYADDRESS2}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${clinic.ACTIVE==="Y"?"bg-green-400":"bg-red-400"} text-white`}>
                  {clinic.ACTIVE==="Y" ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </div>
            </div>

            {!editing ? (
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {[
                    { label:"Company Name",    value:clinic.COMPANYNAME },
                    { label:"Company ID",      value:clinic.COMPANYID },
                    { label:"Phone / Address", value:clinic.COMPANYADDRESS },
                    { label:"Address 2",       value:clinic.COMPANYADDRESS2||"—" },
                    { label:"Kiosk Message 1", value:clinic.KIOSKMESSAGE1||"—" },
                    { label:"Kiosk Message 2", value:clinic.KIOSKMESSAGE2||"—" },
                    { label:"Print Language",  value:clinic.PRINTLANGUAGE||"—" },
                    { label:"Backup Expiry",   value:clinic.BACKUPEXPIRY?new Date(clinic.BACKUPEXPIRY).toLocaleDateString():"—" },
                  ].map(({label,value}) => (
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
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Clinic Details</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input value={editData.COMPANYNAME||""} onChange={e=>setEditData({...editData,COMPANYNAME:e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">📞 Phone / Address</label>
                    <input value={editData.COMPANYADDRESS||""} onChange={e=>setEditData({...editData,COMPANYADDRESS:e.target.value})} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">📍 Address 2</label>
                    <input value={editData.COMPANYADDRESS2||""} onChange={e=>setEditData({...editData,COMPANYADDRESS2:e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kiosk Message 1</label>
                    <input value={editData.KIOSKMESSAGE1||""} onChange={e=>setEditData({...editData,KIOSKMESSAGE1:e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kiosk Message 2</label>
                    <input value={editData.KIOSKMESSAGE2||""} onChange={e=>setEditData({...editData,KIOSKMESSAGE2:e.target.value})} className={inputCls} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={()=>setEditing(false)} className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-60">
                    {saving?"Saving...":"Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Ticket Configuration — Clinic Level ── */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl">🎫</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Ticket Configuration</h2>
                <p className="text-sm text-gray-500">Clinic level — controls how tokens are issued to patients</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Token Delivery Mode</p>
              <div className="flex gap-3">
                <button className={modeBtnCls("sms")} onClick={() => setTicketMode("sms")}>
                  📱 SMS Only
                </button>
                <button className={modeBtnCls("print")} onClick={() => setTicketMode("print")}>
                  🖨️ Print Only
                </button>
                <button className={modeBtnCls("both")} onClick={() => setTicketMode("both")}>
                  📱🖨️ Both
                </button>
              </div>

              {/* Description */}
              <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                {ticketMode === "sms" && (
                  <p className="text-sm text-gray-600">📱 <strong>SMS Only</strong> — Token number will be sent via SMS to patient's mobile number automatically.</p>
                )}
                {ticketMode === "print" && (
                  <p className="text-sm text-gray-600">🖨️ <strong>Print Only</strong> — Patient can print the ticket at the kiosk. No SMS will be sent.</p>
                )}
                {ticketMode === "both" && (
                  <p className="text-sm text-gray-600">📱🖨️ <strong>Both</strong> — Token will be sent via SMS AND patient can print the ticket at the kiosk.</p>
                )}
              </div>
            </div>

            {/* Current saved config */}
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
              <div>
                <p className="text-sm font-semibold text-indigo-800">Current Configuration</p>
                <p className="text-xs text-indigo-600 mt-0.5">
                  {ticketMode === "sms"   && "SMS Only — tokens sent via SMS"}
                  {ticketMode === "print" && "Print Only — patients print at kiosk"}
                  {ticketMode === "both"  && "Both — SMS + Print at kiosk"}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                ticketMode === "sms"   ? "bg-blue-100 text-blue-700" :
                ticketMode === "print" ? "bg-green-100 text-green-700" :
                "bg-purple-100 text-purple-700"
              }`}>
                {ticketMode === "sms" ? "📱 SMS" : ticketMode === "print" ? "🖨️ Print" : "📱🖨️ Both"}
              </span>
            </div>

            <div className="flex justify-end">
              <button onClick={() => {
                localStorage.setItem("ticketConfig", JSON.stringify({ mode: ticketMode }));
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold">
                💾 Save Configuration
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewClinic;