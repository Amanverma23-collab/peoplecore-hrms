import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('recruitment').select('*').order('posted_date', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { title, department, position, openings, status, posted_date, description } = req.body;
      const { data, error } = await supabase.from('recruitment').insert({ title, department, position, openings, status, posted_date, description }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, title, department, position, openings, status, description } = req.body;
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (department !== undefined) updateData.department = department;
      if (position !== undefined) updateData.position = position;
      if (openings !== undefined) updateData.openings = openings;
      if (status !== undefined) updateData.status = status;
      if (description !== undefined) updateData.description = description;
      const { data, error } = await supabase.from('recruitment').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('recruitment').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
