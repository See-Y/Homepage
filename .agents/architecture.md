# 아키텍처

> 사이트의 물리적·논리적 구조를 정의합니다.
> 새 페이지/섹션을 추가하거나, 구조를 이해해야 할 때 이 문서를 참고합니다.

---

## 폴더 구조

```
Blog/
├── index.html                    ← 홈 (허브 페이지)
├── about/
│   └── index.html                ← 자기소개
├── now/
│   └── index.html                ← 근황 (Now 페이지)
├── studies/                      ← 공부 노트 (구 notes)
│   ├── index.html                ← 노트 인덱스
│   ├── cs/                       ← CS 기초 (OS, 아키텍처, 수학 등)
│   │   └── [slug]/index.html
│   ├── crypto/                   ← 보안 개론 및 암호학
│   │   └── [slug]/index.html
│   ├── network/                  ← 네트워크 보안
│   │   └── [slug]/index.html
│   ├── system/                   ← 시스템 해킹 및 하드웨어 보안
│   │   └── [slug]/index.html
│   ├── web/                      ← 웹 보안
│   │   └── [slug]/index.html
│   ├── fuzzing/                  ← 퍼징 / 프로그램 분석
│   │   └── [slug]/index.html
│   └── ctf/                      ← 워게임 및 실전 Write-up
│       └── [slug]/index.html
├── projects/
│   ├── index.html                ← 프로젝트 인덱스
│   └── [slug]/
│       └── index.html            ← 개별 프로젝트
├── travel/
│   ├── index.html                ← 여행 인덱스 (지도)
│   └── [slug]/
│       └── index.html            ← 개별 여행 포스트
├── assets/
│   ├── css/
│   │   ├── global.css            ← 전역 스타일 (CSS 변수, 리셋, 다크모드)
│   │   ├── components.css        ← 공통 컴포넌트 (카드, 배지, 버튼 등)
│   │   ├── home.css              ← 홈 전용
│   │   ├── about.css             ← About 전용
│   │   ├── studies.css           ← Studies 전용
│   │   ├── projects.css          ← Projects 전용
│   │   └── travel.css            ← Travel 전용
│   ├── js/
│   │   ├── main.js               ← 공통 JS (컴포넌트 로드, 테마, 모바일 메뉴)
│   │   ├── i18n.js               ← 다국어 처리
│   │   ├── search.js             ← Fuse.js 검색
│   │   └── travel-map.js         ← Leaflet 지도
│   └── img/                      ← 이미지 리소스
├── components/
│   ├── header.html               ← 공통 헤더
│   └── footer.html               ← 공통 푸터
├── data/
│   └── search-index.json         ← 검색 인덱스 (빌드 스크립트 생성)
├── scripts/
│   └── build-search-index.js     ← 검색 인덱스 생성 스크립트
├── tests/
│   ├── unit/                     ← Jest 유닛 테스트
│   │   ├── theme.test.js
│   │   ├── i18n.test.js
│   │   └── ...
│   └── e2e/                      ← Playwright E2E 테스트
│       ├── navigation.spec.js
│       └── ...
├── feed.xml                      ← RSS 피드
└── package.json                  ← 테스트 의존성 관리
```

---

## URL 라우팅

디렉토리 기반 라우팅. Cloudflare Pages는 `/about/` 요청 시 `/about/index.html`을 자동으로 서빙한다.

| URL | 파일 |
|-----|------|
| `/` | `index.html` |
| `/about` | `about/index.html` |
| `/now` | `now/index.html` |
| `/studies` | `studies/index.html` |
| `/studies/crypto/aes-explained` | `studies/crypto/aes-explained/index.html` |
| `/projects` | `projects/index.html` |
| `/projects/my-tool` | `projects/my-tool/index.html` |
| `/travel` | `travel/index.html` |
| `/travel/japan-2025` | `travel/japan-2025/index.html` |

---

## 공통 컴포넌트 로딩

### 방식: JS `fetch()` 동적 삽입

모든 HTML 페이지에는 헤더/푸터를 삽입할 빈 컨테이너가 있다:

```html
<body>
  <div id="header-placeholder"></div>
  
  <main>
    <!-- 페이지 콘텐츠 -->
  </main>
  
  <div id="footer-placeholder"></div>
  
  <script src="/assets/js/main.js"></script>
</body>
```

`main.js`가 로드되면:
1. `/components/header.html`과 `/components/footer.html`을 `fetch()`
2. 각각 `#header-placeholder`와 `#footer-placeholder`에 `innerHTML`로 삽입
3. 삽입 후 이벤트 리스너 바인딩 (테마 토글, 언어 토글, 모바일 메뉴)
4. i18n 적용

### FOUC(Flash of Unstyled Content) 방지

```html
<head>
  <script>
    // 페이지 렌더링 전에 테마 즉시 적용
    (function() {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
```

### 깜빡임 최소화

- 헤더/푸터 영역에 CSS로 `min-height`를 예약하여 레이아웃 시프트 방지
- 컴포넌트 로드 완료 후 `loaded` 클래스를 추가하여 페이드인 효과

---

## 새 콘텐츠 추가 절차

### 공부 노트 추가

1. `studies/[카테고리]/[slug]/index.html` 파일 생성
2. 기존 노트 템플릿 복사 후 내용 수정
3. 상단 메타데이터 작성 (제목, 카테고리, 난이도, 소요시간, 작성일, 태그)
4. `npm run build:search` 실행하여 검색 인덱스 업데이트
5. 필요 시 `feed.xml` 업데이트
6. 관련 노트에 Backlink 추가

### 프로젝트 추가

1. `projects/[slug]/index.html` 파일 생성
2. 프로젝트 템플릿 복사 후 3단 구조(문제/해결/결과) 작성
3. 기술 스택 배지, 상태 배지 설정
4. `npm run build:search` 실행

### 여행 포스트 추가

1. `travel/[slug]/index.html` 파일 생성
2. 여행 템플릿 복사 후 내용 작성
3. `travel-map.js`의 핀 데이터에 좌표 추가
4. `npm run build:search` 실행

---

## 페이지 공통 HTML 구조

모든 페이지는 아래 구조를 따른다:

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="페이지 설명">
  <title>페이지 제목 — 사이트명</title>
  
  <!-- FOUC 방지: 테마 즉시 적용 -->
  <script>
    (function() {
      const t = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  
  <!-- 폰트 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css" rel="stylesheet">
  
  <!-- 스타일 -->
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/[페이지].css">
</head>
<body>
  <div id="header-placeholder"></div>
  
  <main>
    <!-- 페이지별 콘텐츠 -->
  </main>
  
  <div id="footer-placeholder"></div>
  
  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```
