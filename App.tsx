
import React, { useState } from 'react';
import { Header } from './components/Header';
import { MentorCard } from './components/MentorCard';
import { BookingModal } from './components/BookingModal';
import { MENTORS, INDUSTRIES, CITIES } from './constants';
import { Mentor, UserRole } from './types';
import { 
  Search, Sparkles, ChevronRight, CheckCircle2, Footprints, 
  Loader2, Users, Trophy, MapPin, Briefcase, 
  Video, Calendar, Zap, UserCheck, ArrowLeft, Clock, Plus, Trash2, Hourglass
} from 'lucide-react';
import { findBestMentor } from './services/geminiService';

const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxHZNtAtzpmPvn0gBHojJgAvId-zdoBiaWtaZwCZUIQlOzk6j80ERaxMODEXndekB_-/exec';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [regStep, setRegStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{id: string, reason: string} | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [browsingMode, setBrowsingMode] = useState(false);

  // Состояние для добавления нового слота
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    city: 'Москва',
    phone: '',
    email: '',
    focus: '',
    goal: '',
    exchange: '',
    business: '',
    revenue: '',
    industry: 'Маркетинг',
    values: '',
    request: '',
    videoUrl: '',
    hoursPerMonth: '4',
    slots: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSlot = () => {
    if (tempDate && tempTime) {
      const newSlot = `${tempDate} в ${tempTime}`;
      if (!formData.slots.includes(newSlot)) {
        setFormData(prev => ({ ...prev, slots: [...prev.slots, newSlot] }));
      }
      setTempDate('');
      setTempTime('');
    }
  };

  const removeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index)
    }));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isEntrepreneur = userRole === UserRole.ENTREPRENEUR;
    let payload: Record<string, any> = {};

    if (isEntrepreneur) {
      payload = {
        "имя фамилия": formData.name,
        "название компании\\проекта": formData.business,
        "оборот млн\\руб.": formData.revenue,
        "город": formData.city,
        "направление": formData.industry,
        "почта": formData.email,
        "качества в людях": formData.values,
        "запрос к молодою поколению": formData.request,
        "Видео визитка": "Загружена в систему",
        "лимит времени": formData.hoursPerMonth + " ч/мес",
        "слоты": formData.slots.join('; '),
        "Тип": "Предприниматель"
      };
    } else {
      payload = {
        "имя фамилия": formData.name,
        "дата рождения": formData.birthDate,
        "город": formData.city,
        "номер телефона": formData.phone,
        "почта": formData.email,
        "главный фокус и цель": formData.focus,
        "ожидание от встречи": formData.goal,
        "взаимная помощь предпринимателю": formData.exchange,
        "Тип": "Молодой талант"
      };
    }

    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          "Дата регистрации": new Date().toLocaleString('ru-RU')
        }),
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsFinished(true);
        if (userRole === UserRole.YOUTH) setBrowsingMode(true);
      }, 1500);
    } catch (err) {
      console.error('Ошибка отправки:', err);
      setIsSubmitting(false);
      setIsFinished(true);
      if (userRole === UserRole.YOUTH) setBrowsingMode(true);
    }
  };

  const filteredMentors = MENTORS.filter(m => {
    const matchCategory = selectedCategory === 'Все' || m.industry.includes(selectedCategory);
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setAiLoading(true);
    try {
      const result = await findBestMentor(searchQuery, MENTORS);
      setAiRecommendation(JSON.parse(result));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Выбор роли
  if (!userRole && !browsingMode) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 blur-[150px] rounded-full" />
        
        <div className="relative z-10 text-center mb-16 space-y-4">
          <div className="bg-indigo-600 inline-block p-4 rounded-[24px] shadow-2xl shadow-indigo-500/40 mb-4 animate-bounce">
            <Footprints className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">С чего начнется твой ШАГ?</h1>
          <p className="text-slate-400 text-lg">Выбери свою роль на платформе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
          <button onClick={() => setUserRole(UserRole.ENTREPRENEUR)} className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-left hover:bg-white/[0.07] transition-all hover:border-indigo-500/50 hover:scale-[1.02]">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Я Предприниматель</h3>
            <p className="text-slate-400 leading-relaxed mb-6">Готов делиться опытом, искать таланты в команду и передавать смыслы новому поколению.</p>
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-[10px] tracking-widest">Стать наставником <ChevronRight className="w-4 h-4" /></div>
          </button>

          <button onClick={() => setUserRole(UserRole.YOUTH)} className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-left hover:bg-white/[0.07] transition-all hover:border-violet-500/50 hover:scale-[1.02]">
            <div className="w-16 h-16 bg-violet-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Я Молодой талант</h3>
            <p className="text-slate-400 leading-relaxed mb-6">Ищу ответы на сложные вопросы, наставника и окружение для кратного роста.</p>
            <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-[10px] tracking-widest">Найти наставника <ChevronRight className="w-4 h-4" /></div>
          </button>
        </div>
      </div>
    );
  }

  // Регистрация
  if (!isFinished && !browsingMode) {
    const isEnt = userRole === UserRole.ENTREPRENEUR;
    const totalSteps = isEnt ? 4 : 3;
    const progress = (regStep / totalSteps) * 100;

    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        
        <div className="w-full max-w-2xl relative z-10">
          <button onClick={() => { if(regStep > 1) setRegStep(s => s-1); else setUserRole(null); }} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> {regStep === 1 ? 'Сменить роль' : 'Назад'}
          </button>

          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[48px] shadow-2xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Шаг {regStep} из {totalSteps}</p>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isEnt ? (
                    regStep === 1 ? 'Данные о бизнесе' :
                    regStep === 2 ? 'Ваши ценности' :
                    regStep === 3 ? 'Видео-визитка' : 'График встреч'
                  ) : (
                    regStep === 1 ? 'Ваши контакты' :
                    regStep === 2 ? 'Главный запрос' : 'Энергообмен'
                  )}
                </h2>
              </div>
              <div className="text-white/20 text-5xl font-black">0{regStep}</div>
            </div>

            <div className="h-1.5 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]" style={{ width: `${progress}%` }} />
            </div>

            <form onSubmit={(e) => { 
                e.preventDefault(); 
                if(regStep < totalSteps) setRegStep(s => s+1); 
                else handleFinalSubmit(e); 
              }} 
              className="space-y-6"
            >
              {regStep === 1 && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="col-span-2">
                    <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Имя Фамилия" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" />
                  </div>
                  {isEnt ? (
                    <>
                      <div className="col-span-2">
                        <input required name="business" value={formData.business} onChange={handleInputChange} placeholder="Название компании / Проекта" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" />
                      </div>
                      <input required name="revenue" value={formData.revenue} onChange={handleInputChange} placeholder="Оборот (млн ₽ / год)" className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" />
                      <select name="city" value={formData.city} onChange={handleInputChange} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none">
                        {CITIES.filter(c => c !== 'Все').map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                      </select>
                      <div className="col-span-2">
                         <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none">
                          {INDUSTRIES.filter(i => i !== 'Все').map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <input required name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none" />
                      <select name="city" value={formData.city} onChange={handleInputChange} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none">
                        {CITIES.filter(c => c !== 'Все').map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                      </select>
                      <div className="col-span-2">
                        <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+7 (___) ___-__-__" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" />
                  </div>
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {isEnt ? (
                    <>
                      <textarea required name="values" value={formData.values} onChange={handleInputChange} placeholder="Какие качества вы больше всего цените в людях?" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white h-32 resize-none outline-none focus:border-indigo-500" />
                      <textarea required name="request" value={formData.request} onChange={handleInputChange} placeholder="Ваш запрос к молодому поколению" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white h-32 resize-none outline-none focus:border-indigo-500" />
                    </>
                  ) : (
                    <>
                      <textarea required name="focus" value={formData.focus} onChange={handleInputChange} placeholder="Твой главный фокус и цель в жизни сейчас?" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white h-32 resize-none outline-none focus:border-indigo-500" />
                      <textarea required name="goal" value={formData.goal} onChange={handleInputChange} placeholder="Что ты хочешь получить от встречи?" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white h-32 resize-none outline-none focus:border-indigo-500" />
                    </>
                  )}
                </div>
              )}

              {regStep === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {isEnt ? (
                    <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-[32px] bg-white/[0.01]">
                      <Video className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
                      <h4 className="text-white font-bold mb-4">Видео-визитка</h4>
                      <label className="cursor-pointer bg-white/5 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                        Выбрать видео
                        <input type="file" accept="video/*" className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/20">
                          <Zap className="w-6 h-6 text-indigo-500 mb-4" />
                          <p className="text-slate-400 text-sm">Напиши, что ты готов дать предпринимателю взамен? (Контакт, помощь, отзыв).</p>
                       </div>
                       <textarea required name="exchange" value={formData.exchange} onChange={handleInputChange} placeholder="Твой вариант энергообмена..." className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white h-40 resize-none outline-none focus:border-indigo-500" />
                    </div>
                  )}
                </div>
              )}

              {regStep === 4 && isEnt && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <Hourglass className="w-4 h-4 text-white" />
                      </div>
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Лимит времени</label>
                    </div>
                    <p className="text-slate-400 text-xs mb-6">Сколько часов в месяц вы готовы уделять встречам и обмену?</p>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" 
                        min="1" 
                        max="40" 
                        name="hoursPerMonth" 
                        value={formData.hoursPerMonth} 
                        onChange={handleInputChange} 
                        className="flex-1 accent-indigo-600" 
                      />
                      <div className="bg-indigo-600 px-4 py-2 rounded-xl text-white font-black text-lg min-w-[60px] text-center">
                        {formData.hoursPerMonth}ч
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Добавить слоты в календарь</label>
                    <div className="flex gap-3">
                      <input type="date" value={tempDate} onChange={(e) => setTempDate(e.target.value)} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-indigo-500" />
                      <input type="time" value={tempTime} onChange={(e) => setTempTime(e.target.value)} className="w-32 bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-indigo-500" />
                      <button type="button" onClick={addSlot} className="bg-indigo-600 p-4 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ваше расписание</label>
                    {formData.slots.length === 0 ? (
                      <div className="text-slate-600 text-xs italic p-6 border border-dashed border-white/5 rounded-2xl text-center">Слоты пока не добавлены</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.slots.map((s, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white text-xs font-bold flex justify-between items-center animate-in slide-in-from-right-2">
                            <div className="flex items-center gap-3"><Calendar className="w-3 h-3 text-indigo-400" /> {s}</div>
                            <button type="button" onClick={() => removeSlot(i)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-6 rounded-2xl font-black tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-3">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (regStep === totalSteps ? 'Сделать ШАГ' : 'Далее')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Финальный экран (Для предпринимателей)
  if (isFinished && !browsingMode && userRole === UserRole.ENTREPRENEUR) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-3xl shadow-emerald-500/20 animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Анкета на модерации!</h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-12">
          Мы проверяем всех наставников на соответствие ценностям ШАГа. 
          Наш менеджер свяжется с вами для подтверждения профиля.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button 
            onClick={() => setBrowsingMode(true)} 
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
          >
            Продолжить в каталог
          </button>
          <button 
            onClick={() => { setIsFinished(false); setUserRole(null); setRegStep(1); }} 
            className="text-slate-500 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  // Каталог
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-700">
      <Header onProfileClick={() => {}} onHomeClick={() => setActiveMentor(null)} />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {activeMentor ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setActiveMentor(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" /> Назад к списку
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-10">
                <div className="relative group rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
                  <video src={activeMentor.videoUrl} className="w-full aspect-video object-cover" controls poster={activeMentor.avatarUrl} />
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <Sparkles className="w-4 h-4" /> Визитка эксперта
                  </div>
                </div>

                <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{activeMentor.industry}</span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest"><MapPin className="w-3.5 h-3.5" /> {activeMentor.city}</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{activeMentor.name}</h1>
                  
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    {[
                      { label: 'Опыт', val: activeMentor.experience, icon: Briefcase },
                      { label: 'Результат', val: '100млн+', icon: Trophy },
                      { label: 'Студентов', val: '400+', icon: Users },
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <stat.icon className="w-5 h-5 text-indigo-600 mb-3" />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="font-bold text-slate-900">{stat.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-12">
                    <section>
                      <h3 className="text-xl font-black mb-4">История и Путь</h3>
                      <p className="text-slate-500 leading-[1.8] text-lg">{activeMentor.description}</p>
                    </section>

                    <div className="bg-amber-50 p-10 rounded-[32px] border border-amber-200/50">
                      <h3 className="text-xl font-black text-amber-900 uppercase tracking-tighter mb-4">Запрос наставника</h3>
                      <p className="text-amber-800 leading-relaxed font-medium">{activeMentor.request}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-6">
                  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="mb-10 text-center">
                      <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{activeMentor.groupPrice} ₽</div>
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">групповая встреча</div>
                    </div>
                    <button onClick={() => setShowBooking(true)} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-2xl shadow-slate-300">
                      Забронировать
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-6 tracking-widest">
                      100% прибыли на развитие ШАГа
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-24">
            <section className="text-center space-y-10 max-w-5xl mx-auto py-12">
              <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-violet-600">Новое поколение лидеров</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-[900] text-slate-900 tracking-tighter leading-[0.9]">
                Найди свой путь <br />
                <span className="gradient-text italic">в один ШАГ</span>
              </h1>
              
              <div className="relative max-w-3xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <form onSubmit={handleAiAsk} className="relative bg-white p-2 rounded-[30px] shadow-2xl flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                    <input type="text" placeholder="О чем мечтаешь?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-6 rounded-[24px] bg-slate-50 border-none focus:ring-0 outline-none font-bold text-slate-900 placeholder:text-slate-300" />
                  </div>
                  <button type="submit" disabled={aiLoading} className="bg-indigo-600 text-white px-10 py-6 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200">
                    {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Подбор</span>}
                  </button>
                </form>
              </div>

              {aiRecommendation && (
                <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-3xl max-w-2xl mx-auto mt-10 animate-in zoom-in border border-white/10">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-600 p-4 rounded-3xl shrink-0"><Sparkles className="w-8 h-8" /></div>
                    <div className="text-left">
                      <p className="text-slate-200 text-lg font-medium leading-relaxed mb-4">{aiRecommendation.reason}</p>
                      <button onClick={() => {
                        const m = MENTORS.find(mentor => mentor.id === aiRecommendation.id);
                        if (m) setActiveMentor(m);
                      }} className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Смотреть профиль</button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <h2 className="text-4xl font-black tracking-tight">Выбери наставника</h2>
                <div className="flex flex-wrap items-center gap-3">
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => setSelectedCategory(ind)}
                      className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        selectedCategory === ind ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'
                      }`}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredMentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} onClick={(m) => setActiveMentor(m)} />)}
              </div>
            </section>
          </div>
        )}
      </main>

      {showBooking && activeMentor && (
        <BookingModal mentor={activeMentor} onClose={() => setShowBooking(false)} onComplete={() => {
            setShowBooking(false);
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 5000);
        }} />
      )}

      {showConfirmation && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[24px] shadow-3xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <p className="text-sm font-bold text-slate-300 italic">Твой ШАГ сделан. Ожидай звонка ассистента.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
