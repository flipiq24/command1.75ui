# FlipIQ Dashboard

## Overview

FlipIQ is a real estate investment deal management platform designed for acquisition associates. The application helps users manage property deals, track agent relationships, and organize daily outreach activities. It features a modern dashboard interface with deal tracking, propensity scoring, action plan workflows, and communication tools integrated for real estate investment operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, utilizing a component-based architecture with functional components and hooks.

**UI Library**: Radix UI primitives combined with Tailwind CSS for styling. The application uses the shadcn/ui design system (New York variant) for consistent component styling.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router.

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local component state using React hooks (useState, useMemo)
- No global state management library (Redux/Zustand) - relies on prop drilling and query cache

**Styling Approach**:
- Tailwind CSS v4 with CSS variables for theming
- Custom color system defined in index.css using CSS custom properties
- Responsive design with mobile-first breakpoints
- Custom animations and transitions

**Key Design Patterns**:
- Composition pattern for UI components
- Custom hooks for reusable logic (use-mobile, use-toast)
- Utility-first CSS approach with cn() helper for conditional classes

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API endpoints under `/api` prefix:
- GET /api/deals - Fetch all deals
- GET /api/deals/:id - Fetch single deal
- POST /api/deals - Create new deal
- PATCH /api/deals/:id - Update deal
- DELETE /api/deals/:id - Delete deal

**Request Handling**:
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded form data support
- Custom logging middleware for request/response tracking
- Error handling with appropriate HTTP status codes

**Development vs Production**:
- Development: Vite middleware for HMR and dev server
- Production: Static file serving from dist/public directory
- Environment-specific build processes

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless driver with WebSocket support.

**ORM**: Drizzle ORM for type-safe database operations:
- Schema definition in shared/schema.ts
- Migrations stored in /migrations directory
- Zod schema integration for runtime validation

**Data Models**:
1. **Users Table**: Basic authentication with username/password
2. **Deals Table**: Property deals with fields for address, specs, pricing, propensity indicators, status tracking, and timestamps

**Storage Layer**: 
- Abstracted storage interface (IStorage) for potential future database swapping
- DbStorage implementation using Drizzle ORM
- Support for bulk operations (bulk updates)

**Connection Management**: Connection pooling via @neondatabase/serverless Pool for efficient database connections.

### Authentication and Authorization

**Strategy**: Currently implements basic user storage structure without active authentication middleware. The schema supports username/password authentication, but authentication routes and session management are not yet implemented.

**Planned Approach** (based on schema):
- User credentials stored with hashed passwords
- Session-based authentication (express-session dependency present)
- PostgreSQL session store via connect-pg-simple

**Current State**: Authentication framework is scaffolded but not enforced on routes.

### External Dependencies

**AI Integration**: 
- OpenAI API integration via Replit's AI Integrations service
- Custom prompts for real estate deal analysis
- GPT-5 model for generating insights and property analysis
- AI features: deal analysis, conversation assistance for acquisition associates

**Development Tools (Replit-specific)**:
- @replit/vite-plugin-runtime-error-modal - Error overlay in development
- @replit/vite-plugin-cartographer - Code navigation
- @replit/vite-plugin-dev-banner - Development mode indicator

**Third-Party UI Components**: Extensive use of Radix UI primitives for accessible, unstyled components:
- Dialogs, dropdowns, tooltips, accordions
- Form controls (checkboxes, radio groups, selects)
- Navigation components (menus, tabs)
- Feedback components (toasts, progress indicators)

**Utility Libraries**:
- date-fns for date manipulation
- nanoid for unique ID generation
- clsx and tailwind-merge for className utilities
- zod for runtime schema validation
- lucide-react for icon components

**Build Tools**:
- Vite for frontend bundling and dev server
- esbuild for server bundling in production
- TypeScript compiler for type checking
- Drizzle Kit for database migrations

**Communication Libraries** (installed but not fully implemented):
- Potential for email integration (nodemailer present in dependencies)
- WebSocket support (ws library present)