
import React from 'react';
import { Mentor } from '../types';
import { MapPin, Briefcase, Star, Play } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onClick: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mentor)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={mentor.avatarUrl} 
          alt={mentor.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <Play className="w-4 h-4 fill-white" />
            Смотреть визитку
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur shadow-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            {mentor.industry}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
            <span className="text-sm font-bold">5.0</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Briefcase className="w-4 h-4" />
            <span>{mentor.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{mentor.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400">От</div>
          <div className="text-lg font-bold text-indigo-600">
            {mentor.groupPrice} ₽ <span className="text-xs font-normal text-slate-500">/ чел</span>
          </div>
        </div>
      </div>
    </div>
  );
};
