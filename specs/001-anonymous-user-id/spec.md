# Spec 01: Identity System (Anonymous User)

## 1. Overview
사용자 회원가입이나 로그인 절차 없이, 웹 브라우저 기반의 UUID를 통해 사용자를 식별하는 시스템을 구축한다. 이 식별자는 게시글/댓글의 작성자 확인, 수정/삭제 권한 부여, "내가 쓴 글" 목록 조회에 사용된다.

## 2. Technical Requirements

### 2.1 Identifier Generation (Client-Side)
- **Format**: UUID v4 (RFC 4122).
- **Storage**: `localStorage`.
  - Check `localStorage.getItem('vibecoding_uid')`.
  - If null, generate new UUID and store it.
  - *Optional*: Sync to `cookie` for SSR compatibility if needed (start with Client-Only for MVP).

### 2.2 Server Communication
- 모든 API 요청(`POST`, `PUT`, `DELETE`, `GET` for filtered lists)에 식별자를 포함한다.
- **Header**: `X-User-ID: <uuid>`

### 2.3 Data Model
- **User Table**: (Optional/Virtual)
  - MVP 단계에서는 별도의 `User` 테이블을 강제하지 않으나, 확장성을 위해 `User` 테이블을 두거나, 혹은 `Post`와 `Comment` 테이블에 직접 `author_id` 컬럼을 둔다.
  - **Decision**: `Post`와 `Comment` 테이블에 `authorId` (String/UUID) 컬럼을 직접 사용한다. (No User Table for MVP).

### 2.4 Security & Privacy
- **Persistence**: 브라우저 캐시/데이터 삭제 시 식별자와 모든 작성 권한이 영구 소실됨을 UI에 명시한다.
- **Validation**: 서버는 `X-User-ID` 헤더가 유효한 UUID 형식인지 검증한다.
- **Trust**: 클라이언트가 보낸 ID를 신뢰한다 (No Auth Token). 악의적인 사용자가 다른 ID를 스푸핑할 수 있으나, 익명 서비스 특성상 치명적이지 않음으로 간주한다. (단, UUID 추측은 어려움).

## 3. Implementation Plan

### 3.1 Frontend
- `lib/identity.ts`: UUID 생성 및 조회 유틸리티 함수.
- `hooks/useIdentity.ts`: React Hook to access/initialize ID.
- `lib/api.ts`: `axios` or `fetch` wrapper that automatically injects `X-User-ID`.

### 3.2 Backend (API Route / Server Action)
- `middleware.ts` or Utility function: Extract `X-User-ID` from request headers.
- **Validation**: Ensure `authorId` matches for Delete operations.

## 4. User Flows
1. **First Visit**:
   - Web app loads.
   - `useIdentity` checks storage -> Empty.
   - Generates 'uuid-1234'.
   - Saves to localStorage.
2. **Write Post**:
   - User inputs title/content.
   - Click Submit.
   - POST /api/posts with Body + Header `X-User-ID: uuid-1234`.
   - Server saves Post with `authorId: 'uuid-1234'`.
3. **Delete Post**:
   - User clicks Delete on Post #99.
   - Client sends DELETE /api/posts/99 with Header `X-User-ID: uuid-1234`.
   - Server checks: `Post.find(99).authorId === header.userId`.
   - If Match: Delete. Else: 403 Forbidden.
