# TDD & 테스트 전략

> 모든 테스트의 구조, 위치, 실행 방법을 정의합니다.
> 새 기능을 구현하기 전, 반드시 이 문서를 참고하여 테스트를 먼저 작성합니다.

---

## TDD 워크플로우

```
1. Red    → 실패하는 테스트를 먼저 작성
2. Green  → 테스트를 통과하는 최소한의 코드 작성
3. Refactor → 코드 정리 (테스트는 계속 통과해야 함)
```

**원칙**:
- 구현 전에 테스트가 먼저 존재해야 한다
- 유닛 테스트뿐 아니라 **엣지 케이스**까지 꼼꼼히 작성
- 테스트가 없는 코드는 완성된 코드가 아니다

---

## 테스트 도구

| 종류 | 도구 | 용도 |
|------|------|------|
| 유닛 테스트 | **Jest** + jsdom | JS 모듈 단위 테스트 (DOM 시뮬레이션) |
| E2E 테스트 | **Playwright** | 브라우저에서 실제 페이지 동작 테스트 |
| 커버리지 | Jest `--coverage` | 코드 커버리지 측정 |

---

## 테스트 파일 구조

```
Blog/
├── tests/
│   ├── unit/                         ← Jest 유닛 테스트
│   │   ├── theme.test.js             ← 다크/라이트 모드
│   │   ├── i18n.test.js              ← 다국어 전환
│   │   ├── component-loader.test.js  ← 헤더/푸터 동적 로드
│   │   ├── mobile-menu.test.js       ← 모바일 메뉴
│   │   ├── search.test.js            ← Fuse.js 검색
│   │   ├── filter.test.js            ← 카테고리/태그 필터링
│   │   ├── progress-bar.test.js      ← Reading Progress Bar
│   │   └── travel-map.test.js        ← 지도 핀 데이터
│   ├── e2e/                          ← Playwright E2E 테스트
│   │   ├── navigation.spec.js        ← 페이지 간 이동
│   │   ├── theme-toggle.spec.js      ← 다크모드 전환 + 유지
│   │   ├── i18n-toggle.spec.js       ← 한/영 전환 전체 흐름
│   │   ├── responsive.spec.js        ← 반응형 레이아웃
│   │   ├── search.spec.js            ← 검색 기능 전체 흐름
│   │   └── accessibility.spec.js     ← 접근성 검사
│   └── fixtures/                     ← 테스트용 더미 데이터
│       ├── sample-notes.json
│       └── sample-search-index.json
├── jest.config.js
├── playwright.config.js
└── package.json
```

### 네이밍 규칙
- 유닛 테스트: `[모듈명].test.js`
- E2E 테스트: `[기능명].spec.js`
- 테스트 설명: 한국어로 작성 (가독성 우선)

---

## 실행 명령어

```bash
# 유닛 테스트 전체 실행
npm test

# 유닛 테스트 특정 파일
npm test -- theme.test.js

# 유닛 테스트 + 커버리지
npm run test:coverage

# E2E 테스트 전체 실행
npm run test:e2e

# E2E 테스트 특정 파일
npx playwright test navigation.spec.js

# 전체 테스트 (유닛 + E2E)
npm run test:all
```

---

## Phase별 테스트 목록

### Phase 1: 전역 레이아웃 + 홈 + About

#### 유닛: `theme.test.js` — 다크/라이트 모드

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T1-1 | 기본 테마가 light인지 확인 | |
| T1-2 | 토글 클릭 시 dark로 전환 | |
| T1-3 | 다시 클릭 시 light로 복원 | |
| T1-4 | 전환 시 localStorage에 저장 | |
| T1-5 | 페이지 로드 시 localStorage 값 복원 | |
| T1-6 | localStorage가 비어있을 때 기본값 light | localStorage 손상/삭제 시 |
| T1-7 | localStorage에 잘못된 값이 있을 때 기본값 fallback | `theme: "invalid"` |
| T1-8 | `data-theme` 속성이 `<html>`에 정확히 적용 | |

