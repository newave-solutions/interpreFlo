# Firestore Database Setup

This document describes the Firestore collections structure for the VoiceCoach Pro application.

## Collections

### 1. `user_profiles`

Stores user profile information.

**Document ID**: User's Firebase Auth UID

**Fields**:
- `email` (string): User's email address
- `full_name` (string, optional): User's full name
- `organization` (string, optional): User's organization
- `job_title` (string, optional): User's job title
- `experience_level` (string, optional): User's experience level
- `languages` (array of strings, optional): Languages the user speaks
- `avatar_url` (string, optional): URL to user's avatar image
- `created_at` (timestamp): When the profile was created
- `updated_at` (timestamp): When the profile was last updated

**Security Rules**: Users can only read and write their own profile

---

### 2. `user_progress`

Stores user progress and statistics.

**Document ID**: User's Firebase Auth UID

**Fields**:
- `user_id` (string): Reference to user's UID
- `total_practice_time` (number): Total practice time in seconds
- `scenarios_completed` (number): Total number of scenarios completed
- `average_score` (number): Average score across all sessions
- `streak_days` (number): Current practice streak in days
- `last_practice_date` (string, optional): Last practice date in ISO format
- `created_at` (timestamp): When the progress record was created
- `updated_at` (timestamp): When the progress was last updated

**Security Rules**: Users can only read and write their own progress

---

### 3. `practice_sessions`

Stores individual practice session records.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user's UID
- `session_type` (string): Type of session ('scenario', 'warmup', 'drill', 'baseline')
- `scenario_id` (string, optional): ID of the scenario if applicable
- `duration` (number): Session duration in seconds
- `pitch_score` (number, optional): Pitch score (0-100)
- `pace_score` (number, optional): Pace score (0-100)
- `volume_score` (number, optional): Volume score (0-100)
- `overall_score` (number, optional): Overall score (0-100)
- `notes` (string, optional): Additional notes
- `completed_at` (timestamp): When the session was completed
- `created_at` (timestamp): When the session record was created

**Security Rules**: Users can only read and write their own sessions

---

### 4. `user_badges`

Stores user achievements/badges.

**Document ID**: Auto-generated

**Fields**:
- `user_id` (string): Reference to user's UID
- `badge_id` (string): Unique identifier for the badge
- `badge_name` (string): Display name of the badge
- `badge_description` (string, optional): Description of the badge
- `earned_at` (timestamp): When the badge was earned

**Security Rules**: Users can only read their own badges (write is handled server-side or via Cloud Functions)

**Unique Constraint**: A user should not have duplicate badges (enforced in application logic)

---

### 5. `baseline_assessments`

Stores baseline vocal assessments.

**Document ID**: User's Firebase Auth UID

**Fields**:
- `user_id` (string): Reference to user's UID
- `pitch_baseline` (number): Baseline pitch measurement
- `pace_baseline` (number): Baseline pace measurement
- `volume_baseline` (number): Baseline volume measurement
- `tone_profile` (string, optional): Description of tone profile
- `strengths` (array of strings, optional): Identified strengths
- `areas_for_improvement` (array of strings, optional): Areas needing improvement
- `completed_at` (timestamp): When the assessment was completed

**Security Rules**: Users can only read and write their own assessments

---

## Security Rules

Here's a sample Firestore security rules file (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // User profiles - users can only access their own profile
    match /user_profiles/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // User progress - users can only access their own progress
    match /user_progress/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Practice sessions - users can only access their own sessions
    match /practice_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // User badges - users can read their own badges, write handled by server
    match /user_badges/{badgeId} {
      allow read: if isAuthenticated() && 
        resource.data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        request.resource.data.user_id == request.auth.uid;
    }
    
    // Baseline assessments - users can only access their own assessments
    match /baseline_assessments/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

---

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google provider
   - Enable Microsoft provider (if needed)
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
   - Add the security rules from above
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Add a web app if not already added
   - Copy the config values to your `.env.local`

---

## Indexes Required

Create these composite indexes in Firestore for optimal query performance:

1. **practice_sessions** collection:
   - Fields: `user_id` (Ascending), `completed_at` (Descending)

These can be created automatically when you run queries that require them, or manually in the Firebase Console under Firestore > Indexes.

