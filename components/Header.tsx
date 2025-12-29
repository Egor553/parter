
import React from 'react';
import { Footprints, User, Menu } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Footprints className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ШАГ</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={onHomeClick} className="hover:text-indigo-600 transition-colors">Наставники</button>
          <a href="#" className="hover:text-indigo-600 transition-colors">Сообщество</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">О проекте</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all text-sm font-medium"
          >
            <User className="w-4 h-4" />
            Личный кабинет
          </button>
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