#### 유닛: `i18n.test.js` — 다국어 전환

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T2-1 | 기본 언어가 ko인지 확인 | |
| T2-2 | 토글 시 en으로 전환 | |
| T2-3 | `data-i18n` 속성의 텍스트가 교체됨 | |
| T2-4 | `data-i18n-attr` 속성값(placeholder 등) 교체 | |
| T2-5 | URL 파라미터 `?lang=en` 감지 | |
| T2-6 | localStorage에 언어 저장 | |
| T2-7 | URL 파라미터가 localStorage보다 우선 | URL=en, localStorage=ko |
| T2-8 | 존재하지 않는 i18n 키 처리 | 키가 맵에 없을 때 원본 유지 |
| T2-9 | 지원하지 않는 언어 코드 처리 | `?lang=fr` |
| T2-10 | `<html lang="">` 속성이 함께 변경됨 | |
| T2-11 | 동적으로 추가된 요소에도 i18n 적용 | 헤더/푸터 fetch 후 |

#### 유닛: `component-loader.test.js` — 헤더/푸터 로드

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T3-1 | header.html을 fetch하여 placeholder에 삽입 | |
| T3-2 | footer.html을 fetch하여 placeholder에 삽입 | |
| T3-3 | 삽입 후 이벤트 리스너 바인딩 | |
| T3-4 | fetch 실패 시 에러 처리 | 404, 네트워크 에러 |
| T3-5 | placeholder가 없을 때 에러 없이 무시 | |
| T3-6 | 중복 로드 방지 | 이미 로드된 상태에서 다시 호출 |

#### 유닛: `mobile-menu.test.js` — 모바일 메뉴

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T4-1 | 햄버거 버튼 클릭 시 메뉴 열림 | |
| T4-2 | 다시 클릭 시 메뉴 닫힘 | |
| T4-3 | 메뉴 외부 클릭 시 닫힘 | |
| T4-4 | 메뉴 링크 클릭 시 닫힘 | |
| T4-5 | ESC 키로 닫힘 | |
| T4-6 | 데스크톱 크기에서는 햄버거 숨김 | |

#### E2E: `navigation.spec.js`

| # | 테스트 |
|---|--------|
| E1-1 | 홈에서 모든 섹션 링크 클릭 → 올바른 페이지 이동 |
| E1-2 | 헤더 네비게이션 모든 링크 동작 확인 |
| E1-3 | 현재 페이지에 해당하는 네비게이션 항목 활성 표시 |
| E1-4 | 뒤로가기 동작 확인 |

#### E2E: `theme-toggle.spec.js`

| # | 테스트 |
|---|--------|
| E2-1 | 다크모드 토글 후 페이지 새로고침 → 다크모드 유지 |
| E2-2 | 다른 페이지로 이동해도 다크모드 유지 |
| E2-3 | 다크모드에서 모든 텍스트 가독성 확인 (contrast ratio) |

#### E2E: `i18n-toggle.spec.js`

| # | 테스트 |
|---|--------|
| E3-1 | 영어 전환 후 헤더/푸터/페이지 텍스트 모두 영어 |
| E3-2 | 영어 전환 후 페이지 이동 → 영어 유지 |
| E3-3 | URL에 `?lang=en` 직접 입력 → 영어로 표시 |
| E3-4 | 새로고침 후에도 언어 설정 유지 |

#### E2E: `responsive.spec.js`

| # | 테스트 |
|---|--------|
| E4-1 | 모바일(375px)에서 햄버거 메뉴 표시 |
| E4-2 | 데스크톱(1280px)에서 풀 네비게이션 표시 |
| E4-3 | 카드 그리드 반응형 레이아웃 전환 |
| E4-4 | 텍스트 오버플로우 없음 확인 |

---

### Phase 2: Studies

