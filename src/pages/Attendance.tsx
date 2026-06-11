import { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const statusBadge = (s: string) => s === 'Present' ? 'bg-green-100 text-green-600' : s === 'Late' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600';

export default function Attendance() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [form, setForm] = useState({ employee_id: '', employee_name: '', date:new Date().toLocaleDateString('en-CA'), clock_in: '09:00', clock_out: '', status: 'Present' });

  const fetchData = async () => {
    const companyId = localStorage.getItem("company_id");

console.log(
  "ATTENDANCE COMPANY ID",
  companyId
);
    try { const [attRes, empRes] = await Promise.all([
  supabase
    .from('attendance')
    .select('*')
    .eq('company_id', companyId)
    .eq('date', filterDate)
    .order('id', { ascending: true }),

  supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'Active')
]); setAttendance(attRes.data || []); setEmployees(empRes.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [filterDate]);
  const companyId = localStorage.getItem("company_id");

  const handleClockIn = async () => {

const { data: settings } = await supabase
  .from("company_settings")
  .select("wifi_attendance_enabled")
  .eq("company_id", companyId)
  .single();
  
  if (settings?.wifi_attendance_enabled) {

  try {

    const ipRes = await fetch(
      "https://api.ipify.org?format=json"
    );

    const ipData = await ipRes.json();

    const currentIp = ipData.ip;

    const { data: allowedIps } =
      await supabase
        .from("company_wifi_ips")
        .select("ip_address")
        .eq("company_id", companyId);

    const matched = allowedIps?.some(
  (item: any) =>
    item.ip_address === currentIp
);

    if (!matched) {

      alert(
        "Connect to office WiFi before marking attendance"
      );

      return;

    }

  } catch {

    alert(
      "Unable to verify network"
    );

    return;

  }

}

const emp = employees.find(
e => e.id === parseInt(form.employee_id)
);

if (!emp) return;

await supabase
.from('attendance')
.insert({

...form,

company_id: companyId,

employee_name: emp.name,

clock_in: new Date().toLocaleTimeString(
'en-IN',
{
hour:'2-digit',
minute:'2-digit'
})

})
.select();

setModalOpen(false);

setForm({
employee_id:'',
employee_name:'',
date:new Date().toLocaleDateString('en-CA'),
clock_in:'09:00',
clock_out:'',
status:'Present'
});

fetchData();

};
  const handleClockOut = async (rec: any) => { await supabase.from('attendance').update({ clock_out: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), status: 'Present' }).eq('id', rec.id).select(); fetchData(); };

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Attendance</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Track daily attendance</p></div>
        <button onClick={() => setModalOpen(true)} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><LogIn className="w-4 h-4" /> Clock In</button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-green-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Present</p><p className="text-lg sm:text-xl font-bold text-neu-text">{presentCount}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-red-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Absent</p><p className="text-lg sm:text-xl font-bold text-neu-text">{absentCount}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-amber-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Late</p><p className="text-lg sm:text-xl font-bold text-neu-text">{lateCount}</p></div></div>
      </div>
      <div className="flex items-center gap-3"><label className="text-xs sm:text-sm text-neu-muted">Date:</label><input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="neu-input" /></div>

      <div className="hidden md:block neu-raised overflow-hidden">
        <table className="w-full"><thead><tr style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Employee</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Date</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Clock In</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Clock Out</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Status</th><th className="text-right px-5 py-3 text-xs font-bold text-neu-muted uppercase">Action</th></tr></thead>
        <tbody>{attendance.map(rec => (<tr key={rec.id} className="hover:bg-[#d1d9e6] transition-colors"><td className="px-5 py-3 text-sm text-neu-text">{rec.employee_name}</td><td className="px-5 py-3 text-sm text-neu-muted">{rec.date}</td><td className="px-5 py-3 text-sm text-neu-text">{rec.clock_in || '-'}</td><td className="px-5 py-3 text-sm text-neu-text">{rec.clock_out || '-'}</td><td className="px-5 py-3"><span className={`neu-badge ${statusBadge(rec.status)}`}>{rec.status}</span></td><td className="px-5 py-3 text-right">{!rec.clock_out && rec.status !== 'Absent' && (<button onClick={() => handleClockOut(rec)} className="neu-btn px-3 py-1.5 text-xs inline-flex items-center gap-1"><LogOut className="w-3 h-3" /> Clock Out</button>)}</td></tr>))}{attendance.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-neu-subtle">No records</td></tr>}</tbody></table>
      </div>

      <div className="md:hidden space-y-3">{attendance.map(rec => (<div key={rec.id} className="neu-raised p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-neu-text">{rec.employee_name}</p><span className={`neu-badge ${statusBadge(rec.status)}`}>{rec.status}</span></div><div className="grid grid-cols-3 gap-2 text-xs text-neu-muted mb-3 neu-inset-sm p-2"><div><p className="text-neu-subtle">Date</p><p>{rec.date}</p></div><div><p className="text-neu-subtle">In</p><p>{rec.clock_in || '-'}</p></div><div><p className="text-neu-subtle">Out</p><p>{rec.clock_out || '-'}</p></div></div>{!rec.clock_out && rec.status !== 'Absent' && (<button onClick={() => handleClockOut(rec)} className="neu-btn w-full py-2 text-xs flex items-center justify-center gap-1"><LogOut className="w-3 h-3" /> Clock Out</button>)}</div>))}{attendance.length === 0 && <p className="text-neu-subtle text-center py-10">No records</p>}</div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Clock In Employee">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Select Employee</label><select value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} className="neu-input w-full"><option value="">Choose employee...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.department}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="neu-input w-full"><option>Present</option><option>Late</option><option>Absent</option><option>Half Day</option></select></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleClockIn} className="neu-btn-accent px-4 py-2 text-sm">Clock In</button></div>
      </Modal>
    </div>
  );
}