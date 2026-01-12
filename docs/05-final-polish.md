# Task 05: Final Polish & Optimization

## Context & Objectives
Ensure the application is production-ready, safe, and meets the high aesthetic/performance standards demanded by the PRD.

## Requirements from PRD
- **Profanity Filter**: Mask or block bad words in Posts/Comments.
- **Performance**: < 5s Load.
- **Design**: "Emotional implementation", "Smooth animations".
- **SEO**: Proper metadata.

## Implementation Steps
1.  **Profanity Filtering**
    - Use a lightweight library (e.g., `bad-words` or custom regex list).
    - Middleware or API level check.
    - Action: Either reject request with "Please use kind language" or replace with `***`.

2.  **UX/UI Polish**
    - **Micro-interactions**: Add hover effects to cards, buttons.
    - **Transitions**: Page transition animations (framer-motion recommended).
    - **Skeleton Loading**: Show skeletons while fetching data (no layout shift).

3.  **SEO & Metadata**
    - Configure `metadata` in Next.js layout.
    - Title: "MaumTalk - Anonymous Advice Board".
    - Description: "Share your worries anonymously and get comfort."
    - Viewport settings for mobile optimization.

4.  **Performance Check**
    - Run Lighthouse audit.
    - Optimize images (if any assets added).
    - Minimize bundle size.

## Deliverables
- [ ] Profanity filter active (Try creating a post with bad words).
- [ ] Smooth UI with animations (`framer-motion` integrated).
- [ ] SEO Meta tags validated.
- [ ] Lighthouse Performance Score > 90.
