
import { Mentor } from './types';

export const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Александр Соколовский',
    industry: 'Маркетинг / Образование',
    city: 'Москва',
    experience: '10+ лет в бизнесе',
    description: 'Основатель Tooligram и автор популярного подкаста. Эксперт по привлечению трафика и системному маркетингу.',
    achievements: [
      'Оборот компаний 500млн+ в год',
      'Автор топового YouTube канала',
      'Более 5000 учеников'
    ],
    request: 'Ищу свежие идеи в сфере AI-маркетинга и ассистента с горящими глазами.',
    values: ['Честность', 'Скорость', 'Твердость'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://picsum.photos/seed/alex/400/400',
    singlePrice: 2500,
    groupPrice: 800
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    industry: 'HoReCa',
    city: 'Санкт-Петербург',
    experience: '8 лет в ресторанном бизнесе',
    description: 'Владелец сети кофеен и кондитерских. Знаю всё о том, как построить бизнес на любви к продукту.',
    achievements: [
      'Сеть из 15 точек',
      'Семья, двое детей',
      'Выручка 150млн+ в год'
    ],
    request: 'Хочу познакомиться с молодыми талантами в дизайне интерьеров.',
    values: ['Семейные ценности', 'Искренность', 'Труд'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://picsum.photos/seed/maria/400/400',
    singlePrice: 1500,
    groupPrice: 800
  },
  {
    id: '3',
    name: 'Иван Петров',
    industry: 'Финтех',
    city: 'Новосибирск',
    experience: '15 лет в IT',
    description: 'Топ-менеджер крупного банка, развивал проекты с нуля до миллионной аудитории.',
    achievements: [
      'Запуск 3х финтех стартапов',
      'Опыт управления командами 100+',
      'Твердые навыки в масштабировании'
    ],
    request: 'Ищу контакты в сфере блокчейн-разработки.',
    values: ['Инновации', 'Ответственность', 'Масштаб'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://picsum.photos/seed/ivan/400/400',
    singlePrice: 1500,
    groupPrice: 800
  },
  {
    id: '4',
    name: 'Михаил Гребенюк',
    industry: 'Продажи',
    city: 'Москва',
    experience: '12 лет в продажах',
    description: 'Основатель "Resulting". Помогаю строить отделы продаж, которые работают как часы.',
    achievements: [
      'Построил 500+ отделов продаж',
      'Медийный предприниматель',
      'Автор книг-бестселлеров'
    ],
    request: 'Обмен энергией с амбициозными ребятами. Ищу таланты в команду.',
    values: ['Результат', 'Дисциплина', 'Энергия'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    avatarUrl: 'https://picsum.photos/seed/misha/400/400',
    singlePrice: 10000,
    groupPrice: 2000
  }
];

export const INDUSTRIES = ['Все', 'Маркетинг', 'HoReCa', 'Финтех', 'Продажи', 'IT', 'Финансы'];
export const CITIES = ['Все', 'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'];
