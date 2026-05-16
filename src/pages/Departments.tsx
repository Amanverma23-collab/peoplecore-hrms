import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, Users } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const gradients = ['from-[#6c63ff] to-[#4840e0]', 'from-[#b362ff] to-[#9333ea]', 'from-[#22c55e] to-[#16a34a]', 'from-[#f59e0b] to-[#d97706]', 'from-[#ef4444] to-[#dc2626]', 'from-[#6366f1] to-[#4f46e5]', 'from-[#10b981] to-[#059669]', 'from-[#ec4899] to-[#db2777]'];

export default function Departments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name: '', head: '', description: '', employee_count: 0 });

  const fetchDepts = async () => {
    try { const { data, error } = await supabase.from('departments').select('*').order('id', { ascending: true }); if (error) throw error; setDepartments(data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchDepts(); }, []);

  const handleSubmit = async () => {
    if (editing && selected) { await supabase.from('departments').update(form).eq('id', selected.id).select(); } else { await supabase.from('departments').insert(form).select(); }
    setModalOpen(false); setEditing(false); setSelected(null); setForm({ name: '', head: '', description: '', employee_count: 0 }); fetchDepts();
  };
  const handleEdit = (dept: any) => { setSelected(dept); setForm({ name: dept.name, head: dept.head || '', description: dept.description || '', employee_count: dept.employee_count || 0 }); setEditing(true); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (!confirm('Delete?')) return; await supabase.from('departments').delete().eq('id', id); fetchDepts(); };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Departments</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Organize your company structure</p></div>
        <button onClick={() => { setForm({ name: '', head: '', description: '', employee_count: 0 }); setEditing(false); setModalOpen(true); }} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Add Department</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {departments.map((dept, i) => (
          <div key={dept.id} className="neu-raised p-4 sm:p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`} style={{boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff'}}><Building2 className="w-5 h-5 text-white" /></div>
              <div className="flex gap-1"><button onClick={() => handleEdit(dept)} className="neu-btn p-1.5 rounded-lg text-amber-500"><Edit2 className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(dept.id)} className="neu-btn p-1.5 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neu-text">{dept.name}</h3>
            <p className="text-xs sm:text-sm text-neu-muted mt-1">Head: {dept.head || 'Not assigned'}</p>
            <p className="text-xs text-neu-subtle mt-2 line-clamp-2">{dept.description || 'No description'}</p>
            <div className="flex items-center gap-2 mt-3 pt-3" style={{boxShadow: '0 -2px 4px #a3b1c6, 0 2px 4px #ffffff'}}><Users className="w-4 h-4 text-neu-subtle" /><span className="text-xs sm:text-sm text-neu-muted">{dept.employee_count || 0} employees</span></div>
          </div>
        ))}
        {departments.length === 0 && <p className="text-neu-subtle col-span-3 text-center py-10">No departments yet</p>}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Department Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Department Head</label><input value={form.head} onChange={e => setForm({ ...form, head: e.target.value })} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Employee Count</label><input type="number" value={form.employee_count} onChange={e => setForm({ ...form, employee_count: parseInt(e.target.value) || 0 })} className="neu-input w-full" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">{editing ? 'Update' : 'Add Department'}</button></div>
      </Modal>
    </div>
  );
}