import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Star, Trash2 } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';

export default function Performance() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ employee_id: '', employee_name: '', reviewer: '', rating: 3, review_period: '', comments: '', review_date: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    try { const [revRes, empRes] = await Promise.all([supabase.from('performances').select('*').order('id', { ascending: false }), supabase.from('employees').select('*').eq('status', 'Active')]); setReviews(revRes.data || []); setEmployees(empRes.data || []); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => { const emp = employees.find(e => e.id === parseInt(form.employee_id)); if (!emp) return; await supabase.from('performances').insert({ ...form, employee_name: emp.name }).select(); setModalOpen(false); setForm({ employee_id: '', employee_name: '', reviewer: '', rating: 3, review_period: '', comments: '', review_date: new Date().toISOString().split('T')[0] }); fetchData(); };
  const handleDelete = async (id: number) => { if (!confirm('Delete?')) return; await supabase.from('performances').delete().eq('id', id); fetchData(); };

  const renderStars = (rating: number) => (<div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(s => (<Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />))}</div>);
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Performance</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Employee reviews & ratings</p></div>
        <button onClick={() => setModalOpen(true)} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Add Review</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-3"><div className="p-2 rounded-xl bg-amber-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /></div><div><p className="text-xs text-neu-muted">Avg Rating</p><p className="text-lg sm:text-xl font-bold text-neu-text">{avgRating} / 5</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-3"><div className="p-2 rounded-xl bg-blue-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /></div><div><p className="text-xs text-neu-muted">Total Reviews</p><p className="text-lg sm:text-xl font-bold text-neu-text">{reviews.length}</p></div></div>
        <div className="neu-raised p-3 sm:p-4 flex items-center gap-3"><div className="p-2 rounded-xl bg-green-100" style={{boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff'}}><Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 fill-green-500" /></div><div><p className="text-xs text-neu-muted">Top Performers</p><p className="text-lg sm:text-xl font-bold text-neu-text">{reviews.filter(r => r.rating >= 4).length}</p></div></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {reviews.map(review => (<div key={review.id} className="neu-raised p-4 sm:p-5 group">
          <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full neu-avatar flex items-center justify-center text-white text-sm font-semibold">{review.employee_name?.charAt(0)}</div><div><p className="text-sm font-medium text-neu-text">{review.employee_name}</p><p className="text-xs text-neu-muted">Reviewed by {review.reviewer}</p></div></div><button onClick={() => handleDelete(review.id)} className="neu-btn p-1 rounded-lg text-red-400 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button></div>
          <div className="flex items-center gap-2 mb-2">{renderStars(review.rating)}<span className="text-xs text-neu-muted">{review.rating}/5</span></div>
          <p className="text-xs text-neu-subtle mb-1">Period: {review.review_period}</p>
          <p className="text-sm text-neu-muted line-clamp-2">{review.comments}</p>
        </div>))}
        {reviews.length === 0 && <p className="text-neu-subtle col-span-2 text-center py-10">No reviews yet</p>}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Performance Review">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-neu-text mb-1">Employee</label><select value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} className="neu-input w-full"><option value="">Select employee...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Reviewer Name</label><input value={form.reviewer} onChange={e => setForm({ ...form, reviewer: e.target.value })} className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Rating (1-5)</label><div className="flex items-center gap-2">{[1, 2, 3, 4, 5].map(s => (<button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="p-1"><Star className={`w-6 h-6 ${s <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} transition-colors`} /></button>))}<span className="text-sm text-neu-muted ml-2">{form.rating}/5</span></div></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Review Period</label><input value={form.review_period} onChange={e => setForm({ ...form, review_period: e.target.value })} placeholder="e.g. Q1 2025" className="neu-input w-full" /></div>
          <div><label className="block text-sm font-medium text-neu-text mb-1">Comments</label><textarea value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} rows={3} className="neu-input w-full" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">Submit Review</button></div>
      </Modal>
    </div>
  );
}