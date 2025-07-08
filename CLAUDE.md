# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Auréa is a modern menstrual cycle tracker fullstack application with:

- **Frontend**: React + TypeScript + Vite in `/client`
- **Backend**: NestJS + Prisma + PostgreSQL in `/server`
- **Current branch**: `feat/auth-BE` (implementing authentication backend)

## Common Development Commands

### Frontend (Client)

```bash
cd client
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (Server)

```bash
cd server
npm run start:dev    # Start NestJS in watch mode (http://localhost:3000)
npm run build        # Build for production
npm run start:prod   # Run production build
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier

# Database commands
npx prisma migrate dev   # Run migrations in development
npx prisma generate      # Generate Prisma client (outputs to server/generated/prisma)
npx prisma studio        # Open Prisma Studio GUI

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Generate coverage report
npm run test:e2e        # Run end-to-end tests
```

## Architecture Overview

### Frontend Architecture

- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (New York style) + Tailwind CSS
- **State**: Currently using React hooks (no global state management yet)
- **Path aliases**: `@/*` maps to `/client/src/*`

Key frontend structure:

- `/client/src/components/` - Reusable UI components
- `/client/src/components/ui/` - shadcn/ui components
- `/client/src/pages/` - Page components
- `/client/src/styles/` - Global styles (Tailwind base)

### Backend Architecture

- **Framework**: NestJS with modular architecture
- **Database**: PostgreSQL with Prisma ORM
- **API Style**: RESTful endpoints (to be implemented)
- **Current modules**:
  - `AppModule` - Root module
  - `UserModule` - User management (basic placeholder)
  - `PrismaService` - Database connection (to be implemented)

Database schema:

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
}
```

**Note**: Prisma client generates to `/server/generated/prisma/` directory

### Current Backend State

The backend is in early development stage:

- Basic NestJS structure set up
- User module exists but only has placeholder methods
- No authentication implementation yet
- No actual database operations implemented
- Empty Prisma service directory awaiting implementation

### Key Implementation Details

1. **Authentication Forms**: Frontend has Register and SignIn forms ready with:

   - React Hook Form for form state
   - Zod schemas for validation
   - shadcn/ui form components

2. **Database Setup**:

   - Prisma migrations in `/server/prisma/migrations/`
   - Connection string via `DATABASE_URL` env variable
   - Pending migration needs to be run

3. **Development Flow**:
   - Frontend and backend run on separate ports
   - API calls from frontend to backend (CORS will need configuration)
   - Hot reloading enabled on both sides

## Next Steps for Backend Development

1. **Create Prisma Service**: Implement database connection in `/server/src/prisma/prisma.service.ts`
2. **Authentication Module**: Create auth module with:
   - JWT strategy
   - Login/Register endpoints
   - Password hashing (bcrypt)
   - Guards for protected routes
3. **User CRUD Operations**: Implement actual user operations in UserService
4. **DTOs**: Create Data Transfer Objects for user operations
5. **Environment Configuration**: Set up `.env` file with DATABASE_URL

## Important Notes

- The project is implementing a V1 feature checklist (see `/docs-private/checklist.md`):
  - Profile setup and management
  - Calendar view with cycle tracking
  - Authentication system
- Frontend authentication UI is ready, waiting for backend endpoints
- Consider using `@nestjs/jwt` and `@nestjs/passport` for authentication

## Code Style Guidelines

- **Frontend**: ESLint configured with TypeScript and React hooks rules
- **Backend**: ESLint + Prettier integration (single quotes, trailing commas)
- **Git**: Working on feature branches, merging to `main`
- Path imports use aliases (`@/components/...`) in frontend
- Follow existing patterns when adding new components or modules

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.
