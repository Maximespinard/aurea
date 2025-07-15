# 🌸 Auréa

**Auréa** is a modern and private menstrual cycle tracker designed to help users record their periods, monitor symptoms and moods, and better understand their fertility and premenstrual phases through a clean, responsive interface.

Built with a fast and scalable fullstack architecture, Auréa combines a refined user experience with accurate cycle predictions and personalized tracking tools.

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strong typing
- **Vite** - Fast build tool with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Calendar** - Interactive calendar component for cycle tracking
- **React Hook Form + Zod** - Form handling with validation
- **React Query** - Server state management and caching
- **Zustand** - Lightweight client state management
- **React Router v7** - Modern routing solution
- **date-fns** - Date utility library
- **Lucide React** - Icon library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Full-stack type safety
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **JWT Authentication** - Secure token-based auth
- **bcrypt** - Password hashing
- **Class Validator** - DTO validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection
- **Swagger** - Interactive API documentation

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Git** - Version control

## 📁 Project Structure

```
aurea/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components (shadcn/ui)
│   │   ├── features/          # Feature-specific components
│   │   │   ├── Calendar/      # Calendar widget and cycle visualization
│   │   │   ├── Cycle/         # Period tracking and day entries
│   │   │   ├── Dashboard/     # Cycle statistics and insights
│   │   │   ├── Profile/       # User profile management
│   │   │   ├── Register/      # User registration
│   │   │   └── SignIn/        # User authentication
│   │   ├── pages/             # Page components and routing
│   │   ├── hooks/             # Custom React hooks
│   │   ├── stores/            # Zustand state management
│   │   ├── lib/               # Utilities, API config, constants
│   │   └── assets/            # Static assets (logo, icons)
│   └── public/
└── server/                    # NestJS backend
    ├── src/
    │   ├── auth/              # JWT authentication system
    │   │   ├── dto/           # Data transfer objects
    │   │   ├── guards/        # Auth guards (JWT, Local)
    │   │   ├── strategies/    # Passport strategies
    │   │   └── interfaces/    # TypeScript interfaces
    │   ├── user/              # User management module
    │   │   └── dto/           # User DTOs
    │   ├── profile/           # User profile and cycle settings
    │   │   └── dto/           # Profile DTOs
    │   ├── cycle/             # Cycle tracking and predictions
    │   │   └── dto/           # Cycle and day entry DTOs
    │   └── prisma/            # Database service layer
    └── prisma/                # Database schema and migrations
        ├── migrations/        # Database migration files
        └── schema.prisma      # Prisma schema definition
```

## 🎯 Features

### 🔐 User Authentication
- Secure registration and login system
- JWT-based authentication with 7-day token expiration
- Password hashing with bcrypt for security
- Protected routes and persistent login sessions

### 📅 Cycle Tracking & Predictions
- **Interactive Calendar** - Beautiful calendar interface with react-calendar
- **Period Tracking** - Log period start/end dates with visual indicators
- **Cycle Predictions** - Smart predictions for future periods and fertile windows
- **Fertile Window Detection** - Automatic calculation and visualization of fertile days
- **Future Date Prevention** - Prevents data entry for future dates while maintaining predictions
- **Cycle Statistics** - Track cycle length, period duration, and patterns

### 📝 Daily Entries & Symptoms
- **Day Entry Modal** - Log symptoms, moods, and notes for any day
- **Mood Tracking** - Select and track daily mood with intuitive interface
- **Symptom Logging** - Comprehensive symptom tracking with predefined options
- **Notes & Observations** - Free-form text for personal observations
- **Entry Indicators** - Visual indicators on calendar for days with logged data

### 👤 Profile Management
- **Personal Settings** - Customize cycle length, period duration preferences
- **Contraception Tracking** - Log current contraception method
- **Profile Customization** - Personal information and cycle preferences
- **Data Validation** - Form validation with Zod schemas for data integrity

### 📊 Dashboard & Insights
- **Cycle Overview** - Current cycle information and statistics
- **Trend Analysis** - Visual representation of cycle patterns
- **Quick Actions** - Start new cycle, log period, view insights
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 🎨 User Experience
- **Modern UI** - Clean, intuitive interface with shadcn/ui components
- **Dark/Light Themes** - Responsive design with beautiful gradients
- **Smooth Animations** - Polished interactions and transitions
- **Accessibility** - ARIA-compliant components for inclusive design
- **Mobile-First** - Optimized for touch devices and small screens

### 🔒 Privacy & Security
- **Local-First Data** - Your data stays on your device and secure servers
- **No Third-Party Tracking** - Privacy-focused approach
- **Secure API** - Rate limiting, validation, and security headers
- **Data Encryption** - Passwords hashed, JWT tokens for secure communication

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://i.imgur.com/CiRZvNL.jpeg" alt="Dashboard" width="400"/>
        <br />
        <sub><b>Dashboard Overview</b></sub>
      </td>
      <td align="center">
        <img src="https://i.imgur.com/zQethFc.jpeg" alt="Calendar" width="400"/>
        <br />
        <sub><b>Interactive Calendar</b></sub>
      </td>
      <td align="center">
        <img src="https://i.imgur.com/YdStaaZ.jpeg" alt="Profile Settings" width="400"/>
        <br />
        <sub><b>Profile Settings</b></sub>
      </td>
    </tr>
  </table>
</div>

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aurea
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Backend configuration:
   ```bash
   # In server/.env
   DATABASE_URL="postgresql://user:password@localhost:5432/aurea"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRATION="7d"  # Token expiration time (e.g., 1h, 24h, 7d, 30d)
   ```
   
   Frontend configuration:
   ```bash
   # In client/.env
   VITE_API_URL=http://localhost:3000
   
   # For production deployment:
   # VITE_API_URL=https://aurea-production.up.railway.app
   ```

4. **Run database migrations**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   # Frontend (http://localhost:5173)
   cd client
   npm run dev
   
   # Backend (http://localhost:3000)
   cd server
   npm run start:dev
   
   # API Documentation available at http://localhost:3000/api
   ```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend
- `npm run start:dev` - Start in watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Run production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run test` - Run tests
- `npx prisma studio` - Open database GUI

## 🏗️ Architecture

Auréa follows modern fullstack development patterns:

- **Component-based Frontend** - Modular React components with TypeScript
- **Feature-driven Structure** - Organized by features rather than file types
- **Type Safety** - End-to-end TypeScript for better developer experience
- **Modern State Management** - Zustand for client state, React Query for server state
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **API-first Backend** - RESTful APIs with NestJS and automatic validation
- **Database-first** - Prisma schema drives the data layer

## 📚 API Documentation

Auréa provides comprehensive API documentation through Swagger/OpenAPI:

- **Interactive Documentation**: Available at `http://localhost:3000/api` when the backend is running
- **API Testing**: Test endpoints directly from the browser
- **Authentication**: JWT Bearer token authentication integrated
- **Request/Response Examples**: Detailed schemas and examples for all endpoints

<div align="center">
  <img src="https://i.imgur.com/vLstLH4.jpeg" alt="Swagger API Documentation" width="800"/>
  <br />
  <sub><b>Interactive API Documentation with Swagger</b></sub>
</div>

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers

## 📱 Responsive Design

Auréa is built mobile-first and works beautifully on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

---

*Auréa - Your personal cycle companion* 🌸