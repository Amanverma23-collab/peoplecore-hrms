import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, AlertCircle, Info, Bell } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

const categories = ['General', 'Policy', 'Event', 'Holiday', 'Urgent'];
const priorities = ['Low', 'Medium', 'High'];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', category: 'General', priority: 'Medium', created_date: new Date().toISOString().split('T')[0] });

  const fetchAnnouncements = async () => {
    try { const { data, error } = await supabase.from('announcements').select('*').order('id', { ascending: false }); if (error) throw error; setAnnouncements(data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async () => {
    await supabase.from('announcements').insert(form).select();
    setModalOpen(false); setForm({ title: '', message: '', category: 'General', priority: 'Medium', created_date: new Date().toISOString().split('T')[0] }); fetchAnnouncements();
  };
  const handleDelete = async (id: number) => { if (!confirm('Delete?')) return; await supabase.from('announcements').delete().eq('id', id); fetchAnnouncements(); };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Urgent': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case 'Policy': return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case 'Event': return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />;
      default: return <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-neu-muted" />;
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) { case 'High': return 'border-l-red-400'; case 'Medium': return 'border-l-amber-400'; default: return 'border-l-green-400'; }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Announcements</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Company-wide updates</p></div>
        <button onClick={() => setModalOpen(true)} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> New Announcement</button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className={`neu-raised p-4 sm:p-5 border-l-4 ${getPriorityColor(ann.priority)} group`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div className="mt-0.5 flex-shrink-0">{getCategoryIcon(ann.category)}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-neu-text">{ann.title}</h3>
                    <span className={`neu-badge ${ann.priority === 'High' ? 'bg-red-100 text-red-600' : ann.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{ann.priority}</span>
                    <span className="neu-badge bg-[#d1d9e6] text-neu-muted">{ann.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neu-muted leading-relaxed">{ann.message}</p>
                  <p className="text-[10px] sm:text-xs text-neu-subtle mt-2">{ann.created_date}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(ann.id)} className="neu-btn p-1.5 rounded-lg text-red-400 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (<div className="text-center py-12 sm:py-16"><Megaphone className="w-10 h-10 sm:w-12 sm:h-12 text-neu-subtle mx-auto mb-3" /><p className="text-neu-subtle">No announcements yet</p></div>)}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Message</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} className="neu-input w-full" /></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div><label className="block text-sm font-medium text-neu-text mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="neu-input w-full">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-neu-text mb-1">Priority</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="neu-input w-full">{priorities.map(p => <option key={p}>{p}</option>)}</select></div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">Publish</button></div>
      </Modal>
    </div>
  );
}