# VoiceCoach Pro

A comprehensive voice coaching platform for medical interpreters with real-time vocal analysis, interactive practice scenarios, progress tracking, and a complete authentication system.

## Features

### 🎙️ Real-Time Vocal Analysis
- Animated WaveformVisualizer component for audio feedback
- VocalMeter showing pitch, pace, and volume with target zones
- Live metrics during practice sessions

### 📚 Practice Modules
- **Vocal Dashboard**: Real-time simulated vocal metrics
- **Scenario Library**: 8 medical scenarios with search and filtering
  - Emergency Care, Pediatrics, Surgery, Mental Health
  - Pharmacy, Obstetrics, Primary Care, Care Coordination
- **Daily Warmup**: 6 timed vocal exercises
- **Tone Shift Drills**: Practice empathetic, authoritative, and neutral tones
- **Baseline Assessment**: Initial vocal profiling

### 📊 Progress Tracking
- Comprehensive stats dashboard
- Weekly activity charts
- 8 achievement badges
- Session history and metrics

### 🔐 Authentication System
- Email/password authentication
- Social login (Google, Microsoft)
- Secure user profiles
- Password reset functionality

### 💾 Data Persistence
- 5 database tables with Row Level Security:
  - user_profiles
  - user_progress
  - practice_sessions
  - user_badges
  - baseline_assessments
- Auto-create user profile on signup
- All practice data saved to database

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/newave-solutions/interpreFlo.git
cd interpreFlo
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - Enable Email auth and configure OAuth providers (Google, Microsoft)

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
interpreFlo/
├── app/                    # Next.js app router pages
│   ├── practice/          # Practice center page
│   ├── progress/          # Progress dashboard page
│   └── auth/callback/     # OAuth callback handler
├── components/            # React components
│   ├── WaveformVisualizer.tsx
│   ├── VocalMeter.tsx
│   ├── ProgressRing.tsx
│   ├── Badge.tsx
│   ├── ScenarioCard.tsx
│   ├── ExpertCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AuthModal.tsx
│   ├── ProfileModal.tsx
│   ├── VocalDashboard.tsx
│   ├── ScenarioLibrary.tsx
│   ├── DailyWarmup.tsx
│   ├── ToneShiftDrills.tsx
│   ├── BaselineAssessment.tsx
│   ├── PracticeSession.tsx
│   └── ProgressDashboard.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── data/                  # Static data
│   ├── scenarios.ts
│   ├── experts.ts
│   └── badges.ts
├── lib/                   # Utilities
│   └── supabase.ts
├── types/                 # TypeScript types
│   └── index.ts
└── supabase/             # Database schema
    └── schema.sql
```

## Database Schema

The platform uses 5 main tables:

1. **user_profiles**: User account information
2. **user_progress**: Overall practice statistics
3. **practice_sessions**: Individual session records
4. **user_badges**: Earned achievements
5. **baseline_assessments**: Initial vocal profiles

All tables include Row Level Security (RLS) policies to ensure data privacy.

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
