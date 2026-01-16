# 구현을 위한 5가지 핵심 스펙 추천 (Recommendations for Specification)

프로젝트 구현을 시작하기 전, 다음 5가지 항목을 구체적으로 정의하면 개발 효율성을 높이고 재작업을 최소화할 수 있습니다.

## 1. 기술 스택 및 환경 상세 확정 (Tech Stack & Environment Spec)
"AI가 자유롭게 선택"하기보다는, 팀이나 프로젝트의 기준을 명확히 하는 것이 좋습니다.
- **Database**: SQLite (로컬 개발 용이) vs Supabase (배포 및 관리 용이).
- **ORM**: Prisma 사용 여부 및 버전.
- **Package Manager**: npm, pnpm, yarn 중 택 1.
- **Hosting**: Vercel 배포 여부.

## 2. 데이터 모델링 상세 (Data Model & Schema)
개념적인 모델링을 넘어, 실제 DB 스키마 수준의 정의가 필요합니다.
- **테이블 정의**: `User`(Optional), `Post`, `Comment`, `Like`.
- **필드 상세**: 타입(String, Int, UUID), 제약조건(Unique, Nullable), Default 값.
- **관계(Relations)**: Post와 Comment의 1:N 관계, 삭제 시 동작(Cascade Delete) 등.

## 3. API 인터페이스 및 서버 액션 정의 (API & Server Actions Interface)
프론트엔드와 백엔드 간의 통신 규약을 미리 정의합니다.
- **통신 방식**: Next.js Server Actions 사용 vs Route Handlers (API Routes) 사용.
- **함수 시그니처**: `createPost(data: PostInput): Promise<PostResult>`
- **에러 처리**: 클라이언트에 전달할 에러 코드 및 메시지 형식.

## 4. 디자인 시스템 토큰 (Design System Tokens)
UI의 일관성을 위해 다크 모드에 맞는 구체적인 값을 지정합니다.
- **Color Palette**: Primary(초록색)의 구체적 Hex Code (예: `#22C55E`), Background, Surface, Text(Primary/Secondary/Tertiary).
- **Typography**: Font Family, Size, Weight, Line-height 스케일.
- **Spacing & Radius**: 여백 및 모서리 둥글기 규칙.

## 5. 프로젝트 구조 및 컨벤션 (Project Structure & Convention)
파일 위치와 코드 작성 규칙을 통일합니다.
- **디렉토리 구조**: `src/app` 사용 여부, 컴포넌트 위치(`components/ui`, `components/feature`), 유틸리티 위치.
- **네이밍 규칙**: 파일명(kebab-case), 컴포넌트명(PascalCase) 등.
- **공통 컴포넌트**: 버튼, 인풋, 카드 등 재사용 컴포넌트 목록.
