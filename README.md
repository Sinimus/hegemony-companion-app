# Hegemony Companion App 🎯

A comprehensive digital assistant for the **Hegemony** board game - your ultimate companion for economic strategy, policy management, and victory point calculations.

## 🎮 About Hegemony

Hegemony is an asymmetric economic simulation board game where players represent different social classes (Working, Middle, Capitalist, State) competing for influence and prosperity through policy decisions, economic management, and political maneuvering.

## ✨ Features

### 🏛️ **Interactive Policy Board**
- Real-time policy adjustment (7 major policies: Fiscal, Labor, Tax, Health, Education, Trade, Immigration)
- Instant economic impact visualization
- Dynamic Tax Multiplier calculations
- State fiscal balance forecasting
- Integrated Loan Cost Planner for strategic borrowing

### 📊 **Class-Specific Calculators**
- **Working Class**: Worker budget, prosperity tracking, Trade Union VP calculator
- **Middle Class**: Production planning, foreign market trading, business management
- **Capitalist**: Wealth accumulation, company management, automation simulation, Automa Decision Assistant
- **State**: Treasury management, legitimacy scoring, Welfare Benefits calculator, IMF Intervention Risk Analysis

### 🎯 **End-Game Scoring System**
- Comprehensive VP calculator for all player classes
- Policy alignment scoring (A/B/C target matching)
- Resource and money conversion calculations
- Loan penalty assessment and VP impact
- Dedicated End Game view with complete scoring breakdown

### 🤖 **Automation & Micro-Utilities**
- Production automation simulation (zero wages for machinery)
- Automa Decision Assistant for solo play support
- Trade Union VP tracking (2 VP per union marker)
- Welfare Benefits revenue calculation (P4/P5 policy dependent)
- IMF Intervention risk analysis with fiscal policy limits

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


### Installation
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

### 5. **End-Game Planning** 🏁
- Navigate to End Game view for final VP calculations
- Assess policy alignment bonuses
- Calculate loan penalties and resource conversions

## 🏗️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Build Tools**: pnpm package manager
- **Architecture**: Type-safe functional programming with pure logic layers


## 🎯 Game Compatibility

This companion app is designed for:
- **Hegemony: Lead Your Class to Victory** base game
- Compatible with standard rule sets and player counts
- Suitable for both beginners learning the game and experienced players seeking optimization

## 🚀 Complete Feature Overview

### **📋 Navigation & Views**
- **Guide** - Welcome view with instructions and glossary
- **Policies** - Dashboard with real-time economic impact and loan planning
- **End Game** - Comprehensive scoring calculator for all classes
- **Working/Middle/Capitalist/State** - Class-specific views with specialized tools

### **🔧 Advanced Calculators**
- **Policy Impact Dashboard** - Real-time economic synthesis
- **Loan Cost Planner** - Strategic borrowing with VP penalty analysis
- **Production Calculator** - With automation simulation toggle
- **End-Game Scoring** - Complete VP breakdown for all players
- **IMF Risk Analysis** - State loan limit monitoring
- **Trade Union VP Tracker** - Working Class scoring phase tool
- **Welfare Benefits Calculator** - State revenue from P4/P5 policies
- **Automa Decision Assistant** - Solo play support

### **💾 Data Management**
- **Local Storage Persistence** - Game state preserved between sessions
- **Type-Safe Architecture** - Complete TypeScript coverage
- **Real-time Updates** - Instant feedback on policy and calculator changes
- **Mobile Responsive** - Optimized for phones and tablets

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



## 📜 License

This project is open source and available under the GNU Affero General Public License v3.0 (AGPL). See [LICENSE](LICENSE) for details.

---

> **🎲 Disclaimer**: This is an unofficial tool created by a fan for the Hegemony community. All Hegemony game rules, terminology, and intellectual property belong to their respective owners. This app is not affiliated with or endorsed by the game's publisher.

**Enjoy your Hegemony sessions!** 🚀
