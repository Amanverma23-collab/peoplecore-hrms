import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const deptOptions = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Product'];

export default function Recruitment() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({ title: '', department: 'Engineering', position: '', openings: 1, status: 'Open', posted_date: new Date().toISOString().split('T')[0], description: '' });

  const fetchJobs = async () => {
    const companyId = localStorage.getItem("company_id");
    try { let q = supabase
  .from('recruitment')
  .select('*')
  .eq('company_id', companyId)
  .order('id', { ascending: false }); if (filterStatus !== 'All') q = q.eq('status', filterStatus); const { data, error } = await q; if (error) throw error; setJobs(data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchJobs(); }, [filterStatus]);

  const handleSubmit = async () => {
    const companyId = localStorage.getItem("company_id");
    if (editing && selected) { await supabase.from('recruitment').update({ title: form.title, department: form.department, position: form.position, openings: form.openings, status: form.status, description: form.description }).eq('id', selected.id).select(); }
    else { await supabase
.from('recruitment')
.insert({
  ...form,
  company_id: companyId
})
.select(); }
    setModalOpen(false); setEditing(false); setSelected(null); setForm({ title: '', department: 'Engineering', position: '', openings: 1, status: 'Open', posted_date: new Date().toISOString().split('T')[0], description: '' }); fetchJobs();
  };
  const handleEdit = (job: any) => { setSelected(job); setForm({ title: job.title, department: job.department, position: job.position, openings: job.openings, status: job.status, posted_date: job.posted_date, description: job.description || '' }); setEditing(true); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (!confirm('Delete?')) return; await supabase.from('recruitment').delete().eq('id', id); fetchJobs(); };

  const openCount = jobs.filter(j => j.status === 'Open').length;
  const closedCount = jobs.filter(j => j.status === 'Closed').length;

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Recruitment</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Manage job postings</p></div>
        <button onClick={() => { setForm({ title: '', department: 'Engineering', position: '', openings: 1, status: 'Open', posted_date: new Date().toISOString().split('T')[0], description: '' }); setEditing(false); setModalOpen(true); }} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Post Job</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-green-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Open</p><p className="text-lg sm:text-xl font-bold text-neu-text">{openCount}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-2 sm:gap-3"><div className="p-2 rounded-xl bg-red-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /></div><div><p className="text-[10px] sm:text-xs text-neu-muted">Closed</p><p className="text-lg sm:text-xl font-bold text-neu-text">{closedCount}</p></div></div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">{['All', 'Open', 'Closed'].map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${filterStatus === s ? 'bg-gradient-to-r from-[#6c63ff] to-[#b362ff] text-white' : 'neu-btn'}`}>{s}</button>))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {jobs.map(job => (<div key={job.id} className="neu-raised p-4 sm:p-5 group">
          <div className="flex items-start justify-between mb-3"><span className={`neu-badge ${job.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{job.status}</span><div className="flex gap-1"><button onClick={() => handleEdit(job)} className="neu-btn p-1.5 rounded-lg text-amber-500"><Edit2 className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(job.id)} className="neu-btn p-1.5 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></div>
          <h3 className="text-base sm:text-lg font-bold text-neu-text mb-1">{job.title}</h3>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-neu-muted mb-3"><span className="flex items-center gap-1"><MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{job.department}</span><span className="flex items-center gap-1"><Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{job.openings} opening(s)</span></div>
          <p className="text-xs text-neu-subtle line-clamp-2 mb-3">{job.description || 'No description'}</p>
          <p className="text-xs text-neu-subtle">Posted: {job.posted_date}</p>
        </div>))}
        {jobs.length === 0 && <p className="text-neu-subtle col-span-3 text-center py-10">No job postings yet</p>}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Job' : 'Post New Job'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Job Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="neu-input w-full" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"><div><label className="block text-sm font-medium text-neu-text mb-1">Department</label><select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="neu-input w-full">{deptOptions.map(d => <option key={d}>{d}</option>)}</select></div><div><label className="block text-sm font-medium text-neu-text mb-1">Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="neu-input w-full" /></div></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4"><div><label className="block text-sm font-medium text-neu-text mb-1">Openings</label><input type="number" value={form.openings} onChange={e => setForm({ ...form, openings: parseInt(e.target.value) || 1 })} className="neu-input w-full" /></div><div><label className="block text-sm font-medium text-neu-text mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="neu-input w-full"><option>Open</option><option>Closed</option></select></div></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="neu-input w-full" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">{editing ? 'Update' : 'Post Job'}</button></div>
      </Modal>
    </div>
  );
}