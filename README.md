# HealthCare Pro

A comprehensive healthcare management web application built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Dashboard** - Personal health overview with appointments, vitals, and quick actions
- **Appointment Booking** - Schedule in-person or telemedicine appointments
- **Doctor Directory** - Search and filter healthcare providers
- **Telemedicine** - Virtual consultations with video calls
- **Medical Records** - Access and manage health documents
- **Billing** - View and pay medical bills

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS v4
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma (recommended)
- **Authentication**: NextAuth.js / Auth.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (optional for production)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
healthcare-pro/
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── appointments/
│   │   │   ├── billing/
│   │   │   ├── doctors/
│   │   │   ├── records/
│   │   │   └── telemedicine/
│   │   └── login/
│   ├── components/
│   │   ├── ui/               # Base components
│   │   ├── layout/           # Sidebar, Header, etc
│   │   └── dashboard/
│   ├── lib/
│   ├── types/
│   └── data/                 # Mock data
├── public/
├── DATABASE_SCHEMA.md        # Full ERD
└── .env.example
```

## Data Storage

| Environment | Storage |
|------------|---------|
| Development | Mock data (`src/data/mock-data.ts`) + localStorage |
| Production | PostgreSQL + Prisma ORM |

See `DATABASE_SCHEMA.md` for full database design.

## Security

- Rate limiting on API routes
- SQL injection prevention (parameterized queries)
- XSS protection
- Input validation with Zod
- Environment variable protection
- HTTPS enforcement in production

## Testing

```bash
npm run build    # Build for production
npm run dev      # Development server
```

## Deployment

```bash
npm run build
vercel deploy
```

## License

MIT