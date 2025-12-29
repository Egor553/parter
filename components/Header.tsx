
import React from 'react';
import { Footprints, User, Bell } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-[60] glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900">ШАГ</span>
            <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase -mt-1">платформа</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
          <button onClick={onHomeClick} className="hover:text-indigo-600 transition-colors">Наставники</button>
          <a href="#" className="hover:text-indigo-600 transition-colors">Сообщество</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Миссия</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-2 pl-2 pr-5 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold border-2 border-slate-800">
              Ю
            </div>
            <span className="text-sm font-semibold">Кабинет</span>
          </button>
        </div>
      </div>
    </header>
  );
};
