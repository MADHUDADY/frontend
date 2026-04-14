import React from 'react'

const NewClinic = () => {
  return (
    <div>
      {/* ================= Clinic Details Section ================= */}
<div className="bg-gray-50 p-6 rounded-xl mb-8 border">
  <h2 className="text-lg font-semibold mb-6">Clinic Details</h2>

  <div className="grid md:grid-cols-2 gap-6">
    
    {/* Clinic Name */}
    <div>
      <label className="block text-sm font-medium mb-2">
        Clinic Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter clinic name"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Location */}
    <div>
      <label className="block text-sm font-medium mb-2">
        Location <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter location"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-medium mb-2">
        Email ID <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        placeholder="Enter email"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Mobile Number */}
    <div>
      <label className="block text-sm font-medium mb-2">
        Mobile Number <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        placeholder="Enter mobile number"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Clinic Incharge */}
    <div>
      <label className="block text-sm font-medium mb-2">
        Clinic Incharge <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter incharge name"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* License Number */}
    <div>
      <label className="block text-sm font-medium mb-2">
        License Number <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter license number"
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  </div>

  {/* Save Button */}
  <div className="flex justify-end mt-6">
    <button
      type="button"
      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Save Clinic
    </button>
  </div>
</div>
    </div>
  )
}

export default NewClinic
