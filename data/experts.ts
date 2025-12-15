import { Expert } from '@/types';

export const experts: Expert[] = [
  {
    id: 'dr-maria-santos',
    name: 'Dr. Maria Santos',
    specialty: 'Medical Interpretation Expert',
    experience: '15+ years in medical interpretation',
    bio: 'Dr. Santos has trained thousands of medical interpreters worldwide and specializes in vocal delivery and cultural competency.',
    image: '/images/experts/maria.jpg',
    audioUrl: '/audio/maria-tip.mp3',
    tip: 'The key to effective interpretation is finding the perfect balance between empathy and neutrality. Your voice should convey warmth without adding emotion that wasn\'t in the original message.',
  },
  {
    id: 'carlos-rodriguez',
    name: 'Carlos Rodriguez',
    specialty: 'Voice Coach & Linguist',
    experience: '12 years coaching interpreters',
    bio: 'Carlos combines his background in linguistics and voice training to help interpreters develop their professional voice and manage vocal fatigue.',
    image: '/images/experts/carlos.jpg',
    audioUrl: '/audio/carlos-tip.mp3',
    tip: 'Your pace should match the urgency of the situation, but never sacrifice clarity. In emergencies, speak clearly and deliberately—rushed speech leads to errors.',
  },
  {
    id: 'dr-jennifer-chen',
    name: 'Dr. Jennifer Chen',
    specialty: 'Cross-Cultural Communication',
    experience: '20 years in healthcare linguistics',
    bio: 'Dr. Chen is a leading expert in cross-cultural healthcare communication and has published extensively on the role of voice in building trust.',
    image: '/images/experts/jennifer.jpg',
    audioUrl: '/audio/jennifer-tip.mp3',
    tip: 'Vocal flexibility is crucial. Practice shifting between authoritative tones for medical instructions and gentle tones for sensitive conversations.',
  },
  {
    id: 'ahmed-hassan',
    name: 'Ahmed Hassan',
    specialty: 'Emergency Medical Interpretation',
    experience: '10 years in ER interpretation',
    bio: 'Ahmed specializes in high-stress medical interpretation and teaches techniques for maintaining composure and clarity in critical situations.',
    image: '/images/experts/ahmed.jpg',
    audioUrl: '/audio/ahmed-tip.mp3',
    tip: 'In emergency situations, your voice is an anchor for everyone in the room. Keep it steady, strong, and clear. Practice deep breathing techniques to maintain control under pressure.',
  },
];
