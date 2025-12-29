
export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  YOUTH = 'youth'
}

export enum MeetingFormat {
  ONLINE_1_ON_1 = 'Онлайн 1 на 1',
  OFFLINE_1_ON_1 = 'Оффлайн 1 на 1',
  GROUP_OFFLINE = 'Групповая встреча (до 10 чел)'
}

export interface Mentor {
  id: string;
  name: string;
  industry: string;
  city: string;
  experience: string;
  description: string;
  achievements: string[];
  request: string;
  values: string[];
  videoUrl: string;
  avatarUrl: string;
  singlePrice: number;
  groupPrice: number;
}

export interface EntrepreneurProfile {
  name: string;
  businessName: string;
  revenue: string;
  industry: string;
  values: string;
  request: string;
  videoUrl: string;
  hoursPerMonth: string;
  slots: string[];
}

export interface YouthProfile {
  name: string;
  birthDate: string;
  city: string;
  mainFocus: string;
  meetingGoal: string;
  energyExchange: string;
  email: string;
  phone: string;
}
