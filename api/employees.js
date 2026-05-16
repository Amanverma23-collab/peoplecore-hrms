import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { department, status, search } = req.query;
      let query = supabase.from('employees').select('*').order('id', { ascending: true });
      if (department && department !== 'All') query = query.eq('department', department);
      if (status && status !== 'All') query = query.eq('status', status);
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, email, phone, department, position, salary, join_date, status, avatar } = req.body;
      const { data, error } = await supabase.from('employees').insert({ name, email, phone, department, position, salary, join_date, status, avatar }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, name, email, phone, department, position, salary, join_date, status, avatar } = req.body;
      const { data, error } = await supabase.from('employees').update({ name, email, phone, department, position, salary, join_date, status, avatar }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
