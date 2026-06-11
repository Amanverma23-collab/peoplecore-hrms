import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Eye, CheckCircle2 } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Payroll() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({ employee_id: '', employee_name: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic: 0, hra: 0, da: 0, deductions: 0, net_salary: 0, status: 'Pending' });

  const fetchData = async () => {
    const companyId = localStorage.getItem("company_id");
    try { const [payRes, empRes] = await Promise.all([supabase
.from('payroll')
.select('*')
.eq('company_id', companyId)
.eq('month', filterMonth)
.eq('year', filterYear),

supabase
.from('employees')
.select('*')
.eq('company_id', companyId)
.eq('status', 'Active')]); setPayroll(payRes.data || []); setEmployees(empRes.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [filterMonth, filterYear]);

  const calcNet = () => form.basic + form.hra + form.da - form.deductions;
  const handleSubmit = async () => { const companyId = localStorage.getItem("company_id"); const emp = employees.find(e => e.id === parseInt(form.employee_id)); if (!emp) return; await supabase
.from('payroll')
.insert({
  ...form,

  company_id: companyId,

  employee_name: emp.name,

  net_salary: calcNet()
}) .select(); setModalOpen(false); setForm({ employee_id: '', employee_name: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic: 0, hra: 0, da: 0, deductions: 0, net_salary: 0, status: 'Pending' }); fetchData(); };
  const handleProcess = async (id: number) => { await supabase.from('payroll').update({ status: 'Processed' }).eq('id', id).select(); fetchData(); };

  const totalPayroll = payroll.reduce((sum, p) => sum + (parseFloat(p.net_salary) || 0), 0);
  const processedCount = payroll.filter(p => p.status === 'Processed').length;
  const pendingCount = payroll.filter(p => p.status === 'Pending').length;

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Payroll</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Manage employee salaries</p></div>
        <button onClick={() => setModalOpen(true)} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Generate Payslip</button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-emerald-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /></div><div className="min-w-0"><p className="text-[10px] sm:text-xs text-neu-muted">Total</p><p className="text-sm sm:text-xl font-bold text-neu-text truncate">₹{totalPayroll.toLocaleString('en-IN')}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-green-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Processed</p><p className="text-lg sm:text-xl font-bold text-neu-text">{processedCount}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-amber-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Pending</p><p className="text-lg sm:text-xl font-bold text-neu-text">{pendingCount}</p></div></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3"><select value={filterMonth} onChange={e => setFilterMonth(parseInt(e.target.value))} className="neu-input flex-1 sm:flex-none"><option value="" disabled>Month</option>{months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select><select value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))} className="neu-input flex-1 sm:flex-none">{[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}</select></div>

      <div className="hidden md:block neu-raised overflow-hidden">
        <table className="w-full"><thead><tr style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Employee</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Basic</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">HRA</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">DA</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Deductions</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Net Salary</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Status</th><th className="text-right px-5 py-3 text-xs font-bold text-neu-muted uppercase">Actions</th></tr></thead>
        <tbody>{payroll.map(p => (<tr key={p.id} className="hover:bg-[#d1d9e6] transition-colors"><td className="px-5 py-3 text-sm text-neu-text">{p.employee_name}</td><td className="px-5 py-3 text-sm text-neu-text">₹{Number(p.basic).toLocaleString('en-IN')}</td><td className="px-5 py-3 text-sm text-neu-text">₹{Number(p.hra).toLocaleString('en-IN')}</td><td className="px-5 py-3 text-sm text-neu-text">₹{Number(p.da).toLocaleString('en-IN')}</td><td className="px-5 py-3 text-sm text-red-500">₹{Number(p.deductions).toLocaleString('en-IN')}</td><td className="px-5 py-3 text-sm font-bold text-emerald-600">₹{Number(p.net_salary).toLocaleString('en-IN')}</td><td className="px-5 py-3"><span className={`neu-badge ${p.status === 'Processed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{p.status}</span></td><td className="px-5 py-3"><div className="flex items-center justify-end gap-1"><button onClick={() => { setSelected(p); setViewModal(true); }} className="neu-btn p-1.5 rounded-lg text-blue-500"><Eye className="w-4 h-4" /></button>{p.status === 'Pending' && (<button onClick={() => handleProcess(p.id)} className="neu-btn px-3 py-1 text-xs text-green-600">Process</button>)}</div></td></tr>))}{payroll.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-neu-subtle">No payroll records</td></tr>}</tbody></table>
      </div>

      <div className="md:hidden space-y-3">{payroll.map(p => (<div key={p.id} className="neu-raised p-4"><div className="flex items-center justify-between mb-3"><p className="text-sm font-medium text-neu-text">{p.employee_name}</p><span className={`neu-badge ${p.status === 'Processed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{p.status}</span></div><div className="grid grid-cols-2 gap-2 text-xs mb-3"><div className="neu-inset-sm p-2"><p className="text-neu-subtle">Basic</p><p className="text-neu-text font-medium">₹{Number(p.basic).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-2"><p className="text-neu-subtle">HRA</p><p className="text-neu-text font-medium">₹{Number(p.hra).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-2"><p className="text-neu-subtle">DA</p><p className="text-neu-text font-medium">₹{Number(p.da).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-2"><p className="text-neu-subtle">Deductions</p><p className="text-red-500 font-medium">-₹{Number(p.deductions).toLocaleString('en-IN')}</p></div></div><div className="flex items-center justify-between pt-3" style={{boxShadow: '0 -2px 4px #a3b1c6, 0 2px 4px #ffffff'}}><div><p className="text-xs text-neu-subtle">Net Salary</p><p className="text-lg font-bold text-emerald-600">₹{Number(p.net_salary).toLocaleString('en-IN')}</p></div><div className="flex gap-2"><button onClick={() => { setSelected(p); setViewModal(true); }} className="neu-btn px-3 py-2 text-xs"><Eye className="w-3.5 h-3.5" /></button>{p.status === 'Pending' && (<button onClick={() => handleProcess(p.id)} className="neu-btn-accent px-3 py-2 text-xs">Process</button>)}</div></div></div>))}{payroll.length === 0 && <p className="text-neu-subtle text-center py-10">No payroll records</p>}</div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Generate Payslip">
        <div className="space-y-4"><div><label className="block text-sm font-medium text-neu-text mb-1">Employee</label><select
value={form.employee_id}
onChange={(e)=>{

setForm({
...form,
employee_id:e.target.value
})

}}
className="neu-input w-full"
><option value="">Select employee...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div><div className="grid grid-cols-2 gap-3 sm:gap-4"><div><label className="block text-sm font-medium text-neu-text mb-1">Basic (₹)</label><input type="number" value={form.basic} onChange={e => setForm({ ...form, basic: parseFloat(e.target.value) || 0 })} className="neu-input w-full" /></div><div><label className="block text-sm font-medium text-neu-text mb-1">HRA (₹)</label><input type="number" value={form.hra} onChange={e => setForm({ ...form, hra: parseFloat(e.target.value) || 0 })} className="neu-input w-full" /></div><div><label className="block text-sm font-medium text-neu-text mb-1">DA (₹)</label><input type="number" value={form.da} onChange={e => setForm({ ...form, da: parseFloat(e.target.value) || 0 })} className="neu-input w-full" /></div><div><label className="block text-sm font-medium text-neu-text mb-1">Deductions (₹)</label><input type="number" value={form.deductions} onChange={e => setForm({ ...form, deductions: parseFloat(e.target.value) || 0 })} className="neu-input w-full" /></div></div><div className="neu-inset p-4 text-center"><p className="text-sm text-neu-muted">Net Salary</p><p className="text-2xl font-bold text-emerald-600">₹{calcNet().toLocaleString('en-IN')}</p></div></div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">Generate</button></div>
      </Modal>

      <Modal open={viewModal} onClose={() => setViewModal(false)} title="Payslip Details">
        {selected && (<div className="space-y-4"><div className="text-center pb-4" style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><h3 className="text-lg font-bold text-neu-text">{selected.employee_name}</h3><p className="text-sm text-neu-muted">{months[selected.month - 1]} {selected.year}</p></div><div className="grid grid-cols-2 gap-2 sm:gap-3"><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Basic</p><p className="text-sm font-medium text-neu-text">₹{Number(selected.basic).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">HRA</p><p className="text-sm font-medium text-neu-text">₹{Number(selected.hra).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">DA</p><p className="text-sm font-medium text-neu-text">₹{Number(selected.da).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Deductions</p><p className="text-sm font-medium text-red-500">-₹{Number(selected.deductions).toLocaleString('en-IN')}</p></div></div><div className="neu-raised p-4 text-center" style={{background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(179,98,255,0.1))'}}><p className="text-xs text-neu-muted">Net Salary</p><p className="text-2xl font-bold text-emerald-600">₹{Number(selected.net_salary).toLocaleString('en-IN')}</p></div></div>)}
      </Modal>
    </div>
  );
}