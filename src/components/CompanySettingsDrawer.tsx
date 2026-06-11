import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { Trash2 } from "lucide-react";

const tabs = [
  "Company",
  "Leave",
  "Attendance",
  "Payroll",
  "Security",
  "Branding",
];
export default function CompanySettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
const [activeTab, setActiveTab] = useState("Company");
const [companyForm, setCompanyForm] = useState({
  company_name: "",
  gst: "",
  cin: "",
  company_email: "",
  company_phone: "",
  address: "",
  website: "",
});
const [leaveForm, setLeaveForm] = useState({
  casual_leave_limit: 12,
  sick_leave_limit: 6,
  earned_leave_limit: 15,
  carry_forward_enabled: false,
  half_day_leave_enabled: true,
});

const [attendanceForm, setAttendanceForm] = useState({
  office_start_time: "09:00",
  office_end_time: "18:00",
  grace_minutes: 15,
  late_mark_after: 15,
  wifi_attendance_enabled: false,
});

const [wifiIp, setWifiIp] = useState("");

const [wifiIps, setWifiIps] = useState<any[]>([]);
const [payrollForm, setPayrollForm] = useState({
  salary_date: 7,
  pf_enabled: true,
  esic_enabled: true,
  professional_tax_enabled: true,
  overtime_enabled: false,
});
const [securityForm, setSecurityForm] = useState({
  device_binding_enabled: false,
});

const [brandingForm, setBrandingForm] = useState({
  primary_color: "#6c63ff",
  secondary_color: "#b362ff",
});
const companyId = localStorage.getItem("company_id");

useEffect(() => {

  
  if (!open) return;

  const loadCompany = async () => {

    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (data) {

      setCompanyForm({
        company_name: data.company_name || "",
        gst: data.gst || "",
        cin: data.cin || "",
        company_email: data.company_email || "",
        company_phone: data.company_phone || "",
        address: data.address || "",
        website: data.website || "",
      });
      const { data: settings } = await supabase
  .from("company_settings")
  .select("*")
  .eq("company_id", companyId)
  .single();

if (settings) {

  setLeaveForm({
    casual_leave_limit: settings.casual_leave_limit || 12,
    sick_leave_limit: settings.sick_leave_limit || 6,
    earned_leave_limit: settings.earned_leave_limit || 15,
    carry_forward_enabled: settings.carry_forward_enabled || false,
    half_day_leave_enabled: settings.half_day_leave_enabled || true,
  });

  
}

setAttendanceForm({
  office_start_time: settings.office_start_time || "09:00",
  office_end_time: settings.office_end_time || "18:00",
  grace_minutes: settings.grace_minutes || 15,
  late_mark_after: settings.late_mark_after || 15,
  wifi_attendance_enabled:
    settings.wifi_attendance_enabled || false,
});

setPayrollForm({
  salary_date: settings.salary_date || 7,
  pf_enabled: settings.pf_enabled ?? true,
  esic_enabled: settings.esic_enabled ?? true,
  professional_tax_enabled:
    settings.professional_tax_enabled ?? true,
  overtime_enabled:
    settings.overtime_enabled ?? false,
});
setSecurityForm({
  device_binding_enabled:
    settings.device_binding_enabled ?? false,
});
setBrandingForm({
  primary_color:
    settings.primary_color || "#6c63ff",

  secondary_color:
    settings.secondary_color || "#b362ff",
});
const { data: ipData } = await supabase
  .from("company_wifi_ips")
  .select("*")
  .eq("company_id", companyId);

setWifiIps(ipData || []);


    }
  };

  loadCompany();

},
 [open]);

 const saveCompany = async () => {

  await supabase
    .from("companies")
    .update({
      company_email: companyForm.company_email,
      company_phone: companyForm.company_phone,
      address: companyForm.address,
      website: companyForm.website,
    })
    .eq("id", companyId);

  alert("Company settings saved");

};

const saveLeaveSettings = async () => {

  await supabase
    .from("company_settings")
    .update({
      casual_leave_limit: leaveForm.casual_leave_limit,
      sick_leave_limit: leaveForm.sick_leave_limit,
      earned_leave_limit: leaveForm.earned_leave_limit,
      carry_forward_enabled: leaveForm.carry_forward_enabled,
      half_day_leave_enabled: leaveForm.half_day_leave_enabled,
    })
    .eq("company_id", companyId);

  alert("Leave settings saved");

};

const saveAttendanceSettings = async () => {

  await supabase
    .from("company_settings")
    .update({
      office_start_time:
        attendanceForm.office_start_time,

      office_end_time:
        attendanceForm.office_end_time,

      grace_minutes:
        attendanceForm.grace_minutes,

      late_mark_after:
        attendanceForm.late_mark_after,

      wifi_attendance_enabled:
        attendanceForm.wifi_attendance_enabled,
    })
    .eq("company_id", companyId);

  alert("Attendance settings saved");

};

