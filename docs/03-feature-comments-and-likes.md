# Task 03: Comments & Interaction System

## Context & Objectives
Add social interaction capability through comments and likes. Ensure proper ownership checks for deletion without login.

## Requirements from PRD
- **Comments**:
  - Single depth only (No nested replies).
  - Anonymous basic text.
  - Deletable ONLY by the original author (match UUID).
- **Likes**:
  - Applicable to Posts and Comments.
  - One like per UUID per Item.
  - Toggle-able (Like/Unlike).
- **Deletion**:
  - Post/Comment owners can delete their own content.

## Implementation Steps
1.  **Backend API: Comments**
    - `POST /api/posts/[id]/comments`: Create comment.
    - `DELETE /api/comments/[id]`:
      - **CRITICAL**: Check if `request.uuid === comment.authorId`.
      - Only delete if match.

2.  **Backend API: Likes**
    - `POST /api/likes`:
      - Toggle logic: If exists -> Delete (Unlike), If not -> Create (Like).
      - Prevent duplicates based on `(userId, targetId, type)`.

3.  **Frontend: Post Detail Page**
    - Display full post content.
    - [Delete Post] button: Only visible/active if `deviceUUID === post.authorId`.
    - Like Button: Toggle state with upbeat micro-animation.

4.  **Frontend: Comment Section**
    - Input area at bottom or inline.
    - List of comments.
    - [X] button on comments: Only visible if `deviceUUID === comment.authorId`.
    - Like button on comments.

## Deliverables
- [ ] Comment on posts works.
- [ ] Like/Unlike posts and comments works.
- [ ] "Delete" buttons only appear for the creator.
- [ ] Deletion actually removes data from DB.
