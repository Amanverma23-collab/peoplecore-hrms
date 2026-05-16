import { useState, useEffect } from 'react';
import supabase from './lib/supabase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';

import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Performance from './pages/Performance';
import Recruitment from './pages/Recruitment';
import Announcements from './pages/Announcements';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  useEffect(()=>{

checkSession();

},[])

async function checkSession(){

const {data}=await supabase.auth.getSession();

if(data.session){

setIsLoggedIn(true);

}

}

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="h-screen bg-neu-bg text-neu-text overflow-hidden flex flex-col">

          <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-neu-bg flex-shrink-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="neu-btn p-2 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#b362ff] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>

              <span className="text-sm font-bold">
                PeopleCore
              </span>
            </div>
          </header>

          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setMobileMenuOpen(false)}
              />

              <div className="absolute left-0 top-0 h-full w-64">
                <MobileSidebar
                  onClose={() => setMobileMenuOpen(false)}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">

            <Sidebar
              open={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              onNavClick={() => {}}
              onLogout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto min-w-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/announcements" element={<Announcements />} />
              </Routes>
            </main>

          </div>
        </div>
      )}
    </BrowserRouter>
  );
}