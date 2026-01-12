# Task 02: Identity & Post Management

## Context & Objectives
Implement the core "No Login" identity system and the ability to create/read anonymous posts. This is the heart of the service.

## Requirements from PRD
- **Identity**:
  - No Login / No Sign-up.
  - Generate a UUID for the user on first visit.
  - Store UUID in Browser (Cookie/LocalStorage).
  - Use this UUID to identify "My Posts".
- **Post Creation**:
  - Title (Max 50 chars, Required).
  - Content (Max 1000 chars, Required).
  - Category (Optional: Love, Career, Relationships, School, Etc).
  - *No image upload*.
- **Post List**:
  - Sort by: Latest (Default), Most Likes.
  - Display: Title, Time (Relative), Like Count, Comment Count.

## Implementation Steps
1.  **Identity Utility**
    - Create a utility/hook (e.g., `useIdentity`) that checks for a stored UUID.
    - IF missing -> Generate UUID -> Store in LocalStorage/Cookie.
    - Ensure this UUID is sent with API requests as a header or body.

2.  **Backend API: Posts**
    - `POST /api/posts`:
      - Validate inputs (Length limits).
      - Save `authorId` from the identity UUID.
      - Handle "Category" selection.
    - `GET /api/posts`:
      - Support pagination (Infinite scroll or Load More).
      - Support sorting (Newest vs Popular).

3.  **Frontend: Write Page**
    - Simple form: Title, Category (Dropdown/Chips), Content (Textarea).
    - Client-side validation for character limits.
    - Submit -> API Call -> Redirect to Home.

4.  **Frontend: Feed/Home**
    - Display list of posts cards.
    - Each card shows: Category badge, Title, Relative Time, Like/Comment icons with counts.
    - Click card -> Navigate to `/posts/[id]`.

## Deliverables
- [ ] Auto-generated User UUID on visit.
- [ ] Post creation form working (Data saved to DB).
- [ ] Home page displaying list of posts.