#### 유닛: `filter.test.js`

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T5-1 | '전체' 필터 선택 시 모든 카드 표시 | |
| T5-2 | 카테고리 필터 선택 시 해당 카드만 표시 | |
| T5-3 | 태그 필터 적용 | |
| T5-4 | 카테고리 + 태그 복합 필터 | |
| T5-5 | 필터 결과가 0개일 때 빈 상태 메시지 | |
| T5-6 | 필터 해제 시 전체 복원 | |

#### 유닛: `progress-bar.test.js`

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T6-1 | 페이지 최상단에서 진행률 0% | |
| T6-2 | 페이지 최하단에서 진행률 100% | |
| T6-3 | 스크롤 중간에서 비례 진행률 | |
| T6-4 | 페이지 높이가 뷰포트보다 작을 때 | 스크롤 불가능한 짧은 페이지 |
| T6-5 | 동적 콘텐츠로 높이 변경 시 재계산 | |

---

### Phase 3: Projects

> 별도의 복잡한 JS 로직이 적으므로, E2E 테스트 위주로 진행.

| # | 테스트 |
|---|--------|
| E5-1 | 프로젝트 카드 그리드 렌더링 |
| E5-2 | 상태 배지(완료/진행중/중단) 올바르게 표시 |
| E5-3 | 개별 프로젝트 페이지 3단 구조 렌더링 |

---

### Phase 4: Travel

#### 유닛: `travel-map.test.js`

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T7-1 | 핀 데이터가 올바르게 로드됨 | |
| T7-2 | 핀 클릭 시 팝업에 여행 정보 표시 | |
| T7-3 | 핀 데이터가 비어있을 때 처리 | |
| T7-4 | 잘못된 좌표 데이터 처리 | 위도/경도 범위 초과 |

---

### Phase 5: 전역 기능

#### 유닛: `search.test.js`

| # | 테스트 | 엣지 케이스 |
|---|--------|------------|
| T8-1 | 검색어 입력 시 매칭 결과 반환 | |
| T8-2 | 부분 일치 (fuzzy) 검색 동작 | |
| T8-3 | 검색 결과 0개 시 빈 상태 메시지 | |
| T8-4 | 빈 검색어 처리 | |
| T8-5 | 특수문자 검색어 처리 | `<script>`, `"`, `'` |
| T8-6 | 한글 검색 동작 | |
| T8-7 | 영문 검색 동작 | |
| T8-8 | 검색 인덱스 파일 로드 실패 시 처리 | |
| T8-9 | Ctrl+K 단축키로 검색 모달 열기 | |
| T8-10 | ESC로 검색 모달 닫기 | |
| T8-11 | 검색 결과 클릭 시 해당 페이지 이동 | |

---

## 테스트 작성 가이드

### 유닛 테스트 템플릿

```javascript
/**
 * @file theme.test.js
 * @description 다크/라이트 모드 전환 테스트
 * @phase Phase 1
 */

describe('테마 전환', () => {
  beforeEach(() => {
    // DOM 초기화
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  describe('기본 동작', () => {
    test('기본 테마가 light이다', () => {
      // ...
    });

    test('토글 클릭 시 dark로 전환된다', () => {
      // ...
    });
  });

  describe('엣지 케이스', () => {
    test('localStorage에 잘못된 값이 있으면 light로 fallback', () => {
      localStorage.setItem('theme', 'invalid');
      // ...
    });
  });
});
```

### E2E 테스트 템플릿

```javascript
/**
 * @file navigation.spec.js
 * @description 페이지 간 이동 E2E 테스트
 * @phase Phase 1
 */

const { test, expect } = require('@playwright/test');

test.describe('네비게이션', () => {
  test('홈에서 About 링크 클릭 시 About 페이지로 이동', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

## 테스트 추가 시 절차

1. 이 문서의 해당 Phase 테스트 목록에 새 항목 추가
2. 테스트 코드 작성 (Red)
3. 구현 코드 작성 (Green)
4. 리팩토링 (Refactor)
5. 전체 테스트 실행하여 기존 테스트 깨지지 않음 확인
