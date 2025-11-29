<p align="center">
  <img src="public/logo.svg" alt="CARMI Logo" width="180" height="180">
</p>

<h1 align="center">🚗 Car Mileage Tracker (CARMI)</h1>

<p align="center">
  A lightweight, modern, mobile-first Progressive Web App (PWA) for tracking car fuel efficiency and mileage.<br>
  Built with React, TypeScript, and Tailwind CSS, this app works offline and can be installed on any device.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PWA-Ready-blueviolet" alt="PWA">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT">
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Schema](#-api-schema)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- **📝 Add Fuel Entries** - Record miles driven, liters filled, price per liter, and date
- **📸 Image Upload** - Attach receipt photos to entries (stored as Base64)
- **✏️ Edit Entries** - Modify existing entries with pre-filled forms
- **🗑️ Delete Entries** - Remove entries with confirmation
- **📊 Automatic Mileage Calculation** - Computes km/L and MPG automatically

### Dashboard & Analytics
- **📈 Line Chart** - Visual representation of mileage trends (last 10 entries)
- **📊 Statistics Cards** - Total miles, liters, spending, average/best/worst mileage
- **🎨 Pastel Color Coding** - Green for best, orange for worst performance
- **🖱️ Interactive Tooltips** - Hover over data points for detailed values

### Data Export
- **📄 CSV Export** - Download all entries as a CSV file
- **🖨️ PDF Export** - Generate a printable PDF report with summary statistics

### Settings & Preferences
- **🌙 Dark/Light Mode** - Toggle between themes with system preference detection
- **📏 Unit Toggle** - Switch between km/L and MPG display
- **💾 Persistent Settings** - Preferences saved in IndexedDB

### PWA Features
- **📱 Installable** - Add to home screen on mobile/desktop
- **🔌 Offline Support** - Full functionality without internet
- **⚡ Fast Loading** - Service worker caching with Workbox
- **📲 Mobile-First Design** - Responsive UI optimized for touch

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 | UI component library |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Build Tool** | Vite 7 | Fast dev server & bundler |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Database** | Dexie.js + IndexedDB | Client-side database |
| **Routing** | React Router 7 | SPA navigation |
| **PWA** | vite-plugin-pwa + Workbox | Service worker & caching |
| **Icons** | Heroicons (inline SVG) | UI icons |
| **ID Generation** | UUID | Unique entry identifiers |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Layer (React)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │  Dashboard  │ │  AddEntry   │ │   History   │ │Settings│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────┤
│                State Management (React Context)              │
│  ┌─────────────────────────┐ ┌─────────────────────────┐    │
│  │    SettingsContext      │ │    EntriesContext       │    │
│  │  (theme, units, prefs)  │ │   (CRUD operations)     │    │
│  └─────────────────────────┘ └─────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│              Database Layer (Dexie.js + IndexedDB)           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MileageEntry: id, date, miles, liters, price,      │    │
│  │                mileageKmPerL, mileageMPG, image     │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    PWA Layer (Workbox)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Service Worker • Offline Cache • Install Prompt    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
carmi-app/
├── public/
│   ├── favicon.svg          # App icon
│   └── vite.svg             # Vite logo
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Primary/secondary button
│   │   ├── Card.tsx         # Container card
│   │   ├── Header.tsx       # Page header
│   │   ├── ImageUpload.tsx  # Image picker with preview
│   │   ├── Input.tsx        # Form input field
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── MileageCard.tsx  # Entry display card
│   │   ├── MileageChart.tsx # Line chart component
│   │   ├── Navigation.tsx   # Bottom navigation bar
│   │   └── Toggle.tsx       # Toggle switch
│   ├── context/             # React Context providers
│   │   ├── EntriesContext.tsx   # Entries state & CRUD
│   │   └── SettingsContext.tsx  # Settings state
│   ├── db/
│   │   └── database.ts      # Dexie.js database setup
│   ├── pages/               # Route pages
│   │   ├── AddEntry.tsx     # New entry form
│   │   ├── Dashboard.tsx    # Stats & chart
│   │   ├── EditEntry.tsx    # Edit entry form
│   │   ├── Entries.tsx      # Entry history list
│   │   └── Settings.tsx     # App settings
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── export.ts        # CSV/PDF export functions
│   │   ├── formatters.ts    # Date/number formatters
│   │   └── validation.ts    # Form validation
│   ├── App.tsx              # Main app with routes
│   ├── index.css            # Global styles & CSS vars
│   └── main.tsx             # App entry point
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite & PWA config
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/rv-airob-masters/carmi.git

# Navigate to project directory
cd carmi/carmi-app

# Install dependencies
npm install
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

### Development Features

- **Hot Module Replacement (HMR)** - Instant updates without page reload
- **TypeScript Checking** - Real-time type error detection
- **ESLint** - Code quality and consistency checks

---

## 🧪 Testing

### Manual Testing Checklist

#### Entry Management
- [ ] Add a new entry with all fields filled
- [ ] Add entry with image attachment
- [ ] Edit an existing entry
- [ ] Delete an entry
- [ ] Verify mileage calculation accuracy

#### Dashboard
- [ ] View statistics (total miles, liters, spending)
- [ ] Hover over chart points to see tooltips
- [ ] Export data to CSV
- [ ] Export data to PDF

#### Settings
- [ ] Toggle dark/light mode
- [ ] Switch between km/L and MPG
- [ ] Verify settings persist after reload

#### PWA Features
- [ ] Install app on mobile device
- [ ] Test offline functionality
- [ ] Verify service worker caching

### Automated Testing (Recommended Setup)

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add to package.json scripts
"test": "vitest",
"test:coverage": "vitest --coverage"
```

Example test file (`src/components/Button.test.tsx`):

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-primary)]');
  });
});
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/carmi/',  // Repository name
  // ... other config
});
```

2. Build and deploy:
```bash
npm run build
# Push dist folder to gh-pages branch
```

### Option 4: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t carmi-app .
docker run -p 8080:80 carmi-app
```

### Environment Configuration

For production deployments, ensure:

1. **HTTPS** - Required for PWA installation
2. **Service Worker** - Auto-generated during build
3. **Manifest** - Configured in `vite.config.ts`

---

## 📐 API Schema

### Data Types

```typescript
// Mileage Entry
interface MileageEntry {
  id: string;              // UUID
  date: string;            // ISO date string (YYYY-MM-DD)
  miles: number;           // Distance in miles
  liters: number;          // Fuel in liters
  pricePerLiter: number;   // Price per liter
  mileageKmPerL: number;   // Calculated: (miles × 1.60934) / liters
  mileageMilesPerGallon: number;  // Calculated: miles / (liters × 0.219969)
  image?: string;          // Optional Base64 image
  createdAt: Date;         // Timestamp
  updatedAt: Date;         // Timestamp
}

// Settings
interface Settings {
  darkMode: boolean;       // Theme preference
  mileageUnit: 'km/l' | 'mpg';  // Display unit
}
```

### Database Operations

```typescript
// Create entry
await db.entries.add(entry);

// Read all entries
await db.entries.toArray();

// Update entry
await db.entries.update(id, changes);

// Delete entry
await db.entries.delete(id);
```

### Conversion Constants

```typescript
const MILES_TO_KM = 1.60934;
const LITERS_TO_GALLONS = 0.219969;

// km/L = (miles × MILES_TO_KM) / liters
// MPG = miles / (liters × LITERS_TO_GALLONS)
```

---

## 🔮 Future Enhancements

- [ ] **Multi-vehicle Support** - Track multiple cars
- [ ] **Cloud Sync** - Supabase/Firebase integration
- [ ] **Fuel Price Tracking** - Historical price trends
- [ ] **Maintenance Reminders** - Service scheduling
- [ ] **Trip Logging** - Route tracking with GPS
- [ ] **Data Import** - Import from other apps/CSV

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Built with ❤️ for efficient car mileage tracking.

**Repository:** [github.com/rv-airob-masters/carmi](https://github.com/rv-airob-masters/carmi)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Dexie.js](https://dexie.org/) - IndexedDB Wrapper
- [Workbox](https://developer.chrome.com/docs/workbox/) - PWA Tooling
