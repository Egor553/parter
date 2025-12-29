
import React, { useState } from 'react';
import { Mentor, MeetingFormat } from '../types';
import { X, Calendar, Clock, CreditCard, Send } from 'lucide-react';

interface BookingModalProps {
  mentor: Mentor;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentor, onClose, onComplete }) => {
  const [format, setFormat] = useState<MeetingFormat>(MeetingFormat.ONLINE_1_ON_1);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [exchange, setExchange] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const slots = ['10:00', '11:30', '14:00', '16:00', '18:30'];

  const getPrice = () => format === MeetingFormat.GROUP_OFFLINE ? mentor.groupPrice : mentor.singlePrice;

  const handleSubmit = () => {
    onComplete({
      mentorId: mentor.id,
      format,
      goal,
      exchange,
      slot: selectedSlot,
      price: getPrice()
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <img src={mentor.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-bold">Бронирование встречи</h2>
              <p className="text-slate-500 text-sm">с {mentor.name}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">Выберите формат встречи</label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.values(MeetingFormat).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        format === f ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className="font-medium">{f}</span>
                      <span className="font-bold">
                        {f === MeetingFormat.GROUP_OFFLINE ? mentor.groupPrice : mentor.singlePrice} ₽
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                disabled={!format}
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Продолжить
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">Цель встречи</label>
                <textarea 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Опишите ваш главный запрос..."
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 resize-none h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Что вы готовы дать взамен?</label>
                <p className="text-xs text-slate-500 mb-3 underline">Энергообмен: контакт, помощь, упоминание...</p>
                <input 
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  placeholder="Например: помощь в поиске ассистента"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0"
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-500">Назад</button>
                <button 
                  disabled={!goal || !exchange}
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  К выбору времени
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Calendar className="w-5 h-5" />
                <span className="font-bold">Доступные слоты на завтра</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border-2 transition-all font-medium ${
                      selectedSlot === slot ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline-block mr-1 mb-0.5" />
                    {slot}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Встреча с {mentor.name}</span>
                  <span>{getPrice()} ₽</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Комиссия платформы</span>
                  <span>0 ₽</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                  <span>Итого к оплате</span>
                  <span className="text-indigo-600">{getPrice()} ₽</span>
                </div>
              </div>

              <button 
                disabled={!selectedSlot}
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <CreditCard className="w-5 h-5" />
                Оплатить через СБП
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
