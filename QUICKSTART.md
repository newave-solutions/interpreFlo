# Quick Start Guide - InterpreFlo

## What is InterpreFlo?

InterpreFlo is a comprehensive voice coaching platform designed specifically for medical interpreters. It provides real-time vocal analysis, interactive practice scenarios, and progress tracking to help medical interpreters improve their skills.

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Your Browser
Navigate to: `http://localhost:3001`

### 4. Create an Account
- Click "Register" on the login page
- Enter your username, email, and password
- After successful registration, you'll be redirected to login

### 5. Login
- Enter your credentials
- You'll be taken to the Dashboard

## Using the Platform

### Dashboard
The dashboard shows your overall statistics:
- Total practice sessions completed
- Total time spent practicing
- Average performance score
- Number of scenarios completed
- Recent session history

### Practice
1. Click "Practice" in the navigation menu
2. Choose a scenario based on difficulty level:
   - **Beginner**: Emergency Room Admission
   - **Intermediate**: Taking Patient History, Medication Instructions
   - **Advanced**: Explaining Diagnosis, Surgical Consent Process
3. Read the scenario script
4. Click the red record button to start recording
5. Speak your interpretation
6. Watch real-time metrics (Volume, Clarity, Pitch)
7. Click the stop button when done
8. Review your score

### Progress
View your learning journey:
- Overall completion rate
- Scenario completion status
- Recent activity history

## Tips for Best Results

1. **Use a good microphone** for better audio analysis
2. **Practice in a quiet environment** for accurate clarity measurements
3. **Speak clearly and at a moderate pace** for optimal scores
4. **Complete scenarios multiple times** to track improvement
5. **Try different difficulty levels** to challenge yourself

## Browser Compatibility

InterpreFlo requires a modern browser with:
- Web Audio API support
- MediaRecorder API support
- Microphone access permissions

**Recommended browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Microphone Permissions

When you start recording for the first time, your browser will ask for microphone permission. Click "Allow" to enable voice recording and analysis.

## Data Persistence

All your data is stored locally in an SQLite database:
- User account information
- Practice session recordings and scores
- Progress statistics
- Vocal analytics

Your data persists across sessions, so you can track your improvement over time.

## Support

For issues or questions, please refer to the main README.md or open an issue on GitHub.

## Privacy

InterpreFlo stores all data locally on the server. Your practice recordings and personal information are not shared with third parties.
