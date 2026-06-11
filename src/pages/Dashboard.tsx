import { useState, useEffect } from 'react';
import { Users, Building2, Clock, CalendarOff, IndianRupee, Briefcase, AlertCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import StatCard from '../components/StatCard';
import CompanySettingsDrawer from '../components/CompanySettingsDrawer';
export default function Dashboard() {
  const companyName =
localStorage.getItem("company_name");
  const [stats, setStats] = useState({ employees: 0, departments: 0, presentToday: 0, pendingLeaves: 0, totalPayroll: 0, openPositions: 0 });
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
console.log("DASHBOARD COMPANY", companyId);
    const fetchDashboard = async () => {
      try {
       const [empRes, deptRes, attRes, leaveRes, payRes, recRes, annRes] = await Promise.all([

  supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId),

  supabase
    .from('departments')
    .select('*')
    .eq('company_id', companyId),

  supabase
    .from('attendance')
    .select('*')
    .eq('company_id', companyId)
    .eq('date', new Date().toISOString().split('T')[0]),

  supabase
    .from('leaves')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'Pending'),

  supabase
    .from('payroll')
    .select('*')
    .eq('company_id', companyId),

  supabase
    .from('recruitment')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'Open'),

  supabase
    .from('announcements')
    .select('*')
    .eq('company_id', companyId)
    .order('id', { ascending: false }),

]);
        const employees = empRes.data || [];
        const departments = deptRes.data || [];
        const attendance = attRes.data || [];
        const leaves = leaveRes.data || [];
        const payroll = payRes.data || [];
        const recruitment = recRes.data || [];
        const announcements = annRes.data || [];
        const activeEmps = employees.filter((e: any) => e.status === 'Active').length;
        const totalPay = payroll.reduce((sum: number, p: any) => sum + (parseFloat(p.net_salary) || 0), 0);
        setStats({ employees: activeEmps, departments: departments.length, presentToday: attendance.filter((a: any) => a.status === 'Present').length, pendingLeaves: leaves.length, totalPayroll: totalPay, openPositions: recruitment.length });
        setRecentLeaves(leaves.slice(0, 5));
        setRecentAnnouncements(announcements.slice(0, 4));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  const statCards = [
    { title: 'Total Employees', value: stats.employees, icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />, color: 'bg-blue-100' },
    { title: 'Departments', value: stats.departments, icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />, color: 'bg-purple-100' },
    { title: 'Present Today', value: stats.presentToday, icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />, color: 'bg-green-100' },
    { title: 'Pending Leaves', value: stats.pendingLeaves, icon: <CalendarOff className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />, color: 'bg-amber-100' },
    { title: 'Monthly Payroll', value: `₹${stats.totalPayroll.toLocaleString('en-IN')}`, icon: <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />, color: 'bg-emerald-100' },
    { title: 'Open Positions', value: stats.openPositions, icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />, color: 'bg-rose-100' },
  ];

return (
  <>
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">

      <div className="flex items-start justify-between gap-4">

  <div>
    <h1 className="text-xl sm:text-2xl font-bold text-neu-text">
      {companyName}
    </h1>

    <p className="text-neu-muted text-xs sm:text-sm mt-1">
      Welcome back! Here's your HR overview.
    </p>
  </div>

  <button
    onClick={() => setSettingsOpen(true)}
    
    className="neu-btn p-3 rounded-xl cursor-pointer"
  >
    <Settings className="w-5 h-5" />

  </button>

</div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {statCards.map((card, i) => (<StatCard key={card.title} {...card} index={i} />))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="neu-raised p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-neu-text mb-3 sm:mb-4 flex items-center gap-2"><CalendarOff className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Pending Leave Requests</h3>
          {recentLeaves.length === 0 ? (<p className="text-neu-subtle text-sm">No pending leave requests</p>) : (
            <div className="space-y-2 sm:space-y-3">{recentLeaves.map((leave: any) => (
              <div key={leave.id} className="flex items-start sm:items-center justify-between p-3 neu-inset-sm gap-2">
                <div className="min-w-0"><p className="text-sm font-medium text-neu-text">{leave.employee_name}</p><p className="text-xs text-neu-muted">{leave.leave_type} · {leave.days} day(s) · {leave.start_date}</p></div>
                <span className="neu-badge bg-amber-100 text-amber-600">Pending</span>
              </div>
            ))}</div>
          )}
        </div>
        <div className="neu-raised p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-neu-text mb-3 sm:mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /> Recent Announcements</h3>
          {recentAnnouncements.length === 0 ? (<p className="text-neu-subtle text-sm">No announcements yet</p>) : (
            <div className="space-y-2 sm:space-y-3">{recentAnnouncements.map((ann: any) => (
              <div key={ann.id} className="p-3 neu-inset-sm">
                <div className="flex items-start justify-between mb-1 gap-2"><p className="text-sm font-medium text-neu-text">{ann.title}</p>
                  <span className={`neu-badge ${ann.priority === 'High' ? 'bg-red-100 text-red-600' : ann.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{ann.priority}</span>
                </div>
                <p className="text-xs text-neu-muted line-clamp-2">{ann.message}</p>
              </div>
            ))}</div>
          )}
              </div>
      </div>

      <CompanySettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>

  </>
);
}
  