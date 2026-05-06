# PulseAI

A product intelligence dashboard that transforms raw customer feedback into actionable signals. PulseAI uses AI-powered sentiment analysis and theme extraction to help product teams understand what their users care about — and prioritize accordingly.

## Features

- **Dashboard** — High-level overview of feedback volume, sentiment distribution, and key metrics
- **Feedback Feed** — Browse and filter all raw feedback items
- **Signal Analysis** — AI-extracted sentiment scores, themes, and categories across all feedback
- **Priority Matrix** — Visualize signals by impact and effort to guide roadmap decisions
- **PRD Generator** — Generate product requirement drafts from prioritized signals

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Supabase](https://supabase.com/) — Postgres database with Row Level Security
- [Lucide React](https://lucide.dev/) — icon library

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mehreenhimani/pulseai.git
   cd pulseai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Apply database migrations:

   The migration files are in `supabase/migrations/`. Run them against your Supabase project via the Supabase dashboard SQL editor or the Supabase CLI.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

The output is in the `dist/` directory.

## Database Schema

| Table | Description |
|-------|-------------|
| `feedback_items` | Raw feedback text from users |
| `signals` | AI-analyzed sentiment, score, themes, and category per feedback item |

Row Level Security (RLS) is enabled on all tables.

## Project Structure

```
src/
  components/     # Shared UI components (Layout, Sidebar, StatCard, FeedbackTable)
  pages/          # Page-level components (Dashboard, FeedbackFeed, SignalAnalysis, etc.)
  lib/            # Supabase client singleton
supabase/
  migrations/     # SQL migration files
```

## License

MIT
