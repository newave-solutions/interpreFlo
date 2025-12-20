# Migration from Supabase to Firebase/Firestore

## Summary

The project has been successfully migrated from Supabase to Firebase (Firestore + Firebase Auth).

## Changes Made

### 1. Dependencies

- **Removed**: `@supabase/supabase-js`, `@supabase/auth-ui-react`, `@supabase/auth-ui-shared`, `supabase` (CLI)
- **Added**: `firebase` (v10.13.2)

### 2. Configuration Files

- **Created**: `lib/firebase.ts` - Firebase configuration and initialization
- **Deprecated**: `lib/supabase.ts` - Kept for reference but no longer used
- **Removed**: `supabase/config.toml`, `supabase/schema.sql`, `supabase/.gitignore`

### 3. Authentication (`contexts/AuthContext.tsx`)

- Replaced Supabase Auth with Firebase Auth
- Updated to use `onAuthStateChanged` instead of `onAuthStateChange`
- Changed from `Session` object to `FirebaseUser` (Firebase doesn't have separate sessions)
- Updated OAuth flows to use Firebase's `signInWithPopup` instead of redirect flow
- Auto-creates user profiles and progress entries in Firestore on signup

### 4. Database Operations

All Supabase queries have been converted to Firestore operations:

- **ProgressDashboard.tsx**: Uses Firestore queries with `getDoc`, `getDocs`, `query`, `where`, `orderBy`
- **PracticeSession.tsx**: Uses `addDoc`, `getDoc`, `updateDoc` for session and progress updates
- **BaselineAssessment.tsx**: Uses `setDoc` with merge option for baseline assessments

### 5. Auth Callback Route (`app/auth/callback/route.ts`)

- Simplified since Firebase handles OAuth callbacks automatically
- Now just redirects to `/practice` page

### 6. Documentation

- **Created**: `FIRESTORE_SETUP.md` - Complete Firestore collections structure and setup guide
- **Created**: `MIGRATION_NOTES.md` - This file

## Environment Variables

Update your `.env.local` file with Firebase configuration:

```env
# Replace these Supabase variables:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# With these Firebase variables:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Next Steps

1. **Set up Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Enable Authentication (Email/Password, Google, Microsoft)
   - Create Firestore database
   - Add security rules (see `FIRESTORE_SETUP.md`)

2. **Get Firebase Config**:
   - Go to Project Settings > General
   - Add a web app
   - Copy config values to `.env.local`

3. **Create Firestore Indexes**:
   - Create composite index for `practice_sessions` collection
   - Fields: `user_id` (Ascending), `completed_at` (Descending)

4. **Test the Application**:
   - Run `npm run dev`
   - Test authentication flows
   - Test data operations

## Key Differences: Supabase vs Firebase

### Authentication

- **Supabase**: Uses session-based auth with `Session` objects
- **Firebase**: Uses user-based auth, no separate session objects

### Database Queries

- **Supabase**: SQL-like queries with `.from()`, `.select()`, `.eq()`, etc.
- **Firestore**: NoSQL queries with `getDoc()`, `getDocs()`, `query()`, `where()`, etc.

### OAuth Flow

- **Supabase**: Redirect-based OAuth with callback handling
- **Firebase**: Popup-based OAuth (automatically handled, no manual callback needed)

### Timestamps

- **Supabase**: PostgreSQL timestamps (strings)
- **Firestore**: Firestore timestamps (need `.toDate()` to convert to JavaScript Date)

## Breaking Changes

1. **Session Object**: Code using `session` now uses `user` instead (Firebase doesn't have sessions)
2. **Query Syntax**: All database queries use Firestore syntax instead of Supabase
3. **OAuth Callbacks**: OAuth now uses popup flow instead of redirect (handled automatically)

## Files Modified

- `package.json` - Dependencies updated
- `lib/firebase.ts` - New Firebase config (replaces `lib/supabase.ts`)
- `contexts/AuthContext.tsx` - Complete rewrite for Firebase Auth
- `components/ProgressDashboard.tsx` - Firestore queries
- `components/PracticeSession.tsx` - Firestore operations
- `components/BaselineAssessment.tsx` - Firestore operations
- `app/auth/callback/route.ts` - Simplified for Firebase

## Files Removed

- `supabase/config.toml`
- `supabase/schema.sql`
- `supabase/.gitignore`

## Files Created

- `lib/firebase.ts`
- `FIRESTORE_SETUP.md`
- `MIGRATION_NOTES.md`
