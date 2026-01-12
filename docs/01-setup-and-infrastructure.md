# Task 01: Project Setup and Infrastructure

## Context & Objectives
Initialize the "MaumTalk" anonymous advice board project. The goal is to set up a robust foundation with high performance and the required design aesthetics.

## Requirements from PRD
- **Platform**: Responsive Web (Mobile First), SPA Structure.
- **Design**:
  - Dark Mode Fixed: `#0F1115` background, `#FFFFFF` text.
  - Primary Color: Green variations.
  - Fonts: Clean, modern sans-serif (e.g., Pretendard or Inter).
- **Performance**: Initial load < 5s.

## Implementation Steps
1.  **Initialize Project**
    - Stack: Next.js (App Router), TypeScript, Tailwind CSS.
    - Database: SQLite (via Prisma) or Supabase (Free tier) - *Agent Choice*.
    - Package Manager: `npm` or `pnpm`.

2.  **Configure Design System (Tailwind)**
    - Extend `tailwind.config.ts`:
      - Add custom colors: `background: #0F1115`, `primary: <green-hex>`.
      - Configure typography.
    - Create `globals.css`:
      - Apply dark background globally.
      - Reset defaults.

3.  **Layout Implementation**
    - Create Root Layout:
      - Header (Logo "MaumTalk", Search Bar placeholder, "My Activity" link).
      - Main Content Area (Max width constraints for mobile view optimization).
      - Footer (Simple copyright).
    - Ensure fully responsive containers.

4.  **Database & Schema Setup**
    - Initialize Prisma/ORM.
    - **Note**: Although User tables aren't needed (No Login), define the `Post` and `Comment` models early:
      - `Post`: id, title, content, category, authorId (UUID), likeCount, createdAt.
      - `Comment`: id, postId, content, authorId (UUID), likeCount, createdAt.
      - `Like`: userId (UUID), targetId, type (POST/COMMENT).

## Deliverables
- [ ] Running Next.js application.
- [ ] Tailwind configured with correct Dark Mode theme.
- [ ] Database connected and Schema applied.
- [ ] Basic Layout visible on localhost.
