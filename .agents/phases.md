# 구현 단계 & 진행 상황

> 현재 뭘 하고 있고, 뭐가 남았는지 추적합니다.
> 작업을 시작/완료할 때마다 이 문서를 업데이트합니다.

---

## 진행 상황 요약

| Phase | 상태 | 설명 |
|-------|------|------|
| Phase 1 | ✅ 완료 | 전역 레이아웃 + 홈 + About + Now |
| Phase 2 | ✅ 완료 | Studies (공부 노트) |
| Phase 3 | ✅ 완료 | Projects |
| Phase 4 | ✅ 완료 | Travel (지도) |
| Phase 5 | ✅ 완료 | 전역 기능 (검색, RSS, Progress Bar, i18n 마무리) |

---

## Phase 1: 전역 레이아웃 + 홈 + About + Now

> **완료 기준**: 헤더/푸터가 모든 페이지에서 동적 로드되고, 다크모드·한영전환이 동작하며, 홈/About/Now 페이지가 반응형으로 렌더링된다. 모든 Phase 1 테스트 통과.

### 프로젝트 초기 세팅
- [x] `package.json` 생성 (Jest, Playwright 의존성)
- [x] `jest.config.js` 설정
- [x] `playwright.config.js` 설정
- [x] 테스트 폴더 구조 생성 (`tests/unit/`, `tests/e2e/`, `tests/fixtures/`)

### 1-1. 디자인 시스템
- [x] **테스트**: `theme.test.js` 작성 (T1-1 ~ T1-8)
- [x] `assets/css/global.css` — CSS 변수, 리셋, 다크모드
- [x] `assets/css/components.css` — 카드, 배지, 버튼 공통 스타일
- [x] 테스트 통과 확인

### 1-2. 공통 컴포넌트
- [x] **테스트**: `component-loader.test.js` 작성 (T3-1 ~ T3-6)
- [x] **테스트**: `mobile-menu.test.js` 작성 (T4-1 ~ T4-6)
- [x] **테스트**: `i18n.test.js` 작성 (T2-1 ~ T2-11)
- [x] `components/header.html` — 헤더 HTML
- [x] `components/footer.html` — 푸터 HTML
- [x] `assets/js/main.js` — 컴포넌트 로드, 테마 토글, 모바일 메뉴
- [x] `assets/js/i18n.js` — 다국어 처리
- [x] 테스트 통과 확인

### 1-3. 홈 페이지
- [x] `index.html` — 히어로 + 섹션 카드 + 검색 UI
- [x] `assets/css/home.css` — 홈 전용 스타일

### 1-4. About 페이지
- [x] `about/index.html` — 소개 + 스킬 + 타임라인 + PGP
- [x] `assets/css/about.css` — About 전용 스타일

### 1-5. Now 페이지
- [x] `now/index.html` — 근황 페이지
- [x] (Now 전용 CSS는 global+components로 충분하면 생략)

### 1-6. E2E 테스트
- [x] `navigation.spec.js` 작성 (E1-1 ~ E1-4)
- [x] `theme-toggle.spec.js` 작성 (E2-1 ~ E2-3)
- [x] `i18n-toggle.spec.js` 작성 (E3-1 ~ E3-4)
- [x] `responsive.spec.js` 작성 (E4-1 ~ E4-4)
- [x] 모든 E2E 테스트 통과 확인

### 1-7. 마무리
- [x] 로고 / 파비콘 생성 및 적용
- [x] 전체 페이지 시각 검수
- [x] Phase 1 완료 표시

---

## Phase 2: Studies (공부 노트)

> **완료 기준**: 노트 인덱스에서 카테고리/태그 필터링이 동작하고, 개별 노트 템플릿이 완성되며, Reading Progress Bar가 동작한다. 모든 Phase 2 테스트 통과.

### 2-1. Studies 인덱스
- [x] **테스트**: `filter.test.js` 작성 (T5-1 ~ T5-6)
- [x] `studies/index.html` — 인덱스 페이지
- [x] `assets/css/studies.css` — Studies 전용 스타일
- [x] 카테고리 필터 바 구현
- [x] 태그 필터링 구현
- [x] 빈 상태 메시지 ("아직 노트가 없습니다")
- [x] 테스트 통과 확인

