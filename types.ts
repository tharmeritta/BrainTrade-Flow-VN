export type Language = 'en' | 'vn';

export interface BilingualText {
  en: string;
  vn: string;
}

export interface StepPoint {
  id: string;
  text: BilingualText;
  isChecklist?: boolean;
}

export interface Step {
  id: string;
  title: BilingualText;
  timeLimit: string; // e.g., "1 min", "<= 30mins"
  description?: BilingualText;
  points: StepPoint[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
