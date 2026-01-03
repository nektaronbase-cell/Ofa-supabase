# OFA Mobile App - Interface Design

## Overview
OFA (Onchain Fighting Association) is a multiplayer MMA league simulator where users create fighters, train them, challenge other players, and compete in a global ranking system. The app emphasizes fighter management, real-time battles, and competitive progression.

## Screen List

1. **Auth Screen** - Login/Sign Up
2. **Home Screen** - Fighter roster and quick actions
3. **Fighter Detail Screen** - View fighter stats and attributes
4. **Create Fighter Screen** - Build new fighter with attribute allocation
5. **Training Screen** - Improve fighter attributes
6. **Rankings Screen** - Global leaderboard by weight class
7. **Challenges Screen** - Incoming challenges and challenge history
8. **Challenge Opponent Screen** - Browse and challenge other fighters
9. **Fight Simulation Screen** - Watch fight animation and results
10. **Results Screen** - Fight outcome, purse, and statistics

## Primary Content and Functionality

### Auth Screen
- Email/password login and sign-up forms
- Error messages
- Toggle between login and sign-up modes

### Home Screen (Tab: Home)
- Fighter roster (list of user's fighters)
- Quick stats: total wins/losses, money, training points
- Action buttons: Create Fighter, View Challenges, Rankings
- Fighter card showing: name, nickname, record, weight class, style icon

### Fighter Detail Screen
- Fighter profile: name, nickname, age, height, weight, reach, stance, style
- Record: wins/losses/draws with KO/Sub/Dec breakdown
- Attributes grid (20 attributes, each 30-99 scale)
- Money and training points
- Injury status (if applicable)
- Action buttons: Train, Challenge, Edit

### Create Fighter Screen
- Form fields: first name, last name, nickname, age, height, weight, reach, stance
- Style selector (Boxer, Wrestler, BJJ, Muay Thai, MMA) with icons
- Weight class selector
- Attribute point allocation (90 points to distribute across 20 attributes)
- Visual feedback: remaining points counter
- Create button (disabled until valid)

### Training Screen
- Select attribute to train
- Current value and potential new value
- Cost: 2 training points per session
- Confirm training button
- Show updated stats after training

### Rankings Screen
- Weight class selector (dropdown/tabs)
- Fighter list sorted by wins/losses
- Each entry: rank, fighter name, record, owner
- Tap to view fighter detail or challenge

### Challenges Screen
- Incoming challenges: opponent name, fighter, weight class, timestamp
- Accept/Decline buttons for each
- Challenge history: past challenges with results
- Show purse earned/lost

### Challenge Opponent Screen
- Search/filter fighters by weight class
- Fighter list: name, record, style, weight class
- Tap to view detail or challenge
- Show warning if weight class mismatch

### Fight Simulation Screen
- Animated fight display (text-based or simple graphics)
- Round counter
- Health/stamina bars for both fighters
- Knockout/submission indicators
- "Fighting..." loading state

### Results Screen
- Winner announcement
- Method: KO, Submission, Decision
- Round and time
- Fighter stats: strikes landed, takedowns, knockdowns
- Purse earned
- Button to return home

## Key User Flows

### Flow 1: Create Fighter and Train
1. User taps "Create Fighter" on Home
2. Fills form with fighter details
3. Allocates 90 attribute points
4. Submits and returns to Home
5. Selects fighter from roster
6. Taps "Train" on Fighter Detail
7. Selects attribute to train
8. Confirms, points deducted, attribute increased
9. Returns to Fighter Detail

### Flow 2: Challenge and Fight
1. User selects fighter from Home
2. Taps "Challenge" on Fighter Detail
3. Browses Rankings or Challenge Opponent screen
4. Selects opponent fighter
5. Sends challenge
6. Opponent receives notification in Challenges tab
7. Opponent accepts challenge
8. Fight simulation runs
9. Results screen shows outcome and purse
10. Both fighters' records updated

### Flow 3: View Rankings
1. User taps Rankings tab
2. Selects weight class
3. Views sorted leaderboard
4. Can tap fighter to view detail or challenge

## Color Choices

- **Primary**: #DC2626 (Red - fighting/MMA energy)
- **Background**: #0F172A (Dark blue-black - professional)
- **Surface**: #1E293B (Slightly lighter for cards)
- **Foreground**: #F1F5F9 (Light text)
- **Muted**: #94A3B8 (Secondary text)
- **Success**: #22C55E (Green - wins/gains)
- **Warning**: #F59E0B (Amber - injuries/caution)
- **Error**: #EF4444 (Red - losses/failures)
- **Border**: #334155 (Subtle dividers)

## Navigation Structure

- **Tab 1: Home** - Fighter roster and quick actions
- **Tab 2: Rankings** - Global leaderboard
- **Tab 3: Challenges** - Incoming and past challenges
- **Tab 4: Profile** - User account and settings (future)

## Design Principles

- **Mobile-first**: All content optimized for portrait orientation, one-handed usage
- **Clear hierarchy**: Fighter name > stats > actions
- **Immediate feedback**: Loading states, confirmation dialogs, haptic feedback
- **Consistency**: Reusable card components, consistent spacing (4px grid)
- **Accessibility**: High contrast text, large touch targets (48px minimum)
