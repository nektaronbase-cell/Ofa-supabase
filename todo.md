# OFA Mobile App - Project TODO

## Core Features

### Authentication
- [ ] Email/password login
- [ ] Email/password sign-up
- [ ] Session persistence
- [ ] Logout functionality

### Fighter Management
- [ ] Create fighter with attribute allocation (90 points)
- [x] View fighter roster (list of user's fighters) - Mock data on Home screen
- [ ] View fighter detail screen with full stats
- [ ] Edit fighter (name, nickname, age, height, weight, reach, stance)
- [ ] Delete fighter
- [x] Display fighter record (wins/losses/draws with KO/Sub/Dec breakdown) - Shown on Home screen
- [x] Show fighter money and training points - Shown on Home screen

### Training System
- [ ] Train fighter attribute (costs 2 training points)
- [ ] Attribute value increases by 2-4 points per training
- [ ] Clamp attribute values between 30-99
- [ ] Show remaining training points

### Challenge System
- [ ] Browse fighters by weight class
- [ ] Send challenge to opponent
- [x] View incoming challenges - Challenges screen with mock data
- [ ] Accept challenge (triggers fight simulation)
- [ ] Decline challenge
- [x] Challenge history with results - History tab on Challenges screen

### Fight Simulation
- [ ] Simulate fight between two fighters
- [ ] Determine winner by KO, Submission, or Decision
- [ ] Calculate round and time
- [ ] Track fight statistics (strikes landed, takedowns, knockdowns)
- [ ] Update fighter records (wins/losses)
- [ ] Award purse ($50k win, $15k loss)
- [ ] Award training points (4 for winner, 2 for loser)

### Rankings System
- [x] Display global rankings by weight class - Rankings screen implemented
- [x] Sort by wins/losses - Rankings sorted in mock data
- [x] Show fighter record and style - Displayed on Rankings screen
- [x] Allow filtering by weight class - Weight class picker on Rankings screen
- [x] Show fighter rank position - Rank badges on Rankings screen

### UI Components
- [x] Tab navigation (Home, Rankings, Challenges) - Tab bar with 3 screens
- [x] Fighter card component - Used on Home screen
- [ ] Attribute grid component
- [x] Challenge card component - Used on Challenges screen
- [ ] Results screen with fight details
- [ ] Loading states and animations

### Styling & Branding
- [x] Generate custom app logo - Red/white OFA logo created
- [x] Update app.config.ts with branding - App name, colors, logo URL set
- [x] Apply OFA color scheme (red/dark blue) - Theme colors updated
- [x] Responsive layout for mobile - NativeWind Tailwind CSS applied
- [x] Dark mode support - Dark theme configured

### Backend Integration
- [ ] Connect to Supabase authentication
- [ ] Create fighters table queries
- [ ] Create challenges table queries
- [ ] Real-time updates for fighters and challenges
- [ ] Row-level security policies

### Testing & Polish
- [ ] Test all user flows end-to-end
- [ ] Verify fight simulation logic
- [ ] Test real-time updates
- [ ] Haptic feedback on interactions
- [ ] Error handling and user feedback

## Completed Features
- [x] Project initialization with Expo SDK 54
- [x] App branding (logo, colors, app name)
- [x] Home screen with fighter roster and quick stats
- [x] Rankings screen with weight class filtering
- [x] Challenges screen with incoming/history tabs
- [x] Tab navigation setup


## Supabase Integration Tasks
- [ ] Create useAuth hook for authentication state management
- [ ] Create useFighters hook for fighter data fetching and real-time updates
- [ ] Create useChallenges hook for challenge management
- [ ] Update Home screen to use Supabase fighter data
- [ ] Update Rankings screen to use Supabase rankings
- [ ] Update Challenges screen to use Supabase challenges
- [ ] Add loading states and error handling
- [ ] Test real-time updates with Supabase
- [ ] Set up database tables in Supabase (if not already done)
- [ ] Configure row-level security policies


## UI Fixes
- [x] Fix screen spacing - top content is cut off
- [x] Improve loading indicators visibility and design
- [x] Verify SafeArea implementation on all screens
- [x] Test spacing on web preview


## Complete Game Implementation (from original upload)
- [x] Extract and review all original game logic from uploaded files
- [x] Implement fighter creation screen with attribute allocation
- [x] Implement fight simulation engine
- [x] Implement training system
- [x] Implement challenge system with fight execution
- [x] Add all game mechanics and features from original code
- [x] Test complete game flow end-to-end


## Database Population
- [x] Research top 15 real MMA fighters for each weight class
- [x] Create seed script with authentic fighter data
- [x] Add admin screen for in-app database seeding
- [ ] Execute seed script to populate database
- [ ] Verify all fighters are accessible in game


## Fighter Creation Screen Enhancement
- [x] Add input fields for fighter details (name, nickname, age, height, weight, reach, stance)
- [x] Implement weight class selector with visual feedback
- [x] Add fighting style selector (Boxer, Wrestler, BJJ, Muay Thai, MMA)
- [x] Create interactive attribute sliders for 5 attributes
- [x] Add real-time point counter showing remaining/total points (90 max)
- [x] Implement point allocation logic (prevent exceeding 90 points)
- [x] Add visual feedback when point limit is reached
- [x] Implement form validation before fighter creation
- [x] Connect to Supabase to save fighter
- [x] Test complete fighter creation flow


## Authentication UI Enhancement
- [x] Create dedicated sign-in screen with email/password form
- [x] Create sign-up screen with account creation flow
- [x] Add forgot password screen and functionality
- [x] Add form validation for email and password
- [x] Add loading states during authentication
- [x] Add error handling and user feedback
- [x] Implement session persistence
- [ ] Add logout functionality
- [ ] Create welcome/onboarding screen for new users
- [x] Test complete authentication flow


## Settings Screen
- [x] Create settings screen with user profile section
- [x] Display current user email
- [x] Add logout button with confirmation dialog
- [x] Add settings tab to navigation
- [x] Handle logout and redirect to sign-in
- [x] Test logout functionality


## Fighter Detail Screen
- [x] Create fighter detail screen layout
- [x] Display fighter profile (name, nickname, record, weight class)
- [x] Add visual attribute bars showing all 5 attributes
- [x] Display earnings and training points
- [x] Add fight history section with detailed records
- [x] Show injury status and recovery time
- [x] Add navigation from home screen fighter cards
- [x] Test fighter detail screen functionality
