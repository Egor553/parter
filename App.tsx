
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MentorCard } from './components/MentorCard';
import { BookingModal } from './components/BookingModal';
import { MENTORS, INDUSTRIES, CITIES } from './constants';
import { Mentor, UserProfile } from './types';
// Fixed missing 'Footprints' icon in the lucide-react import list
import { Search, Sparkles, Filter, ChevronRight, CheckCircle2, Footprints } from 'lucide-react';
import { findBestMentor } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{id: string, reason: string} | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simple registration simulation
  const [showReg, setShowReg] = useState(true);

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

  const handleBookingComplete = (data: any) => {
    console.log('Booking complete:', data);
    setShowBooking(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  if (showReg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 w-full max-w-md">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Добро пожаловать в ШАГ</h1>
          </div>
          <p className="text-slate-500 text-center mb-8">Чтобы мы подобрали идеального наставника, заполните короткую анкету.</p>
          <div className="space-y-4">
            <input placeholder="Имя Фамилия" className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none" />
            <input type="date" className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none" />
            <select className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none">
              <option>Выберите город</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="Ваш главный фокус и цель в жизни?" className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none h-24" />
            <button 
              onClick={() => setShowReg(false)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200"
            >
              Войти на платформу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onProfileClick={() => setIsProfileOpen(true)} onHomeClick={() => setActiveMentor(null)} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {activeMentor ? (
          <div className="animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setActiveMentor(null)}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Назад к списку
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                  <video 
                    src={activeMentor.videoUrl} 
                    className="w-full h-full object-cover"
                    controls
                    poster={activeMentor.avatarUrl}
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Визитка наставника
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                  <h1 className="text-3xl font-extrabold mb-2">{activeMentor.name}</h1>
                  <p className="text-indigo-600 font-semibold text-lg mb-6">{activeMentor.industry}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Опыт</p>
                      <p className="font-bold text-slate-700">{activeMentor.experience}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Город</p>
                      <p className="font-bold text-slate-700">{activeMentor.city}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Рейтинг</p>
                      <p className="font-bold text-slate-700">5.0 (42 отзыва)</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-indigo-600" /> Об эксперте
                      </h3>
                      <p className="text-slate-600 leading-relaxed">{activeMentor.description}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Твердые результаты
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeMentor.achievements.map((a, i) => (
                          <li key={i} className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                            <span className="text-sm font-medium text-slate-700">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                      <h3 className="text-lg font-bold mb-2 text-amber-900">Запрос наставника</h3>
                      <p className="text-amber-800 text-sm">{activeMentor.request}</p>
                    </section>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24">
                  <div className="mb-6">
                    <p className="text-slate-500 text-sm mb-1">Групповая встреча</p>
                    <div className="text-3xl font-black text-slate-900">от 800 ₽</div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-500">Длительность (соло)</span>
                      <span className="font-bold">30 - 120 мин</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-500">Длительность (группа)</span>
                      <span className="font-bold">2 - 4 часа</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-500">Тип связи</span>
                      <span className="font-bold">Zoom / Оффлайн</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1"
                  >
                    Забронировать
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">Вся комиссия идет на развитие платформы</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <section className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                <Sparkles className="w-4 h-4" /> Твой следующий ШАГ к успеху
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                Встречайся с лучшими <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent underline decoration-indigo-200 decoration-8 underline-offset-4">на своих условиях</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl">
                Платформа-мост между поколениями. Твердые эксперты, искренние цели и энергия роста.
              </p>
              
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 max-w-2xl mx-auto">
                <form onSubmit={handleAiAsk} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Опишите ваш запрос... (например: хочу открыть кофейню)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={aiLoading}
                    className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shrink-0"
                  >
                    {aiLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="hidden md:inline">Спросить ИИ</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {aiRecommendation && (
                <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-2xl max-w-2xl mx-auto mt-6 animate-in zoom-in slide-in-from-top-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Sparkles className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-medium text-left leading-snug">
                      <span className="font-black">ИИ Рекомендует:</span> {aiRecommendation.reason}
                    </p>
                    <button 
                      onClick={() => {
                        const m = MENTORS.find(mentor => mentor.id === aiRecommendation.id);
                        if (m) setActiveMentor(m);
                      }}
                      className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap hover:bg-indigo-50 transition-colors"
                    >
                      К профилю
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {INDUSTRIES.map(ind => (
                    <button 
                      key={ind}
                      onClick={() => setSelectedCategory(ind)}
                      className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                        selectedCategory === ind ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-white border border-slate-200 text-sm font-bold rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c === 'Все' ? 'Любой город' : c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMentors.map(mentor => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor} 
                    onClick={(m) => setActiveMentor(m)} 
                  />
                ))}
              </div>

              {filteredMentors.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">По вашему запросу наставников не найдено...</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Footprints className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ШАГ</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Платформа, где опыт становится доступным каждому молодому мечтателю.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Навигация</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Все эксперты</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Сообщество</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">База знаний</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Для наставников</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Стать наставником</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Личный бренд</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Миссия</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Контакты</h4>
            <p className="text-sm text-slate-500">support@shag.platform</p>
            <div className="flex gap-4 mt-4">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer">
                <span className="text-xs font-bold">TG</span>
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer">
                <span className="text-xs font-bold">VK</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          © 2024 ШАГ Платформа. Все права защищены. Человеку нужен человек.
        </div>
      </footer>

      {showBooking && activeMentor && (
        <BookingModal 
          mentor={activeMentor} 
          onClose={() => setShowBooking(false)} 
          onComplete={handleBookingComplete}
        />
      )}

      {showConfirmation && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-8">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Встреча успешно забронирована!</p>
              <p className="text-xs opacity-90">Уведомление отправлено на почту и в Telegram.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
