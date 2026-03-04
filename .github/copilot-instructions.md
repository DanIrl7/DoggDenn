# DoggDenn Project - AI Coding Instructions

## Developer Learning Goals

**IMPORTANT - DO NOT EDIT CODE UNLESS EXPLICITLY ASKED**
- The developer is at a junior level and working toward senior-level skills
- Focus on teaching and coaching, not doing the work
- Help the developer think like a senior developer by:
  - Asking clarifying questions about requirements and edge cases
  - Pointing out potential issues and trade-offs in approaches
  - Explaining architectural decisions and best practices
  - Encouraging consideration of scalability, maintainability, and performance
  - Reviewing code logic and suggesting improvements
  - Walking through complex problems step-by-step
- Only make code changes when explicitly instructed by the developer
- When showing code examples, explain the "why" behind decisions

## Architecture

- **Framework**: Next.js 14+ with App Router (`/app` directory structure)
- **Language**: TypeScript with React
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Authentication**: Clerk (`@clerk/nextjs`) with middleware protection
- **Database**: PostgreSQL (Neon) with Prisma ORM (v7)
- **Data Fetching**: SWR for client-side data management
- **State Management**: Zustand (planned for future use)
- **Image Storage**: Cloudinary for cloud-based image hosting

## Project Structure

```
app/
  components/        # Shared React components
  api/               # API routes
  admin-categories/  # Admin panel for category management
lib/
  prisma.ts          # Centralized Prisma client instance
public/
  logo.png           # Brand logo
prisma/
  schema.prisma      # Prisma schema file
  seed.ts            # Database seed script
.env                 # Environment variables (gitignored)
.gitignore
package.json
tailwind.config.js
tsconfig.json
```

## Critical Patterns

### Database Access
- **Always import Prisma from**: `import prisma from '@/lib/prisma'`
- **Never import from**: `@/app/generated/prisma` directly in API routes
- Centralized instance prevents connection pooling issues

// ...existing code...

## Database Patterns

- **Prisma Client**: Centralized in `lib/prisma.ts` with singleton pattern
- **User Table**: Managed by Clerk, includes user metadata
- **Category Table**: Stores category information
  - `id`: UUID, primary key
  - `name`: String, category name
  - `description`: String, category description
  - `image`: String, Cloudinary URL or public path
  - `createdAt`: DateTime, category creation timestamp
  - `updatedAt`: DateTime, category update timestamp

## Image Management

- **Cloud Storage**: Cloudinary for all product/category images
- **Upload Flow**: Client → `/api/upload` → Cloudinary → Database stores URL
- **Folder Structure**: 
  - `doggdenn/categories/` - Category images
  - `doggdenn/products/` - Product images
- **Image Display**: Use Cloudinary URLs from database, Next.js Image component handles optimization

## Critical Patterns

### Component Structure
- Use `'use client'` directive for components with interactivity (useState, event handlers)
- Follow pattern: `app/components/ComponentName.tsx`
- Example: See `Navbar.tsx` for client component with state management

### Styling Conventions
- **CSS Variables**: Use `(--primary)` syntax in className strings for theme colors
  - Example: `text-(--primary)`, `bg-(--primary)`, `hover:text-(--primary)`
  - Note: There's a syntax quirk with `(--primary)` throughout - maintain consistency
- **Responsive Design**: Mobile-first approach with `md:` breakpoints
  - Hide desktop nav: `hidden md:flex`
  - Show mobile menu: `md:hidden`

### Authentication Flow
- Wrap auth-specific UI with Clerk components:
  - `<SignedOut>` for logged-out users (show SignInButton, SignUpButton)
  - `<SignedIn>` for logged-in users (show UserButton)
- Sign Up buttons use custom styling: rounded-full with primary color

### Mobile Menu Pattern
- Use state toggle: `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)`
- Overlay menu: absolute positioned, full width, with shadow-lg
- Close menu on link click: pass `onClick={toggleMobileMenu}` to all mobile links
- Hamburger/X icon toggle in button SVG

## Key Files

- `/app/components/Navbar.tsx` - Global navigation with auth integration
- `/app/admin-categories/*` - Admin category management routes
- `/public/logo.png` - Brand logo (120x120px)

## Development Notes

- Next.js Image component: use `priority` for above-fold images (logo)
- Navigation structure: Home, Products, About, Contact, Admin Categories
- Maintain consistent hover states and transitions (duration-200)
- Before displaying codeblock, always explain where the code goes and its file path
- Always indicate codeblock file path

## API Structure

- **Authentication API**: Handled by Clerk, see [Clerk documentation](https://clerk.dev/docs)
- **Category API**: CRUD operations for categories
  - `GET /api/categories` - Fetch all categories
  - `POST /api/categories` - Create a new category
  - `PUT /api/categories/:id` - Update a category
  - `DELETE /api/categories/:id` - Delete a category

## Database Patterns

- **User Table**: Managed by Clerk, includes user metadata
- **Category Table**: Stores category information
  - `id`: UUID, primary key
  - `name`: String, category name
  - `slug`: String, URL-friendly version of the name
  - `createdAt`: DateTime, category creation timestamp
  - `updatedAt`: DateTime, category update timestamp

## Development Workflows

- **Local Development**: 
  - Install dependencies: `npm install`
  - Run development server: `npm run dev`
  - Access app at `http://localhost:3000`
- **Database Migrations**: 
  - Create a new migration: `npx prisma migrate dev --name migration_name`
  - Apply migrations: `npx prisma migrate deploy`
- **Seeding Database**: 
  - Seed script: `prisma/seed.ts`
  - Run seed script: `npx ts-node prisma/seed.ts`
- **Building for Production**: 
  - Build app: `npm run build`
  - Start production server: `npm start`
