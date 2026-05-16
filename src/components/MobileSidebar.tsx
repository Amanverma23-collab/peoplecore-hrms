import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Clock, CalendarOff, IndianRupee, TrendingUp, Briefcase, Megaphone, Shield, X, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/departments', icon: Building2, label: 'Departments' },
  { to: '/attendance', icon: Clock, label: 'Attendance' },
  { to: '/leaves', icon: CalendarOff, label: 'Leave Mgmt' },
  { to: '/payroll', icon: IndianRupee, label: 'Payroll' },
  { to: '/performance', icon: TrendingUp, label: 'Performance' },
  { to: '/recruitment', icon: Briefcase, label: 'Recruitment' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
];

export default function MobileSidebar({ onClose, onLogout }: { onClose: () => void; onLogout: () => void }) {
  return (
    <aside className="flex flex-col h-full w-64 bg-neu-bg neu-sidebar">
      <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#b362ff] flex items-center justify-center flex-shrink-0"><Shield className="w-5 h-5 text-white" /></div>
        <span className="text-base font-bold bg-gradient-to-r from-[#6c63ff] to-[#b362ff] bg-clip-text text-transparent flex-1">PeopleCore</span>
        <button onClick={onClose} className="neu-btn p-1.5 rounded-xl"><X className="w-4 h-4" /></button>
      </div>
      <nav className="flex-1 py-4 space-y-1.5 px-3 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#6c63ff] to-[#b362ff] text-white font-semibold'
                  : 'text-neu-muted hover:text-neu-text'
              }`
            }
            style={({ isActive }) => isActive ? { boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff' } : {}}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button onClick={() => { onClose(); onLogout(); }} className="mx-3 mb-4 neu-btn flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-500">
        <LogOut className="w-4 h-4" /><span className="text-sm">Logout</span>
      </button>
    </aside>
  );
}