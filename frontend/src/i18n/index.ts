import en from './en.json';
import hi from './hi.json';

export type Language = 'en' | 'hi';

export const translations = {
  en,
  hi,
};

export const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
];

export default translations;
