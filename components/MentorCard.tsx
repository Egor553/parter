
import React from 'react';
import { Mentor } from '../types';
import { MapPin, Briefcase, Star, ArrowUpRight } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onClick: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mentor)}
      className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 mentor-card-shadow transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={mentor.avatarUrl} 
          alt={mentor.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {mentor.industry.split(' / ')[0]}
          </span>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
            </div>
            <span className="text-[10px] font-black uppercase opacity-80">PRO Mentor</span>
          </div>
          <h3 className="text-xl font-bold leading-tight">{mentor.name}</h3>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {mentor.description}
        </p>
        
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Встреча от</span>
            <span className="text-xl font-extrabold text-slate-900">{mentor.groupPrice} ₽</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase">
            <MapPin className="w-3 h-3" />
            {mentor.city}
          </div>
        </div>
      </div>
    </div>
  );
};
