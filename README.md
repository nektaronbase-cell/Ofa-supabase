# OFA - Onchain Fighting Association

A multiplayer MMA league simulator mobile app built with React Native, Expo, and Supabase. Create fighters, train them, and compete in epic battles against real UFC fighters and other players.

## Features

- **Fighter Creation** — Create custom fighters with 90-point attribute allocation across 5 fighting styles (Boxer, Wrestler, BJJ, Muay Thai, MMA)
- **Training System** — Improve fighter attributes using training points to enhance performance
- **Fight Simulation** — Realistic round-by-round combat engine determining winners by KO, Submission, or Decision
- **Challenge System** — Send and accept challenges from other fighters with automatic fight execution and purse distribution
- **Global Rankings** — View ranked fighters by weight class with real-time standings
- **Real UFC Fighters** — Compete against 35+ authentic UFC fighters seeded into the database
- **Supabase Integration** — Cloud-based authentication, real-time data sync, and persistent fighter storage
- **Cross-Platform** — Works on iOS, Android, and Web

## Tech Stack

- **Frontend**: React Native 0.81, Expo SDK 54, TypeScript 5.9
- **Styling**: NativeWind 4 (Tailwind CSS for React Native)
- **Navigation**: Expo Router 6
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Context + Hooks
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account with project created
- GitHub account for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nektaronbase-cells/ofa-supabase.git
cd ofa-supabase
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
# Create .env.local file with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:8081`

## Project Structure

```
app/
  (tabs)/
    index.tsx           # Home screen with fighter roster
    rankings.tsx        # Global rankings by weight class
    challenges.tsx      # Incoming challenges and fight history
    settings.tsx        # User profile and logout
  create-fighter.tsx    # Fighter creation with attribute allocation
  fighter-detail.tsx    # Fighter profile with stats and history
  training.tsx          # Training system for attribute improvement
  sign-in.tsx           # Authentication sign-in screen
  sign-up.tsx           # Account creation screen
  forgot-password.tsx   # Password recovery
  admin-seed.tsx        # Admin screen for database seeding

components/
  screen-container.tsx  # SafeArea wrapper for all screens
  ui/icon-symbol.tsx    # Icon mapping for tab navigation
  haptic-tab.tsx        # Haptic feedback for tab presses

hooks/
  use-fighters.ts       # Fighter data management
  use-challenges.ts     # Challenge system logic
  use-rankings.ts       # Rankings and leaderboard
  use-auth-state.ts     # Authentication state

lib/
  supabase-client.ts    # Supabase client initialization
  game-utils.ts         # Game constants and utilities
  utils.ts              # Helper functions

scripts/
  seed-fighters.ts      # Database seeding script
  ufc-rankings-data.md  # Real UFC fighter data
```

## Game Mechanics

### Fighter Attributes

Each fighter has 5 core attributes (0-100 scale):
- **Striking** — Punching and kicking power
- **Grappling** — Wrestling and takedown ability
- **Stamina** — Endurance across rounds
- **Chin** — Resistance to knockdowns
- **Power** — Knockout potential

### Fight Simulation

Fights consist of up to 5 rounds with realistic combat:
- **Round Duration** — Each round simulates realistic exchanges
- **Damage Calculation** — Based on attribute matchups and randomness
- **Outcomes** — KO (knockout), Submission (grappling), Decision (judges)
- **Purse Distribution** — Winners earn money, losers get training points

### Training System

- **Training Points** — Earned from losses and used to improve attributes
- **Point Allocation** — Distribute points across 5 attributes
- **Cooldown** — Training has a cooldown period between sessions
- **Progression** — Continuous improvement for competitive advantage

## Database Schema

### Fighters Table
- `id` — Unique fighter identifier
- `first_name`, `last_name` — Fighter name
- `nickname` — Fighting nickname
- `weight_class` — Lightweight, Middleweight, Heavyweight, etc.
- `striking`, `grappling`, `stamina`, `chin`, `power` — Attributes (0-100)
- `wins`, `losses`, `draws` — Fight record
- `money` — Total earnings
- `training_points` — Available training points
- `injury` — Current injury status
- `injury_time` — Weeks until recovery

### Challenges Table
- `id` — Challenge identifier
- `challenger_id` — Fighter initiating challenge
- `opponent_id` — Fighter receiving challenge
- `status` — pending, accepted, completed
- `result` — win, loss, draw
- `method` — KO, Submission, Decision
- `purse` — Fight reward amount

## Seeding the Database

The app includes an admin screen to seed your database with 35 real UFC fighters:

1. Sign in to the app
2. Click "🔧 Admin: Seed Database" on the home screen
3. Wait for the seeding to complete
4. Start creating fighters and challenging UFC stars!

## Testing

Run the test suite:
```bash
pnpm test
```

Run tests for specific features:
```bash
pnpm test fighter-creation
pnpm test game
pnpm test supabase
```

## Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Expo

```bash
eas build --platform all
eas submit --platform all
```

### Deploy Web Version

```bash
pnpm build
# Deploy the dist/ folder to your hosting service
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key | `eyJ...` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style and naming conventions
- Write tests for new features
- Use Tailwind CSS classes for styling (no inline styles)
- Keep components focused and reusable
- Document complex logic with comments

## Common Issues

### App won't start
- Clear Metro bundler cache: `pnpm start -- --reset-cache`
- Delete node_modules and reinstall: `rm -rf node_modules && pnpm install`

### Supabase connection fails
- Verify environment variables are set correctly
- Check Supabase project is active and credentials are valid
- Ensure Row Level Security (RLS) policies allow your operations

### Tests fail
- Run `pnpm test` to see detailed error messages
- Check that all dependencies are installed
- Ensure Supabase credentials are configured for tests

## Roadmap

- [ ] Leaderboards and statistics
- [ ] Social features (friends, direct challenges)
- [ ] Tournament system
- [ ] Fighter sponsorships and endorsements
- [ ] Multiplayer live fights
- [ ] Mobile app performance optimization
- [ ] Offline mode support
- [ ] Push notifications for challenges

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce and expected behavior

## Credits

- Built with [Expo](https://expo.dev)
- Styled with [NativeWind](https://www.nativewind.dev)
- Powered by [Supabase](https://supabase.com)
- UFC fighter data from official UFC rankings

---

**OFA - Onchain Fighting Association** — Where fighters are created, trained, and legends are born. 🥊
