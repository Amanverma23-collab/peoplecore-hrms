import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { employee_id, date, status } = req.query;
      let query = supabase.from('attendance').select('*').order('date', { ascending: false });
      if (employee_id) query = query.eq('employee_id', employee_id);
      if (date) query = query.eq('date', date);
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { employee_id, employee_name, date, clock_in, clock_out, status } = req.body;
      const { data, error } = await supabase.from('attendance').insert({ employee_id, employee_name, date, clock_in, clock_out, status }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, clock_out, status } = req.body;
      const { data, error } = await supabase.from('attendance').update({ clock_out, status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