### 2-2. 개별 노트 템플릿
- [x] **테스트**: `progress-bar.test.js` 작성 (T6-1 ~ T6-5)
- [x] 노트 템플릿 HTML 작성
- [x] TL;DR 요약 박스
- [x] Backlink 섹션
- [x] GitHub 편집 링크
- [x] Reading Progress Bar
- [x] 테스트 통과 확인

### 2-3. 카테고리 폴더 생성
- [x] `studies/crypto/` 디렉토리
- [x] `studies/network/` 디렉토리
- [x] `studies/system/` 디렉토리
- [x] `studies/web/` 디렉토리
- [x] `studies/fuzzing/` 디렉토리

### 2-4. 마무리
- [x] i18n 텍스트 추가 (Studies 관련)
- [x] Phase 2 완료 표시

---

## Phase 3: Projects

> **완료 기준**: 프로젝트 인덱스와 개별 프로젝트 템플릿이 완성되고, 상태 배지가 올바르게 표시된다.

- [x] `projects/index.html` — 인덱스 페이지
- [x] `assets/css/projects.css` — Projects 전용 스타일
- [x] 프로젝트 카드 그리드 (기술 스택 배지, 상태 배지)
- [x] 개별 프로젝트 템플릿 (3단 구조: 문제/해결/결과)
- [x] 빈 상태 메시지 ("아직 프로젝트가 없습니다")
- [x] **E2E 테스트** (E5-1 ~ E5-3)
- [x] i18n 텍스트 추가 (Projects 관련)
- [x] Phase 3 완료 표시

---

## Phase 4: Travel

> **완료 기준**: Leaflet 지도에 핀이 표시되고 클릭 시 여행 포스트로 이동하며, 사진 갤러리가 동작한다.

- [x] **테스트**: `travel-map.test.js` 작성 (T7-1 ~ T7-4)
- [x] `travel/index.html` — 인덱스 (지도 + 카드 목록)
- [x] `assets/css/travel.css` — Travel 전용 스타일
- [x] `assets/js/travel-map.js` — Leaflet 지도 로직
- [x] 샘플 핀 1~2개 (데모용)
- [x] 개별 여행 템플릿 (사진 갤러리 + YouTube 임베드)
- [x] 빈 상태 메시지 ("아직 여행 기록이 없습니다")
- [x] i18n 텍스트 추가 (Travel 관련)
- [x] 테스트 통과 확인
- [x] Phase 4 완료 표시

---

## Phase 5: 전역 기능 완성

> **완료 기준**: 검색이 동작하고, RSS 피드가 유효하며, 한/영 전환에 누락이 없다.

### 5-1. 전체 검색
- [x] **테스트**: `search.test.js` 작성 (T8-1 ~ T8-11)
- [x] `scripts/build-search-index.js` — 빌드 스크립트
- [x] `assets/js/search.js` — Fuse.js를 이용한 전역 검색 로직
- [x] 검색창 UI 및 모달 연동
- [x] 스크립트를 통한 검색 데이터(`search-index.json`) 자동 생성 로직 (빌드 시나리오)

### 5-2. RSS 피드
- [x] `feed.xml` 기본 틀 생성
- [x] 전역 RSS 피드(`rss.xml`) 생성 스크립트 작성

### 5-3. 한/영 전환 마무리
- [x] 모든 페이지 `data-i18n` 속성 점검
- [x] 누락 번역 텍스트 보완
- [x] E2E 전체 흐름 재검증

### 5-4. 최종 검수
- [ ] 크로스 브라우저 확인 (Chrome, Firefox, Safari)
- [ ] Cloudflare Pages 배포 테스트
- [ ] Phase 5 완료 표시

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-20 | 초기 계획 수립. 모든 Phase 미착수 상태. |
| 2026-06-20 | Phase 1 전체 구현 완료 (유닛 테스트 & E2E 테스트 100% 통과). |
| 2026-06-20 | Phase 2 Studies 구현 완료 (클라이언트 사이드 마크다운 적용). |
| 2026-06-20 | Phase 3 Projects 구현 완료. |
| 2026-06-20 | Phase 4 Travel 구현 완료 (Leaflet 지도 적용). |
| 2026-06-20 | Phase 5 전역 검색 및 RSS 구현 완료 (모든 Phase 완료). |
