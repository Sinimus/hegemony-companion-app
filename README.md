# Hegemony Companion App 🎯

A comprehensive digital assistant for the **Hegemony** board game - your ultimate companion for economic strategy, policy management, and victory point calculations.

> **⚠️ Copyright Notice**: This is an unofficial fan-made companion app. Hegemony board game and all related intellectual property belong to their respective publisher and creators. This tool is provided for educational and entertainment purposes only.

## 🎮 About Hegemony

Hegemony is an asymmetric economic simulation board game where players represent different social classes (Working, Middle, Capitalist, State) competing for influence and prosperity through policy decisions, economic management, and political maneuvering.

## ✨ Features

### 🏛️ **Interactive Policy Board**
- Real-time policy adjustment (7 major policies: Fiscal, Labor, Tax, Health, Education, Trade, Immigration)
- Instant economic impact visualization
- Dynamic Tax Multiplier calculations
- State fiscal balance forecasting

### 📊 **Class-Specific Calculators**
- **Working Class**: Worker budget, prosperity tracking, strike impact analysis
- **Middle Class**: Production planning, foreign market trading, business management
- **Capitalist**: Wealth accumulation, company management, tax optimization
- **State**: Treasury management, legitimacy scoring, event resolution

### 📖 **Comprehensive Guides**
- Welcome view with step-by-step instructions
- Faction-specific turn flow guides
- Complete game glossary with acronyms
- Context-aware calculator recommendations

### 🎨 **Professional Design**
- Mobile-responsive interface
- Dark theme optimized for long gaming sessions
- Intuitive navigation with visual class indicators
- Real-time state persistence

## 🚀 Quick Start

### Online Version
Visit the live app (if deployed) or run locally using Docker (see below).

### Local Development
```bash
# Clone the repository
git clone https://github.com/Sinimus/hegemony-companion-app.git
cd hegemony-companion-app

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:5173
```

### Using Docker (Recommended)
```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/sinimus/hegemony-companion-app:latest

# Run the app
docker run -p 3000:3000 ghcr.io/sinimus/hegemony-companion-app:latest

# Visit http://localhost:3000
```

## 📖 Comprehensive Deployment Guide

📋 **See [DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions on deploying to:

- 🏠 **Home Lab**: Docker Desktop, Docker Compose, Watchtower
- 🖥️ **Unraid + Portainer**: UI deployment, webhooks, auto-updates
- ☁️ **Cloud VPS**: DigitalOcean, AWS ECS, Google Cloud Run, Azure
- 🛠️ **Self-Hosted**: Coolify, Plesk, cPanel
- 🔧 **Kubernetes**: Minikube, production deployments
- 🔄 **Auto-Deploy**: GitHub Actions webhooks for zero-downtime updates

**One-command deployment:**
```bash
docker run -d --name hegemony-companion -p 3000:3000 --restart unless-stopped ghcr.io/sinimus/hegemony-companion-app:latest
```

## 📋 How to Use

### 1. **Start with the Guide** 📚
- Begin on the Welcome page for comprehensive instructions
- Review the glossary for game terminology
- Understand the round structure and your class objectives

### 2. **Set Global Policies** ⚙️
- Navigate to Policies → Dashboard
- Adjust the 7 global policies to match your physical game board
- Monitor real-time economic impacts

### 3. **Select Your Faction** 👥
- Choose your player class from the navigation
- Access class-specific calculators and tools
- Review your turn sequence and strategy guide

### 4. **Calculate & Plan** 🧮
- Use the specialized calculators for your actions
- Plan optimal strategies with real-time feedback
- Track VP opportunities and resource management

## 🏗️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Build Tools**: pnpm package manager

## 🐳 Deployment

### Docker Deployment
The application is containerized and ready for production deployment:

#### Option 1: GitHub Container Registry (Recommended)
```bash
# Pull pre-built image
docker pull ghcr.io/sinimus/hegemony-companion-app:latest

# Run with exposed port
docker run -d -p 3000:3000 --name hegemony-companion ghcr.io/sinimus/hegemony-companion-app:latest
```

#### Option 2: Build from Source
```bash
# Clone and build
git clone https://github.com/Sinimus/hegemony-companion-app.git
cd hegemony-companion-app
docker build -t hegemony-companion .

# Run
docker run -d -p 3000:3000 hegemony-companion
```

#### Environment Variables
```bash
# Optional: Set custom port
docker run -d -p 8080:3000 hegemony-companion

# With custom name
docker run -d -p 3000:3000 --name my-hegemony-app hegemony-companion
```

#### Production Considerations
- The app serves static files only (no backend required)
- All game state is stored locally in the browser
- Suitable for hosting on any container platform (Docker Swarm, Kubernetes, cloud services)
- No environment variables required - works out of the box

### Manual Deployment
```bash
# Build for production
pnpm build

# The built files are in ./dist/
# Serve with any static file server:
npx serve dist -p 3000
```

## 🎯 Game Compatibility

This companion app is designed for:
- **Hegemony: Lead Your Class to Victory** base game
- Compatible with standard rule sets and player counts
- Suitable for both beginners learning the game and experienced players seeking optimization

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── calculators/     # Game-specific calculators
│   ├── domain/          # Game-specific components
│   └── layout/          # Layout components
├── logic/               # Game logic and calculations
├── stores/              # Zustand state management
├── types/               # TypeScript type definitions
├── data/                # Static game data
└── views/               # Page components
```

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

## 📜 License

This project is open source and available under the GNU Affero General Public License v3.0 (AGPL). See [LICENSE](LICENSE) for details.

## 📧 Author

**Created by:** Lukáš Walek
**Contact:** l.walek@proton.me
**GitHub:** [@Sinimus](https://github.com/Sinimus)

---

> **🎲 Disclaimer**: This is an unofficial tool created by a fan for the Hegemony community. All Hegemony game rules, terminology, and intellectual property belong to their respective owners. This app is not affiliated with or endorsed by the game's publisher.

**Enjoy your Hegemony sessions!** 🚀