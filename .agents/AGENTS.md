# Blog 프로젝트 — 에이전트 가이드

> 이 문서는 프로젝트에 참여하는 모든 사람/에이전트가 **가장 먼저** 읽어야 하는 진입점입니다.

---

## 프로젝트 개요

개인 포트폴리오 겸 기술 블로그 웹사이트.
보안/CS 공부 노트, 프로젝트 쇼케이스, 여행 기록을 하나의 도메인에서 운영한다.

---

## 동시 작업 시 주의사항 (여러 사람 / 여러 AI 에이전트)

이 저장소는 **한 사람만 작업하는 게 아니다.** 팀원과 여러 AI 에이전트가 각자 다른 스터디 카테고리(crypto, finance 등)나 섹션을 동시에 건드릴 수 있다. `decisions.md`의 항목이 실제 코드와 안 맞는 상태로 발견되는 사고가 이미 있었는데, 대부분 "누가 뭘 바꿨는지 서로 몰라서" 생긴 문제였다. 아래 규칙을 지킨다.

1. **작업 시작 전, 반드시 [progress.md](progress.md)를 먼저 확인한다.** 내가 건드리려는 폴더/파일에 이미 담당자가 있는지 본다.
2. **작업에 착수하면 progress.md에 내 항목을 추가/갱신한다.** 작업을 마치면 상태를 업데이트한다. (자세한 사용법은 progress.md 상단 참고)
3. **다른 담당자의 경로(예: 다른 사람이 작업 중인 `studies/crypto/**`)는 건드리지 않는다.** 공용 파일(`studies/index.html`, `assets/css/components.css`, `assets/data/search-index.json`)을 고칠 때는 전체를 갈아엎지 말고 **내 카테고리에 해당하는 블록만** 수정한다.
4. **카테고리마다 뱃지 색상 등 시각적 구분을 둘 수 있다.** 단, 임의로 색을 고르지 말고 [styles.md](styles.md)의 "카테고리별 액센트 컬러" 표에 먼저 등록한 뒤 사용한다. 전역 테마(우드&베이지, 라이트/다크)는 사이트 전체 공통이며, 카테고리별로 달라지는 건 오직 그 표에 등록된 뱃지 액센트 컬러뿐이다.
5. **진행 상황 기록은 decisions.md가 아니라 progress.md에 남긴다.** decisions.md는 "논의를 거쳐 확정된 결정"만 들어가는 영구 기록이고, "지금 어디까지 했다"는 진행 상황은 별도 문서(progress.md)의 몫이다. 새 라이브러리 도입처럼 진짜 "결정"이 필요한 사안만 decisions.md에 남긴다.

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 언어 | 순수 HTML / CSS / JavaScript (프레임워크 없음) |
| 호스팅 | Cloudflare Pages |
| 도메인 | `이름.pages.dev` (무료 서브도메인) |
| 저장소 | GitHub |
| 배포 | `git push` → Cloudflare Pages 자동 배포 |
| 테스트 | Jest (유닛) + Playwright (E2E) |

---

## 코딩 컨벤션

### 파일 네이밍
- HTML 파일: `index.html` (디렉토리 기반 라우팅)
- CSS 파일: `케밥-케이스.css` (예: `global.css`, `components.css`)
- JS 파일: `케밥-케이스.js` (예: `main.js`, `i18n.js`)
- 이미지: `케밥-케이스.확장자` (예: `hero-bg.webp`)

### HTML
- 시맨틱 태그 적극 사용 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- 모든 인터랙티브 요소에 고유 `id` 부여
- 다국어 대상 텍스트에 `data-i18n="키"` 속성 필수
- 접근성: `alt`, `aria-label` 등 적절히 사용

### CSS
- CSS 변수(`--var-name`)를 통한 디자인 토큰 관리 → 상세는 [styles.md](styles.md) 참고
- BEM 네이밍은 사용하지 않음. 간결한 클래스명 사용
- 미디어 쿼리 브레이크포인트: `768px` (모바일/데스크톱)

### JavaScript
- ES6+ 문법 사용 (const/let, 화살표 함수, 템플릿 리터럴, async/await)
- `var` 사용 금지
- 전역 변수 최소화, 모듈 패턴 또는 즉시 실행 함수(IIFE) 사용
- DOM 조작은 `querySelector` / `querySelectorAll` 사용

### 커밋 메시지
```
[Phase N] 타입: 설명

예시:
[Phase 1] feat: 다크모드 토글 구현
[Phase 1] test: 다크모드 localStorage 저장 테스트 추가
[Phase 2] fix: 노트 카드 반응형 레이아웃 수정
```

---

## TDD 원칙

> **반드시 테스트를 먼저 작성하고, 그 다음 구현한다.**

1. **Red**: 실패하는 테스트를 먼저 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 정리 (테스트는 계속 통과해야 함)

- 유닛 테스트뿐 아니라 **엣지 케이스**까지 꼼꼼히 작성
- 테스트 구조, 위치, 실행 방법 → [testing.md](testing.md) 참고

---

## 문서 참조 맵

| 관심사 | 문서 |
|--------|------|
| 확정된 결정사항 & 이유 | [decisions.md](decisions.md) |
| **지금 누가 뭘 작업 중인지 (충돌 방지)** | **[progress.md](progress.md)** |
| 폴더 구조, 라우팅, 컴포넌트 로딩 | [architecture.md](architecture.md) |
| 외부 라이브러리 및 플러그인 | [plugins.md](plugins.md) |
| 색상, 폰트, 간격, 다크모드 | [styles.md](styles.md) |
| 한/영 전환, 번역 규칙 | [i18n.md](i18n.md) |
| TDD 전략, 테스트 목록 | [testing.md](testing.md) |
| 구현 단계 & 진행 상황 | [phases.md](phases.md) (부재 시 progress.md로 대체) |

---

## 제약 조건

- Cloudflare Pages 무료 제한: 파일 1개 최대 25MB, 사이트당 파일 최대 20,000개
- 서버사이드 로직 없음 → 검색, 필터, 언어 전환 모두 클라이언트 JS
- 동영상 직접 업로드 금지 → YouTube 임베드만 사용
