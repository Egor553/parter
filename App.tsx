
import React, { useState } from 'react';
import { Header } from './components/Header';
import { MentorCard } from './components/MentorCard';
import { BookingModal } from './components/BookingModal';
import { MENTORS, INDUSTRIES, CITIES } from './constants';
import { Mentor } from './types';
// Fixed: Added missing MapPin and Briefcase icons to the lucide-react import
import { Search, Sparkles, Filter, ChevronRight, CheckCircle2, Footprints, Loader2, Globe, Users, Trophy, MapPin, Briefcase } from 'lucide-react';
import { findBestMentor } from './services/geminiService';

const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwTBXorP8xBdOQe9wPCQcLQwKwxLSBfuxEir2JEf2ohmNJLSWD-DxuFyhHzsBzbRwFF/exec';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{id: string, reason: string} | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReg, setShowReg] = useState(true);
  const [regData, setRegData] = useState({
    name: '',
    birthDate: '',
    city: 'Москва',
    focus: '',
    phone: ''
  });

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...regData, timestamp: new Date().toLocaleString(), source: 'ШАГ Платформа' }),
      });
      setTimeout(() => { setIsSubmitting(false); setShowReg(false); }, 1000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setShowReg(false);
    }
  };

  // Fixed: Defined handleBookingComplete to process the booking result and show confirmation
  const handleBookingComplete = (data: any) => {
    console.log('Booking submitted successfully:', data);
    setShowBooking(false);
    setShowConfirmation(true);
    // Hide the confirmation message after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 5000);
  };

  const filteredMentors = MENTORS.filter(m => {
    const matchCategory = selectedCategory === 'Все' || m.industry.includes(selectedCategory);
    const matchCity = selectedCity === 'Все' || m.city === selectedCity;
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchCity && matchSearch;
  });

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setAiLoading(true);
    try {
      const result = await findBestMentor(searchQuery, MENTORS);
      const parsed = JSON.parse(result);
      setAiRecommendation(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (showReg) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
        
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl w-full max-w-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/20 mb-6">
              <Footprints className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Сделай свой первый ШАГ</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Заполни анкету, чтобы платформа подобрала наставника под твои ценности.</p>
          </div>

          <form onSubmit={handleRegistration} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input required name="name" value={regData.name} onChange={handleRegChange} placeholder="Имя и Фамилия" 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none transition-all" />
              </div>
              <input required name="birthDate" type="date" value={regData.birthDate} onChange={handleRegChange}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none transition-all focus:border-indigo-500" />
              <select name="city" value={regData.city} onChange={handleRegChange}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none transition-all focus:border-indigo-500">
                {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c === 'Все' ? 'Город' : c}</option>)}
              </select>
            </div>
            <input required name="phone" type="tel" value={regData.phone} onChange={handleRegChange} placeholder="+7 (___) ___-__-__" 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none transition-all" />
            <textarea required name="focus" value={regData.focus} onChange={handleRegChange} placeholder="Твой главный фокус и цель в жизни сейчас?" 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none h-32 resize-none transition-all" />
            
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black tracking-widest uppercase text-xs shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Начать путь'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header onProfileClick={() => {}} onHomeClick={() => setActiveMentor(null)} />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {activeMentor ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setActiveMentor(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" /> Назад к списку
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-10">
                <div className="relative group rounded-[40px] overflow-hidden shadow-2xl bg-slate-900">
                  <video src={activeMentor.videoUrl} className="w-full aspect-video object-cover" controls poster={activeMentor.avatarUrl} />
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <Sparkles className="w-4 h-4" /> Визитка эксперта
                  </div>
                </div>

                <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {activeMentor.industry}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" /> {activeMentor.city}
                    </span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{activeMentor.name}</h1>
                  
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    {[
                      { label: 'Опыт', val: activeMentor.experience, icon: Briefcase },
                      { label: 'Результат', val: '100млн+ / год', icon: Trophy },
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
                      <h3 className="text-xl font-black mb-4 flex items-center gap-3">История и Путь</h3>
                      <p className="text-slate-500 leading-[1.8] text-lg">{activeMentor.description}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3">Ключевые достижения</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeMentor.achievements.map((a, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-slate-700 font-semibold leading-relaxed">{a}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="bg-amber-50 p-10 rounded-[32px] border border-amber-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-amber-400 rounded-full" />
                        <h3 className="text-xl font-black text-amber-900 uppercase tracking-tighter">Запрос наставника</h3>
                      </div>
                      <p className="text-amber-800 leading-relaxed font-medium">{activeMentor.request}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-6">
                  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="mb-10 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Тариф на выбор</span>
                      <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{activeMentor.groupPrice} ₽</div>
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">за групповой формат</div>
                    </div>
                    
                    <div className="space-y-5 mb-10">
                      <div className="flex justify-between items-center py-4 border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Индивидуально</span>
                        <span className="text-lg font-black">{activeMentor.singlePrice} ₽</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Длительность</span>
                        <span className="text-sm font-black italic">до 2 часов</span>
                      </div>
                    </div>

                    <button onClick={() => setShowBooking(true)} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-2xl shadow-slate-300">
                      Забронировать встречу
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-6 tracking-widest leading-loose">
                      Человеку нужен человек <br/> 100% комиссии идет на развитие ШАГа
                    </p>
                  </div>
                  
                  <div className="bg-indigo-600 p-8 rounded-[40px] text-white">
                    <Users className="w-8 h-8 mb-4 opacity-50" />
                    <h4 className="text-xl font-black mb-2 leading-tight">Попади в закрытое комьюнити</h4>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6">После первой встречи ты получишь доступ в сообщество будущих лидеров.</p>
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400" />)}
                      <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black">+120</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-24">
            <section className="text-center space-y-10 max-w-5xl mx-auto py-12">
              <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-100 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Новое поколение лидеров
              </div>
              <h1 className="text-6xl md:text-8xl font-[900] text-slate-900 tracking-tighter leading-[0.9]">
                Найди свой путь <br />
                <span className="gradient-text italic">в один ШАГ</span>
              </h1>
              <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                Доступные встречи с миллиардерами и экспертами для тех, кто готов расти.
              </p>
              
              <div className="relative max-w-3xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <form onSubmit={handleAiAsk} className="relative bg-white p-2 rounded-[30px] shadow-2xl flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                    <input type="text" placeholder="О чем мечтаешь? (например: хочу в IT из маркетинга)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-6 rounded-[24px] bg-slate-50 border-none focus:ring-0 outline-none font-bold text-slate-900 placeholder:text-slate-300" />
                  </div>
                  <button type="submit" disabled={aiLoading} className="bg-indigo-600 text-white px-10 py-6 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-200">
                    {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> <span>ИИ Подбор</span></>}
                  </button>
                </form>
              </div>

              {aiRecommendation && (
                <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-3xl max-w-2xl mx-auto mt-10 animate-in zoom-in duration-500 border border-white/10">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-600 p-4 rounded-3xl shrink-0">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Мнение интеллекта</p>
                      <p className="text-slate-200 text-lg font-medium leading-relaxed mb-4">{aiRecommendation.reason}</p>
                      <button onClick={() => {
                        const m = MENTORS.find(mentor => mentor.id === aiRecommendation.id);
                        if (m) setActiveMentor(m);
                      }} className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-400 transition-colors">Перейти к профилю</button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tight">Выбери наставника</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Каталог отобранных экспертов</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => setSelectedCategory(ind)}
                      className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        selectedCategory === ind ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600 hover:text-indigo-600'
                      }`}>
                      {ind}
                    </button>
                  ))}
                  <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block" />
                  <select onChange={(e) => setSelectedCity(e.target.value)} className="bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest rounded-2xl px-6 py-3 outline-none cursor-pointer hover:border-indigo-600">
                    {CITIES.map(c => <option key={c} value={c}>{c === 'Все' ? 'Локация' : c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredMentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} onClick={(m) => setActiveMentor(m)} />)}
              </div>

              {filteredMentors.length === 0 && (
                <div className="text-center py-32 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Никто не найден. Попробуй изменить фильтры.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8 col-span-1 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl">
                <Footprints className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">ШАГ</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Платформа доступного наставничества. Мы верим, что один разговор может изменить жизнь.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Платформа</h4>
            <ul className="text-sm font-bold text-slate-400 space-y-4">
              <li><a href="#" className="hover:text-indigo-600">Все наставники</a></li>
              <li><a href="#" className="hover:text-indigo-600">Для предпринимателей</a></li>
              <li><a href="#" className="hover:text-indigo-600">Миссия проекта</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Комьюнити</h4>
            <ul className="text-sm font-bold text-slate-400 space-y-4">
              <li><a href="#" className="hover:text-indigo-600">Закрытый клуб</a></li>
              <li><a href="#" className="hover:text-indigo-600">Мероприятия</a></li>
              <li><a href="#" className="hover:text-indigo-600">Подкасты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Связь</h4>
            <p className="text-sm font-bold text-slate-900 mb-6">hello@shag.platform</p>
            <div className="flex gap-4">
              {[1,2,3].map(i => <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"><Globe className="w-5 h-5" /></div>)}
            </div>
          </div>
        </div>
      </footer>

      {showBooking && activeMentor && (
        <BookingModal mentor={activeMentor} onClose={() => setShowBooking(false)} onComplete={handleBookingComplete} />
      )}

      {showConfirmation && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[24px] shadow-3xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="font-black uppercase text-[10px] tracking-widest text-emerald-400">Успешно</p>
              <p className="text-sm font-bold text-slate-300 italic">Твой ШАГ сделан. Проверь почту.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
