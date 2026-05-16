import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Clock, CalendarOff, IndianRupee, TrendingUp, Briefcase, Megaphone, ChevronLeft, ChevronRight, Shield, LogOut } from 'lucide-react';

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

export default function Sidebar({ open, onToggle, onNavClick, onLogout }: { open: boolean; onToggle: () => void; onNavClick: () => void; onLogout: () => void }) {
  return (
    <aside className={`hidden md:flex flex-col h-full bg-neu-bg neu-sidebar flex-shrink-0 transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#b362ff] flex items-center justify-center flex-shrink-0" style={{boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'}}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        {open && <span className="text-lg font-bold bg-gradient-to-r from-[#6c63ff] to-[#b362ff] bg-clip-text text-transparent whitespace-nowrap">PeopleCore</span>}
      </div>
      <nav className="flex-1 py-4 space-y-1.5 px-3 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#6c63ff] to-[#b362ff] text-white font-semibold'
                  : 'text-neu-muted hover:text-neu-text'
              }`
            }
            style={({ isActive }) => isActive ? { boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff' } : {}}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {open && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Logout */}
      <button onClick={onLogout} className="mx-3 mb-2 neu-btn flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:text-red-600">
        <LogOut className="w-4 h-4" />
        {open && <span className="text-xs">Logout</span>}
      </button>
      <button onClick={onToggle} className="mx-3 mb-4 neu-btn flex items-center justify-center gap-2 px-3 py-2 rounded-xl">
        {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {open && <span className="text-xs">Collapse</span>}
      </button>
    </aside>
  );
}