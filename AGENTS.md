# Alile Play V2 - AI Guidelines & System Instructions

## Project Vision
"Alile Play" is a premium, global gaming platform designed for community engagement, monetization, and AI-powered interaction. The "Deep Reboot" (V2) focuses on a Feature-Sliced Design (FSD) architecture to ensure scalability, maintainability, and a professional-grade user experience.

## Core Architectural Principles (FSD)
We follow the **Feature-Sliced Design** methodology:
- **App**: Global initialization, providers, and styles.
- **Pages**: Full-screen views composed of widgets.
- **Widgets**: Complex, self-contained UI blocks (e.g., GameBoard, Sidebar).
- **Features**: User-facing actions with business value (e.g., PlayGame, Subscribe).
- **Entities**: Business logic and data models (e.g., Game, User, Tournament).
- **Shared**: Reusable UI components, utilities, and constants.

## Golden Prompts for Jules (The Autonomous Agent)

### 1. Architectural Setup
"Initialize the project using Feature-Sliced Design. Move core logic into `src/entities` and user actions into `src/features`. Use TanStack Query for all data fetching and state synchronization."

### 2. Monetization & Access Control
"Implement a 5-tier subscription model (Preview, A, B, C, D). Use a Higher-Order Component (HOC) or Middleware to protect game routes and features based on the user's subscription level."

### 3. AI Word Coach Integration
"Integrate the Gemini API to create an 'AI Word Coach'. The coach should analyze the game state (e.g., in WordMaster or Chess) and provide strategic hints, educational context, or motivational feedback."

### 4. Global Expansion (i18n)
"Implement a robust internationalization system using `react-i18next`. Support English, French, and Spanish. Ensure all UI strings are externalized into translation files."

### 5. Marketing & Community Automation
"Build an 'AI Marketing Agent' that monitors platform activity (high scores, new tournaments) and generates automated 'Stage' updates to drive community engagement."

## System Instructions for Development
- **Styling**: Use Tailwind CSS with the "Technical Dashboard" or "Dark Luxury" design recipes. Prioritize high contrast, refined typography (Inter/JetBrains Mono), and purposeful animations using `motion`.
- **Icons**: Use `lucide-react` exclusively.
- **State Management**: Prefer TanStack Query for server state and React Context/Zustand for global UI state.
- **Responsiveness**: Ensure all games and dashboards are "Mobile-First" but optimized for Desktop and Tablet.
- **Error Handling**: Use robust Error Boundaries and provide user-friendly feedback for all failure states.

## API Strategy
- **Headless First**: Build with a simulated API layer (MSW or local services) that can be easily swapped for a real backend.
- **Universal Access**: Expose documented endpoints/components that allow third-party embedding via iFrames.