const addWifiIp = async () => {

  if (!wifiIp.trim()) return;

  const { data } = await supabase
    .from("company_wifi_ips")
    .insert({
      company_id: companyId,
      ip_address: wifiIp,
    })
    .select();

  if (data) {

    setWifiIps([
      ...wifiIps,
      data[0]
    ]);

    setWifiIp("");

  }

};
const deleteWifiIp = async (id: number) => {

  await supabase
    .from("company_wifi_ips")
    .delete()
    .eq("id", id);

  setWifiIps(
    wifiIps.filter(
      (item) => item.id !== id
    )
  );

};

const savePayrollSettings = async () => {

  await supabase
    .from("company_settings")
    .update({
      salary_date: payrollForm.salary_date,

      pf_enabled:
        payrollForm.pf_enabled,

      esic_enabled:
        payrollForm.esic_enabled,

      professional_tax_enabled:
        payrollForm.professional_tax_enabled,

      overtime_enabled:
        payrollForm.overtime_enabled,
    })
    .eq("company_id", companyId);

  alert("Payroll settings saved");

};
const saveSecuritySettings = async () => {

  await supabase
    .from("company_settings")
    .update({
      device_binding_enabled:
        securityForm.device_binding_enabled,
    })
    .eq("company_id", companyId);

  alert("Security settings saved");

};
const saveBrandingSettings = async () => {

  await supabase
    .from("company_settings")
    .update({
      primary_color:
        brandingForm.primary_color,

      secondary_color:
        brandingForm.secondary_color,
    })
    .eq("company_id", companyId);

  alert("Branding settings saved");

};

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div
        className="
        fixed
        top-0
        right-0
        h-full
        w-full
        sm:w-[450px]
        bg-white
        z-50
        shadow-2xl
        "
      >

        <div className="flex items-center justify-between p-5 border-b">

          <h2 className="text-lg font-bold">
            Company Settings
          </h2>

          <button
            onClick={onClose}
            className="text-xl cursor-pointer"
          >
            ✕
          </button>

        </div>
        <div className="flex h-[calc(100%-80px)]">

  <div className="w-[150px] border-r p-3 space-y-2">

    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          w-full
          text-left
          px-3
          py-2
          rounded-lg
          cursor-pointer
          transition

          ${
            activeTab === tab
              ? "bg-purple-600 text-white"
              : "hover:bg-gray-100"
          }
        `}
      >
        {tab}
      </button>
    ))}

  </div>

  <div className="flex-1 p-5 overflow-y-auto">

   {activeTab === "Company" && (

<div className="space-y-4">

  <h3 className="text-xl font-bold">
    Company Settings
  </h3>
<label className="block text-sm font-semibold text-gray-700">
  Company Name
</label>
  <input
    value={companyForm.company_name}
    disabled
    placeholder="Company Name"
    className="w-full border rounded-lg p-3 bg-gray-100"
  />
<label className="block text-sm font-semibold text-gray-700">
  GST Number
</label>
  <input
    value={companyForm.gst}
    disabled
    placeholder="GST"
    className="w-full border rounded-lg p-3 bg-gray-100"
  />
<label className="block text-sm font-semibold text-gray-700">
  CIN Number
</label>
  <input
    value={companyForm.cin}
    disabled
    placeholder="CIN"
    className="w-full border rounded-lg p-3 bg-gray-100"
  />
  <p className="text-xs text-gray-500">
  Only Super Admin can modify legal company information.
</p>

<label className="block text-sm font-semibold text-gray-700">
  Company Email
</label>
  <input
    value={companyForm.company_email}
    onChange={(e) =>
      setCompanyForm({
        ...companyForm,
        company_email: e.target.value,
      })
    }
    placeholder="Company Email"
    className="w-full border rounded-lg p-3"
  />

<label className="block text-sm font-semibold text-gray-700">
  Phone Number
</label>
  <input
    value={companyForm.company_phone}
    onChange={(e) =>
      setCompanyForm({
        ...companyForm,
        company_phone: e.target.value,
      })
    }
    placeholder="Phone Number"
    className="w-full border rounded-lg p-3"
  />

  <label className="block text-sm font-semibold text-gray-700">
    Company Address
  </label>
  <textarea
    value={companyForm.address}
    onChange={(e) =>
      setCompanyForm({
        ...companyForm,
        address: e.target.value,
      })
    }
    placeholder="Address"
    className="w-full border rounded-lg p-3"
  />

<label className="block text-sm font-semibold text-gray-700">
  Website
</label>
  <input
    value={companyForm.website}
    onChange={(e) =>
      setCompanyForm({
        ...companyForm,
        website: e.target.value,
      })
    }
    placeholder="Website"
    className="w-full border rounded-lg p-3"
  />
 <hr className="my-4" />
  <button
    onClick={saveCompany}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    cursor-pointer
    "
  >
    Save Company Settings
  </button>

</div>

)}

    {activeTab === "Leave" && (

<div className="space-y-5">

  <h3 className="text-xl font-bold">
    Leave Settings
  </h3>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Casual Leave Limit
    </label>

    <input
      type="number"
      value={leaveForm.casual_leave_limit}
      onChange={(e) =>
        setLeaveForm({
          ...leaveForm,
          casual_leave_limit: Number(e.target.value),
        })
      }
      className="w-full border rounded-lg p-3"
    />

  </div>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Sick Leave Limit
    </label>

    <input
      type="number"
      value={leaveForm.sick_leave_limit}
      onChange={(e) =>
        setLeaveForm({
          ...leaveForm,
          sick_leave_limit: Number(e.target.value),
        })
      }
      className="w-full border rounded-lg p-3"
    />

  </div>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Earned Leave Limit
    </label>

    <input
      type="number"
      value={leaveForm.earned_leave_limit}
      onChange={(e) =>
        setLeaveForm({
          ...leaveForm,
          earned_leave_limit: Number(e.target.value),
        })
      }
      className="w-full border rounded-lg p-3"
    />

  </div>

  <label className="flex items-center gap-3 cursor-pointer">

    <input
      type="checkbox"
      checked={leaveForm.carry_forward_enabled}
      onChange={(e) =>
        setLeaveForm({
          ...leaveForm,
          carry_forward_enabled: e.target.checked,
        })
      }
    />

    Carry Forward Leaves

  </label>

  <label className="flex items-center gap-3 cursor-pointer">

    <input
      type="checkbox"
      checked={leaveForm.half_day_leave_enabled}
      onChange={(e) =>
        setLeaveForm({
          ...leaveForm,
          half_day_leave_enabled: e.target.checked,
        })
      }
    />

    Half Day Leave Enabled

  </label>

  <button
    onClick={saveLeaveSettings}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    cursor-pointer
    "
  >
    Save Leave Settings
  </button>

</div>

)}

    {activeTab === "Attendance" && (

<div className="space-y-5">

  <h3 className="text-xl font-bold">
    Attendance Settings
  </h3>

  <label className="block text-sm font-semibold">
    Office Start Time
  </label>

  <input
    type="time"
    value={attendanceForm.office_start_time}
    onChange={(e) =>
      setAttendanceForm({
        ...attendanceForm,
        office_start_time: e.target.value,
      })
    }
    className="w-full border rounded-lg p-3"
  />

  <label className="block text-sm font-semibold">
    Office End Time
  </label>

  <input
    type="time"
    value={attendanceForm.office_end_time}
    onChange={(e) =>
      setAttendanceForm({
        ...attendanceForm,
        office_end_time: e.target.value,
      })
    }
    className="w-full border rounded-lg p-3"
  />

  <label className="block text-sm font-semibold">
    Grace Minutes
  </label>

  <input
    type="number"
    value={attendanceForm.grace_minutes}
    onChange={(e) =>
      setAttendanceForm({
        ...attendanceForm,
        grace_minutes: Number(e.target.value),
      })
    }
    className="w-full border rounded-lg p-3"
  />

  <label className="block text-sm font-semibold">
    Late Mark After
  </label>

  <input
    type="number"
    value={attendanceForm.late_mark_after}
    onChange={(e) =>
      setAttendanceForm({
        ...attendanceForm,
        late_mark_after: Number(e.target.value),
      })
    }
    className="w-full border rounded-lg p-3"
  />

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={
        attendanceForm.wifi_attendance_enabled
      }
      onChange={(e) =>
        setAttendanceForm({
          ...attendanceForm,
          wifi_attendance_enabled:
            e.target.checked,
        })
      }
    />

    Enable WiFi Attendance

  </label>

  <hr />

  <h4 className="font-semibold">
    Allowed WiFi IPs
  </h4>
  <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
  <p className="text-sm font-semibold text-blue-700">
    How to get Office WiFi IP?
  </p>

  <ol className="text-xs text-blue-600 mt-2 space-y-1 list-decimal ml-4">
    <li>Connect to office WiFi.</li>
    <li>
      Open{" "}
      <a
        href="https://api.ipify.org"
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 underline font-semibold"
      >
        https://api.ipify.org
      </a>
    </li>
    <li>Copy the IP shown on screen.</li>
    <li>Add that IP in the list below.</li>
  </ol>
</div>

  <div className="flex gap-2">

    <input
      value={wifiIp}
      onChange={(e) =>
        setWifiIp(e.target.value)
      }
      placeholder="192.168.1.1"
      className="flex-1 border rounded-lg p-3"
    />

    <button
      onClick={addWifiIp}
      className="bg-purple-600 text-white px-4 rounded-lg"
    >
      Add
    </button>
   
  </div>

  {wifiIps.map((ip) => (

  <div
    key={ip.id}
    className="
      border
      rounded-lg
      p-3
      flex
      items-center
      justify-between
    "
  >

    <span>
      {ip.ip_address}
    </span>

    <button
      onClick={() => deleteWifiIp(ip.id)}
      className="
        text-red-500
        cursor-pointer
        hover:text-red-700
      "
    >
      <Trash2 size={18} />
    </button>

  </div>

))}

  <button
    onClick={saveAttendanceSettings}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    "
  >
    Save Attendance Settings
  </button>

</div>

)}

     {activeTab === "Payroll" && (

<div className="space-y-5">

  <h3 className="text-xl font-bold">
    Payroll Settings
  </h3>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Salary Credit Date
    </label>

    <input
      type="number"
      min="1"
      max="31"
      value={payrollForm.salary_date}
      onChange={(e) =>
        setPayrollForm({
          ...payrollForm,
          salary_date: Number(e.target.value),
        })
      }
      className="w-full border rounded-lg p-3"
    />

  </div>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={payrollForm.pf_enabled}
      onChange={(e) =>
        setPayrollForm({
          ...payrollForm,
          pf_enabled: e.target.checked,
        })
      }
    />

    PF Enabled

  </label>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={payrollForm.esic_enabled}
      onChange={(e) =>
        setPayrollForm({
          ...payrollForm,
          esic_enabled: e.target.checked,
        })
      }
    />

    ESIC Enabled

  </label>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={
        payrollForm.professional_tax_enabled
      }
      onChange={(e) =>
        setPayrollForm({
          ...payrollForm,
          professional_tax_enabled:
            e.target.checked,
        })
      }
    />

    Professional Tax Enabled

  </label>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={payrollForm.overtime_enabled}
      onChange={(e) =>
        setPayrollForm({
          ...payrollForm,
          overtime_enabled: e.target.checked,
        })
      }
    />

    Overtime Enabled

  </label>

  <button
    onClick={savePayrollSettings}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    cursor-pointer
    "
  >
    Save Payroll Settings
  </button>

</div>

)}

    {activeTab === "Security" && (

<div className="space-y-5">

  <h3 className="text-xl font-bold">
    Security Settings
  </h3>

  <div className="border rounded-xl p-4">

    <h4 className="font-semibold mb-2">
      Device Binding
    </h4>

    <p className="text-sm text-gray-500 mb-4">
      Employee can login only from
      one verified device.
    </p>

    <label className="flex items-center gap-3">

      <input
        type="checkbox"
        checked={
          securityForm.device_binding_enabled
        }
        onChange={(e) =>
          setSecurityForm({
            ...securityForm,
            device_binding_enabled:
              e.target.checked,
          })
        }
      />

      Enable Device Binding

    </label>

  </div>

  <div className="bg-yellow-50 border rounded-xl p-4">

    <p className="text-sm">

      When enabled, employee's first
      login device becomes registered.

      Future logins from another device
      will be blocked.

    </p>

  </div>

  <button
    onClick={saveSecuritySettings}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    cursor-pointer
    "
  >
    Save Security Settings
  </button>

</div>

)}

   {activeTab === "Branding" && (

<div className="space-y-5">

  <h3 className="text-xl font-bold">
    Branding Settings
  </h3>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Primary Color
    </label>

    <input
      type="color"
      value={brandingForm.primary_color}
      onChange={(e) =>
        setBrandingForm({
          ...brandingForm,
          primary_color: e.target.value,
        })
      }
      className="w-full h-12"
    />

  </div>

  <div>

    <label className="block text-sm font-semibold mb-2">
      Secondary Color
    </label>

    <input
      type="color"
      value={brandingForm.secondary_color}
      onChange={(e) =>
        setBrandingForm({
          ...brandingForm,
          secondary_color: e.target.value,
        })
      }
      className="w-full h-12"
    />

  </div>

  <div
    className="rounded-xl p-5 text-white"
    style={{
      background: `linear-gradient(
        135deg,
        ${brandingForm.primary_color},
        ${brandingForm.secondary_color}
      )`
    }}
  >

    <h4 className="font-bold">
      Brand Preview
    </h4>

    <p className="text-sm mt-2">
      This is how your company theme
      will look.
    </p>

  </div>

  <button
    onClick={saveBrandingSettings}
    className="
    w-full
    bg-purple-600
    text-white
    py-3
    rounded-xl
    cursor-pointer
    "
  >
    Save Branding Settings
  </button>

</div>

)}

  </div>

</div>
      </div>
    </>
  );
}