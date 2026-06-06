# URL Shortener Frontend

A modern, responsive web application for shortening URLs built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**. The frontend provides an intuitive interface to shorten long URLs by communicating with the backend API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Integration](#api-integration)
- [Environment Configuration](#environment-configuration)
- [Building & Deployment](#building--deployment)
- [Available Scripts](#available-scripts)

## Features

- 🚀 **Fast & Responsive**: Built with Next.js for optimal performance
- 🎨 **Modern UI**: Beautiful design with Tailwind CSS and shadcn/ui components
- 📱 **Mobile Friendly**: Fully responsive design for all devices
- ⚡ **Real-time Feedback**: Instant URL shortening with loading states
- 📋 **Copy to Clipboard**: One-click copy functionality for shortened URLs
- ❌ **Error Handling**: Comprehensive error messages and validation
- 🎯 **Type Safe**: Full TypeScript support for improved developer experience
- 🌙 **Modern Stack**: React 19, Next.js 16, and latest dependencies

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.6 | React framework with server-side rendering |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5 | Type safety and development experience |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **shadcn/ui** | 4.8.3 | Reusable UI components |
| **Lucide React** | 1.17.0 | Icon library |
| **Radix UI** | 1.4.3 | Headless UI components |
| **ESLint** | 9 | Code linting |

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** 18.17 or later
- **npm** 9+ or **yarn** 1.22+
- **git** (for version control)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   Or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Create a `.env.local` file** (see [Environment Configuration](#environment-configuration) section)

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

**Hot Reload**: The development server supports hot module replacement. Any changes you make to the code will automatically refresh in the browser.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout component with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── shortenhero.tsx     # Main hero component with state management
│   ├── shorten-hero/
│   │   ├── shorten-form.tsx           # URL input form
│   │   ├── shorten-hero-intro.tsx     # Introduction section
│   │   ├── shorten-hero-badge.tsx     # Badge component
│   │   └── shortened-result.tsx       # Result display component
│   └── ui/
│       ├── badge.tsx       # Reusable badge component
│       ├── button.tsx      # Reusable button component
│       ├── card.tsx        # Reusable card component
│       └── input.tsx       # Reusable input component
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
└── package.json            # Project dependencies
```

## Components

### 1. **ShortenHero** (`components/shortenhero.tsx`)
The main component that orchestrates the URL shortening functionality.

**Responsibilities:**
- Manages state for URL input, shortened URL, loading, and errors
- Handles the API request to the backend
- Manages user interactions (shortening, copying)
- Displays appropriate UI states

**Key Features:**
- State management with React hooks (`useState`)
- Error handling and validation
- Copy-to-clipboard functionality
- Keyboard support (Enter key to shorten)

### 2. **ShortenForm** (`components/shorten-hero/shorten-form.tsx`)
Input form component for entering the URL to shorten.

**Props:**
```typescript
{
  error: string;                              // Error message to display
  isLoading: boolean;                        // Loading state
  url: string;                               // Current URL input value
  onChangeUrl: (value: string) => void;      // Change handler
  onKeyDown: (event: KeyboardEvent) => void; // Keyboard event handler
  onShorten: () => void;                     // Shorten button click handler
}
```

**Features:**
- URL input field with icon
- Dynamic button with loading state
- Error message display
- Responsive layout (stack on mobile, horizontal on desktop)

### 3. **ShortenedResult** (`components/shorten-hero/shortened-result.tsx`)
Displays the shortened URL after successful shortening.

**Features:**
- Shows the original and shortened URLs
- Copy-to-clipboard button
- Visual feedback for copy action
- Display shortened URL with full link

### 4. **ShortenHeroIntro** (`components/shorten-hero/shorten-hero-intro.tsx`)
Introduction/header section of the application.

**Features:**
- Application title and description
- Visual appeal with badges

### 5. **UI Components** (`components/ui/`)
Reusable shadcn/ui components used throughout the application:
- **Badge**: For displaying tags or labels
- **Button**: Primary and secondary buttons
- **Card**: Container component for content
- **Input**: Form input field

## API Integration

### Base URL Configuration

The frontend communicates with the backend API through environment variables. The API base URL is configured via:

```
NEXT_PUBLIC_API_URL = http://localhost:5000
```

### Endpoint: POST /shorten

**Request:**
```typescript
POST {NEXT_PUBLIC_API_URL}/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response (Success - 200):**
```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid URL format"
}
```

### Implementation Details

In `components/shortenhero.tsx`:

```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/shorten`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalUrl: urlToShorten,
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  setError(data.error || 'Failed to shorten URL');
} else {
  setShortenedUrl(data.shortUrl);
}
```

### Error Handling

The frontend gracefully handles various error scenarios:

- **Network Errors**: Displays "Failed to connect to the server"
- **Invalid URL**: Shows "Please enter a valid URL"
- **Empty Input**: Shows "Please enter a URL"
- **Server Errors**: Displays error message from API response

## Environment Configuration

### Setting Up Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API URL (must include protocol and port)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Additional API endpoints
# NEXT_PUBLIC_REDIRECT_URL=http://localhost:5000
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

**Note**: Prefix `NEXT_PUBLIC_` makes variables accessible in the browser. Sensitive variables should not use this prefix.

### Development vs Production

**Development (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Building & Deployment

### Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized build in the `.next` directory.

### Starting Production Server

After building, start the production server:

```bash
npm run start
```

The application will be available at `http://localhost:3000`

### Deployment Options

#### Option 1: Vercel (Recommended for Next.js)

Vercel is the official Next.js deployment platform with zero-configuration deployment.

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your production API URL

#### Option 2: Docker

Create a `Dockerfile` in the frontend directory:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t url-shortener-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com url-shortener-frontend
```

#### Option 3: Traditional Hosting (AWS, DigitalOcean, Heroku)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server:**
   ```bash
   npm run start
   ```

4. **Configure reverse proxy** (Nginx/Apache) to point to `localhost:3000`

#### Option 4: GitHub Pages (Static Export)

For static export, modify `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
};
```

Then build and deploy:
```bash
npm run build
# Upload the 'out' directory to GitHub Pages
```

### Performance Optimization

The frontend includes several performance optimizations:

- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting for faster page loads
- **CSS Optimization**: Tailwind CSS purges unused styles
- **Tree Shaking**: Unused code is removed from bundles
- **Minification**: Automatic minification in production builds

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server with hot reload |
| **build** | `npm run build` | Create production-optimized build |
| **start** | `npm run start` | Start production server |
| **lint** | `npm run lint` | Run ESLint code quality checks |

## Development Workflow

### 1. Start the Backend

```bash
cd Backend
npm install
npm run dev
```

Ensure the backend is running on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

### 4. Make Changes

Edit components in the `components/` directory. The development server will hot reload your changes automatically.

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@/components/...'"**
- Solution: Ensure TypeScript path aliases are configured in `tsconfig.json`

**Issue: "NEXT_PUBLIC_API_URL is undefined"**
- Solution: Create `.env.local` file and add `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Solution: Restart the development server after adding environment variables

**Issue: "Port 3000 is already in use"**
- Solution: Kill the process using port 3000 or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

**Issue: "API connection fails"**
- Solution: Verify the backend is running on the correct port
- Solution: Check `NEXT_PUBLIC_API_URL` in `.env.local` matches the backend URL
- Solution: Check CORS configuration in the backend

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Next.js documentation: https://nextjs.org/docs
3. Check shadcn/ui components: https://ui.shadcn.com

---

**Happy Coding! 🚀**
