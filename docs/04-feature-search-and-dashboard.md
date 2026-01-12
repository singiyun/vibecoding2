# Task 04: "My Activity" & Search

## Context & Objectives
Enable users to find content, specifically their own history and general keyword search. This completes the navigation requirements.

## Requirements from PRD
- **My Activity**:
  - "My Posts": List of posts created by the current UUID.
  - (Optional MVP) "My Comments": List of comments.
- **Search**:
  - Target: Post Title & Content.
  - Exclude: Comments.
  - Response time: < 1 second.
- **Warning**:
  - Explicitly warn that clearing browser cache loses this history.

## Implementation Steps
1.  **Backend API: Search**
    - `GET /api/search?q=keyword`:
      - Query DB for `title.contains(q) OR content.contains(q)`.
      - Indexing may be needed for speed if DB grows (for MVP, standard query is likely fine).
      - Return sorted by Newest.

2.  **Backend API: My Posts**
    - `GET /api/my/posts`:
      - Require UUID header.
      - Return posts `where authorId === uuid`.

3.  **Frontend: My Activity Page**
    - Route: `/my`.
    - Tab: "My Posts".
    - List view identical to Home but filtered.
    - Add a "Warning Banner": "Clearing browser data will lose your history."

4.  **Frontend: Search Implementation**
    - Integrate into the Header search bar.
    - Trigger search on 'Enter' or click.
    - Search Results Page: List of matching posts.
    - Empty state: "No results found for..."

## Deliverables
- [ ] "My Activity" page listing user's own posts.
- [ ] Search functionality returning relevant posts.
- [ ] Performance check: Search feels instant (<1s).
