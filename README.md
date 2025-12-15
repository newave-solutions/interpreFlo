# InterpreFlo

A comprehensive voice coaching platform for medical interpreters with real-time vocal analysis, interactive practice scenarios, progress tracking, and a complete authentication system that persists all user data and progress across sessions.

## Features

### 🎙️ Real-time Vocal Analysis
- Live audio recording and analysis
- Real-time metrics tracking:
  - **Volume**: Monitor speaking volume levels
  - **Pitch**: Track pitch variations and consistency
  - **Clarity**: Measure voice clarity and signal quality
- Visual feedback during practice sessions
- Waveform visualization

### 📚 Interactive Practice Scenarios
- Multiple medical interpretation scenarios:
  - Emergency Room Admission (Beginner)
  - Taking Patient History (Intermediate)
  - Explaining Diagnosis (Advanced)
  - Surgical Consent Process (Advanced)
  - Medication Instructions (Intermediate)
- Realistic medical scripts
- Difficulty-based progression
- Timed practice sessions

### 📊 Progress Tracking
- Comprehensive dashboard with key metrics:
  - Total practice sessions
  - Total practice time
  - Average performance score
  - Scenarios completed
- Session history with detailed analytics
- Performance trends by scenario
- Recent activity timeline

### 🔐 Authentication System
- User registration and login
- Secure password hashing with bcrypt
- JWT-based session management
- Persistent sessions (7-day tokens)
- Protected API endpoints

### 💾 Data Persistence
- SQLite database for reliable data storage
- User profiles and credentials
- Practice session recordings and metrics
- Vocal analytics time-series data
- Progress tracking and achievements
- All data persists across sessions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/newave-solutions/interpreFlo.git
cd interpreFlo
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 3001 and serve the application at `http://localhost:3001`.

## Usage

### Getting Started

1. **Register an Account**
   - Open your browser to `http://localhost:3001`
   - Click "Register" to create a new account
   - Provide username, email, and password
   - After registration, login with your credentials

2. **Explore the Dashboard**
   - View your overall statistics
   - Track your progress over time
   - See recent practice sessions
   - Monitor performance by scenario

3. **Practice Sessions**
   - Navigate to the "Practice" tab
   - Choose a scenario based on difficulty level
   - Read the scenario script
   - Click the record button to start
   - Speak your interpretation
   - Watch real-time vocal metrics
   - Stop recording when done
   - Review your score and feedback

4. **Track Progress**
   - Visit the "Progress" tab
   - View completion rates
   - Check scenario completion status
   - Review your activity history

## Architecture

### Backend (Node.js + Express)
- RESTful API with Express.js
- SQLite database with better-sqlite3
- JWT authentication
- CORS enabled for frontend communication
- Session management

### Frontend (Vanilla JavaScript)
- Single-page application (SPA)
- Real-time audio recording with Web Audio API
- MediaRecorder API for voice capture
- Responsive design with modern CSS
- Client-side routing

### Database Schema

**users**
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- created_at

**practice_sessions**
- id (Primary Key)
- user_id (Foreign Key)
- scenario_id
- duration
- pitch_avg
- volume_avg
- clarity_score
- overall_score
- recording_data
- created_at

**user_progress**
- id (Primary Key)
- user_id (Foreign Key, Unique)
- total_sessions
- total_practice_time
- average_score
- scenarios_completed (JSON)
- achievements (JSON)
- last_updated

**vocal_analytics**
- id (Primary Key)
- session_id (Foreign Key)
- timestamp
- pitch
- volume
- clarity

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Scenarios
- `GET /api/scenarios` - Get all scenarios
- `GET /api/scenarios/:id` - Get specific scenario

### Sessions
- `POST /api/sessions` - Save practice session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:id` - Get specific session with analytics

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/stats` - Get dashboard statistics

## Vocal Analysis Algorithm

The platform uses the Web Audio API to analyze voice in real-time:

1. **Volume**: Calculated from average frequency amplitude (0-100%)
2. **Pitch**: Estimated from dominant frequency in the signal
3. **Clarity**: Derived from signal variance and consistency
4. **Overall Score**: Weighted combination (Clarity 50%, Volume 30%, Pitch 20%)

Analytics data is collected at ~60Hz during recording and stored for later review.

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected API routes with authentication middleware
- SQL injection prevention with prepared statements
- CORS configured for specific origin

## Browser Compatibility

Requires a modern browser with support for:
- Web Audio API
- MediaRecorder API
- ES6+ JavaScript
- Fetch API
- LocalStorage

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lightweight SQLite database
- Efficient real-time audio processing
- Optimized analytics collection
- Fast API responses
- Minimal frontend bundle (no build step required)

## Future Enhancements

- [ ] Export session recordings
- [ ] Detailed pronunciation analysis
- [ ] Peer comparison and leaderboards
- [ ] Custom scenario creation
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced reporting and insights
- [ ] Gamification and achievements
- [ ] AI-powered feedback

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
