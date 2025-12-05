import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, Tornado, MessageSquareText, Calculator } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path) ? "text-emerald-600" : "text-slate-400 hover:text-emerald-500";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md z-10 sticky top-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Tornado className="w-6 h-6" />
                <h1 className="text-xl font-bold tracking-tight">Neka</h1>
            </div>
            <div className="text-xs bg-emerald-700 px-2 py-1 rounded">Beta</div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 w-full max-w-3xl mx-auto no-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-2 px-4 flex justify-between items-center z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:justify-center md:gap-12">
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 min-w-[50px] ${isActive('dashboard')}`}>
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>
        <Link to="/harvests" className={`flex flex-col items-center gap-1 min-w-[50px] ${isActive('harvests')}`}>
          <Sprout size={22} />
          <span className="text-[10px] font-medium">Cosechas</span>
        </Link>
        <Link to="/calculator" className={`flex flex-col items-center gap-1 min-w-[50px] ${isActive('calculator')}`}>
          <Calculator size={22} />
          <span className="text-[10px] font-medium">Calc</span>
        </Link>
        <Link to="/assistant" className={`flex flex-col items-center gap-1 min-w-[50px] ${isActive('assistant')}`}>
          <div className="relative">
            <MessageSquareText size={22} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-medium">IA</span>
        </Link>
      </nav>
    </div>
  );
};