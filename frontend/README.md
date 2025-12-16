# TriLLM Frontend

Modern React application for TriLLM - Query multiple AI models simultaneously.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Axios** for API calls

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── QuestionInput.tsx
│   ├── LoadingState.tsx
│   ├── ResponseCard.tsx
│   └── ErrorState.tsx
├── services/           # API services
│   └── api.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Features

- Beautiful gradient UI with Tailwind CSS
- Responsive design (mobile-friendly)
- Loading states with animations
- Error handling with retry functionality
- Sample questions for quick testing
- Display responses from multiple LLMs
- Highlight best answer

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Development Notes

- Hot Module Replacement (HMR) enabled
- TypeScript for type safety
- ESLint configuration included
- Tailwind CSS with custom theme

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variable: `VITE_API_URL`
4. Deploy

### Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

## License

MIT
