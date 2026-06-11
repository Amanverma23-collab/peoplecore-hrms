import { useState, useEffect } from 'react';
import { CalendarOff, CheckCircle2, XCircle, Clock3, Plus, ArrowRight } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Loss of Pay'];
const statusBadge = (s: string) => s === 'Approved' ? 'bg-green-100 text-green-600' : s === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600';

export default function Leaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({ employee_id: '', employee_name: '', leave_type: 'Casual Leave', start_date: '', end_date: '', days: 1, reason: '', status: 'Pending', applied_date: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    try { const companyId = localStorage.getItem("company_id");

let q = supabase
.from('leaves')
.select('*')
.eq('company_id', companyId)
.order('id', { ascending: false });

if (filterStatus !== 'All') {
  q = q.eq('status', filterStatus);
}

const [leaveRes, empRes] = await Promise.all([
  q,
  supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
]);
  setLeaves(leaveRes.data || []); setEmployees(empRes.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [filterStatus]);

  const handleSubmit = async () => {
const companyId = localStorage.getItem("company_id");
const emp = employees.find(
e => e.id === parseInt(form.employee_id)
);

if(!emp){
alert("Select employee");
return;
}

const {error}=await supabase
.from("leaves")
.insert({
company_id: companyId,

employee_id:parseInt(form.employee_id),

employee_name:emp.name,

leave_type:form.leave_type,

start_date:form.start_date,

end_date:form.end_date,



reason:form.reason,

status:"Pending"

});

if(error){
console.log(error);
alert(error.message);
return;
}

setModalOpen(false);

setForm({
employee_id:'',
employee_name:'',
leave_type:'Casual Leave',
start_date:'',
end_date:'',
days:1,
reason:'',
status:'Pending',
applied_date:new Date()
.toISOString()
.split('T')[0]
});

fetchData();

};
  const handleAction = async (id: number, status: string) => { await supabase.from('leaves').update({ status }).eq('id', id).select(); fetchData(); };

  const pending = leaves.filter(l => l.status === 'Pending').length;
  const approved = leaves.filter(l => l.status === 'Approved').length;
  const rejected = leaves.filter(l => l.status === 'Rejected').length;

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Leave Management</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Manage employee leave requests</p></div>
        <button onClick={() => setModalOpen(true)} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Apply Leave</button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-amber-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><Clock3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Pending</p><p className="text-lg sm:text-xl font-bold text-neu-text">{pending}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-green-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Approved</p><p className="text-lg sm:text-xl font-bold text-neu-text">{approved}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-red-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Rejected</p><p className="text-lg sm:text-xl font-bold text-neu-text">{rejected}</p></div></div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">{['All', 'Pending', 'Approved', 'Rejected'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${filterStatus === s ? 'bg-gradient-to-r from-[#6c63ff] to-[#b362ff] text-white' : 'neu-btn'}`}>{s}</button>))}</div>

      <div className="hidden md:block neu-raised overflow-hidden">
        <table className="w-full"><thead><tr style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Employee</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Type</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Duration</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Dates</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Reason</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Status</th><th className="text-right px-5 py-3 text-xs font-bold text-neu-muted uppercase">Actions</th></tr></thead>
        <tbody>{leaves.map(leave => (<tr key={leave.id} className="hover:bg-[#d1d9e6] transition-colors"><td className="px-5 py-3 text-sm text-neu-text">{leave.employee_name}</td><td className="px-5 py-3 text-sm text-neu-text">{leave.leave_type}</td><td className="px-5 py-3 text-sm text-neu-text">{leave.days} day(s)</td><td className="px-5 py-3 text-sm text-neu-muted">{leave.start_date} → {leave.end_date}</td><td className="px-5 py-3 text-sm text-neu-muted max-w-[200px] truncate">{leave.reason}</td><td className="px-5 py-3"><span className={`neu-badge ${statusBadge(leave.status)}`}>{leave.status}</span></td><td className="px-5 py-3">{leave.status === 'Pending' && (<div className="flex items-center justify-end gap-1"><button onClick={() => handleAction(leave.id, 'Approved')} className="neu-btn p-1.5 rounded-lg text-green-500"><CheckCircle2 className="w-4 h-4" /></button><button onClick={() => handleAction(leave.id, 'Rejected')} className="neu-btn p-1.5 rounded-lg text-red-500"><XCircle className="w-4 h-4" /></button></div>)}</td></tr>))}{leaves.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-neu-subtle">No leave requests found</td></tr>}</tbody></table>
      </div>

      <div className="md:hidden space-y-3">{leaves.map(leave => (<div key={leave.id} className="neu-raised p-4"><div className="flex items-start justify-between mb-2"><div><p className="text-sm font-medium text-neu-text">{leave.employee_name}</p><p className="text-xs text-neu-muted">{leave.leave_type}</p></div><span className={`neu-badge ${statusBadge(leave.status)}`}>{leave.status}</span></div><div className="flex items-center gap-1 text-xs text-neu-muted mb-1"><span>{leave.start_date}</span><ArrowRight className="w-3 h-3" /><span>{leave.end_date}</span><span className="ml-1">({leave.days}d)</span></div><p className="text-xs text-neu-subtle line-clamp-1 mb-3">{leave.reason}</p>{leave.status === 'Pending' && (<div className="flex gap-2 pt-3" style={{boxShadow: '0 -2px 4px #a3b1c6, 0 2px 4px #ffffff'}}><button onClick={() => handleAction(leave.id, 'Approved')} className="flex-1 py-2 text-xs font-semibold rounded-xl bg-green-100 text-green-600" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}>Approve</button><button onClick={() => handleAction(leave.id, 'Rejected')} className="flex-1 py-2 text-xs font-semibold rounded-xl bg-red-100 text-red-600" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}>Reject</button></div>)}</div>))}{leaves.length === 0 && <p className="text-neu-subtle text-center py-10">No leave requests found</p>}</div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Apply Leave">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Employee</label><select value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} className="neu-input w-full"><option value="">Select employee...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Leave Type</label><select value={form.leave_type} onChange={e => setForm({ ...form, leave_type: e.target.value })} className="neu-input w-full">{leaveTypes.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4"><div><label className="block text-sm font-medium text-neu-text mb-1">Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="neu-input w-full" /></div><div><label className="block text-sm font-medium text-neu-text mb-1">End Date</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="neu-input w-full" /></div></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Number of Days</label><input type="number" value={form.days} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Reason</label><textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} className="neu-input w-full" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">Submit Leave</button></div>
      </Modal>
    </div>
  );
}