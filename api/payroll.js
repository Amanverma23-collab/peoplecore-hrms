import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { employee_id, month, year, status } = req.query;
      let query = supabase.from('payroll').select('*').order('id', { ascending: false });
      if (employee_id) query = query.eq('employee_id', employee_id);
      if (month) query = query.eq('month', month);
      if (year) query = query.eq('year', year);
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { employee_id, employee_name, month, year, basic, hra, da, deductions, net_salary, status } = req.body;
      const { data, error } = await supabase.from('payroll').insert({ employee_id, employee_name, month, year, basic, hra, da, deductions, net_salary, status }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('payroll').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
