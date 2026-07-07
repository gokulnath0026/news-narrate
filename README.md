# Narrate — News Aggregator & AI Summarizer

**The fastest way to understand today's news.**

Narrate is a production-ready Next.js 15 web application that aggregates news from multiple sources and uses AI-powered summaries to help you understand articles in seconds. Browse, search, bookmark, and get intelligent insights from any article.

## ✨ Features

- **🔍 Smart News Aggregation**: Browse news from hundreds of sources across multiple categories
- **🤖 AI-Powered Summaries**: Get instant, comprehensive summaries with Groq
- **📚 Search & Filters**: Powerful search with country, language, and category filters
- **🔖 Bookmarks & Folders**: Organize articles into custom folders
- **📖 Reading History**: Track all articles you've read and summaries generated
- **🌙 Dark/Light Theme**: Seamless theme switching with persistent preferences
- **⌨️ Keyboard Shortcuts**: `/` search, `Cmd+K` search modal, `B` bookmark, `S` summarize, `Esc` close
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Lightning Fast**: Optimized with caching, lazy loading, and streaming responses
- **🔒 Privacy First**: All data stored locally in browser localStorage—no server tracking
- **💾 Persistent Storage**: Bookmarks, summaries, history, and preferences saved locally

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (client-side)
- **News API**: FreeNewsAPI
- **AI**: Groq (OpenAI-compatible)
- **Storage**: Browser localStorage with repository pattern

### Folder Structure

```
narrate/
├── client/src/
│   ├── app/
│   │   ├── (landing)/page.tsx          # Public landing page
│   │   ├── (app)/                      # App shell
│   │   │   ├── home/page.tsx           # News feed
│   │   │   ├── search/page.tsx         # Search
│   │   │   ├── article/[id]/page.tsx   # Article detail
│   │   │   ├── bookmarks/page.tsx      # Bookmarks
│   │   │   ├── history/page.tsx        # History
│   │   │   └── settings/page.tsx       # Settings
│   │   ├── layout.tsx                  # Root layout
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/                     # Navbar, Sidebar
│   │   ├── shared/                     # Typography, EmptyState, etc.
│   │   ├── ArticleCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── SummaryPanel.tsx
│   │   └── StreamingText.tsx
│   ├── lib/
│   │   ├── storage/                    # localStorage repositories
│   │   │   ├── StorageService.ts
│   │   │   ├── CacheRepository.ts
│   │   │   ├── BookmarksRepository.ts
│   │   │   ├── SummaryRepository.ts
│   │   │   ├── HistoryRepository.ts
│   │   │   └── PreferencesRepository.ts
│   │   ├── api/                        # API clients
│   │   │   ├── freenews.ts
│   │   │   └── groq.ts
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── types/                      # TypeScript types
│   │   ├── utils/                      # Utility functions
│   │   ├── constants/                  # Constants
│   │   └── animations/                 # Framer Motion variants
│   ├── contexts/                       # React contexts
│   ├── pages/                          # Page components
│   ├── App.tsx                         # Router
│   └── main.tsx                        # Entry point
├── .env.example                        # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### Data Flow

```
User Interface (React Components)
    ↓
Custom Hooks (useBookmarks, useSummary, etc.)
    ↓
Repository Layer (StorageService)
    ↓
Browser localStorage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (with pnpm)
- FreeNewsAPI key: https://www.newscatcherapi.com/
- Groq API key: https://console.groq.com/

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd narrate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```
   FREE_NEWS_API_KEY=your_freenews_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## 📖 Usage

### Landing Page

The landing page showcases Narrate's features with:
- Typewriter hero animation
- Feature highlights
- How it works section
- FAQ accordion
- Call-to-action buttons

### News Feed

- Browse articles by category (Latest, Trending, Technology, AI, Business, Science, Health, Sports, World)
- Infinite scroll for seamless browsing
- Bookmark articles for later
- Generate AI summaries on demand

### Search

- Use `/` or `Cmd+K` to open search
- Filter by country, language, category, and sort order
- Search history saved automatically

### Article Page

- Full article content
- Sticky table of contents
- AI summary panel (desktop sidebar / mobile bottom sheet)
- Bookmark and share options
- Related articles

### Bookmarks

- Organize articles into folders
- Search bookmarks
- Sort by date or title
- Delete individual or bulk

### History

- View all generated summaries
- View reading history
- Search history
- Clear all or individual entries

### Settings

- Theme toggle (light/dark)
- Default country
- Preferred category
- Reading layout (comfortable/compact)
- Font size (small/medium/large)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `Cmd+K` | Open search modal |
| `B` | Bookmark current article |
| `S` | Trigger AI summarize |
| `Esc` | Close any modal |

## 🎨 Design System

### Typography

- **Headings**: Playfair Display (serif) for editorial feel
- **Body**: Inter (sans-serif) for readability
- **Sizes**: Responsive scaling from mobile to desktop

### Colors

- **Light Mode**: White background, dark text
- **Dark Mode**: Dark background, light text
- **Accent**: Black/White depending on theme
- **No Gradients**: Clean, minimal aesthetic

### Components

- Rounded corners (`rounded-xl`)
- Minimal shadows (`shadow-sm`)
- Hairline borders (`border-border`)
- Smooth animations (under 600ms)

## 🔒 Privacy & Data

- **All data stored locally** in browser localStorage
- **No server-side tracking** of user activity
- **No personal information** collected or transmitted
- **API keys stored securely** in environment variables
- **Bookmarks, summaries, and history** never leave your device

## 🚦 Performance

- **Server Components** for optimal data fetching
- **Dynamic imports** for code splitting
- **Image optimization** with Next.js Image
- **Lazy loading** for off-screen content
- **Caching** with 30-minute TTL
- **Streaming** for AI summaries
- **Memoization** to prevent unnecessary re-renders

## 🧪 Development

### Code Quality

- **TypeScript strict mode** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **No hardcoded strings** (all in constants)
- **Reusable components** and hooks

### Testing

```bash
pnpm check    # TypeScript check
pnpm format   # Format code
```

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app is compatible with any Node.js hosting:
- Railway
- Render
- Netlify
- AWS Amplify
- DigitalOcean

## 🛣️ Roadmap

### Phase 1 (Current)
- ✅ Landing page with animations
- ✅ News feed with categories
- ✅ Article detail page
- ✅ AI summarization with streaming
- ✅ Bookmarks and history
- ✅ Search functionality
- ✅ Settings and preferences

### Phase 2 (Planned)
- [ ] User authentication (optional)
- [ ] Cloud sync for bookmarks
- [ ] Email digests
- [ ] Podcast summaries
- [ ] PDF export
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Collaborative reading lists
- [ ] Social sharing
- [ ] Browser extension
- [ ] API for third-party integrations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License—see LICENSE file for details.

## 🙏 Acknowledgments

- **FreeNewsAPI** for news aggregation
- **Groq** for AI-powered summaries
- **Vercel** for Next.js and deployment
- **shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations

## 📞 Support

- 📧 Email: support@narrate.app
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

**Built with ❤️ by the Narrate team**

*The fastest way to understand today's news.*
