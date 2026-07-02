# 디자인 시스템 (Styles)

> 시각적 요소의 **단일 진실 원천(Single Source of Truth)**.
> 색상, 폰트, 간격, 컴포넌트 스타일을 변경할 때 이 문서를 먼저 수정하고, `global.css`와 `components.css`에 반영합니다.

---

## 디자인 톤

**모던 내추럴 (Wood & Beige)** — 다양한 주제(보안, CS, 여행)를 포괄하는 따뜻하고 편안한 디자인.
특정 분야에 치우치지 않으며, 우드톤/베이지 그라데이션으로 감성적이고 부드러운 느낌을 표현한다.

---

## 컬러 팔레트

### 라이트 모드

| 토큰 | 값 | 용도 |
|------|----|------|
| `--color-bg-primary` | `#FAF7F2` | 가장 밝은 따뜻한 크림 배경 |
| `--color-bg-secondary` | `#F3EBE1` | 카드, 섹션 라이트 베이지 배경 |
| `--color-bg-tertiary` | `#E8DCCB` | 인풋, 코드 블록 오트밀 베이지 배경 |
| `--color-text-primary` | `#3E2723` | 다크 브라운(에스프레소) 본문 텍스트 |
| `--color-text-secondary` | `#5D4037` | 초콜릿 보조 텍스트, 날짜 |
| `--color-text-muted` | `#94A3B8` | 비활성 텍스트 |
| `--color-accent-primary` | `#B8860B` | 주요 포인트 (다크 골든로드/우드) |
| `--color-accent-secondary` | `#8B5A2B` | 보조 포인트 (오크 브라운) |
| `--color-accent-gradient` | `linear-gradient(135deg, #C19A6B, #8B5A2B)` | 우드톤 그라데이션 포인트 |
| `--color-border` | `#D6C5B3` | 부드러운 베이지 보더, 구분선 |
| `--color-border-hover` | `#C19A6B` | 호버 시 짙은 베이지 보더 |
| `--color-success` | `#10B981` | 완료 상태 |
| `--color-warning` | `#F59E0B` | 진행 중 상태 |
| `--color-error` | `#EF4444` | 중단, 에러 |

### 다크 모드

| 토큰 | 값 | 용도 |
|------|----|------|
| `--color-bg-primary` | `#2A211D` | 다크 초코 웜톤 배경 |
| `--color-bg-secondary` | `#3A2E28` | 카드, 섹션 다크 오크 배경 |
| `--color-bg-tertiary` | `#4E4039` | 인풋, 미디엄 다크 우드 배경 |
| `--color-text-primary` | `#F4EEE8` | 웜 화이트 본문 텍스트 |
| `--color-text-secondary` | `#D7CCC8` | 라이트 크림 보조 텍스트 |
| `--color-text-muted` | `#94A3B8` | 비활성 텍스트 |
| `--color-accent-primary` | `#D4A373` | 카멜/라이트 우드 주요 포인트 |
| `--color-accent-secondary` | `#E6CCB2` | 샌드 베이지 보조 포인트 |
| `--color-accent-gradient` | `linear-gradient(135deg, #E6CCB2, #D4A373)` | 샌드 베이지 그라데이션 포인트 |
| `--color-border` | `#5A4B42` | 어두운 브라운 보더 |
| `--color-border-hover` | `#D4A373` | 호버 시 라이트 우드 보더 |
| `--color-success` | `#34D399` | 완료 상태 |
| `--color-warning` | `#FBBF24` | 진행 중 상태 |
| `--color-error` | `#F87171` | 중단, 에러 |

---

## 카테고리별 액센트 컬러 (뱃지)

> **여러 사람/에이전트가 서로 다른 스터디 카테고리를 동시에 작업하기 때문에 만든 표입니다.**
> 전역 테마(위 컬러 팔레트, 우드&베이지 / 라이트·다크)는 사이트 전체에 고정 적용됩니다. **카테고리마다 달라도 되는 건 오직 아래 뱃지 액센트 컬러뿐**입니다. 새 스터디 카테고리를 추가할 때는 반드시 이 표에 먼저 행을 등록하고, 기존 색과 겹치지 않는 색을 골라 `components.css`에 `badge--{category}` 규칙을 추가하세요. (컬러는 대략 60°씩 hue를 벌려서 겹치지 않게 골랐습니다.)

| 카테고리 (`data-category`) | 라벨 | 라이트 모드 색상 | 다크 모드 색상 | 담당 경로 | 담당 |
|---|---|---|---|---|---|
| `crypto` | Crypto | `#7C3AED` (보라) | `#A78BFA` | `studies/crypto/**` | 팀원 (별도 담당) |
| `network` | Network | `#0891B2` (청록) | `#22D3EE` | `studies/network/**` | 미착수 |
| `system` | System | `#DC2626` (빨강) | `#F87171` | `studies/system/**` | 미착수 |
| `web` | Web Security | `#059669` (초록) | `#34D399` | `studies/web/**` | 미착수 |
| `fuzzing` | Fuzzing | `#D97706` (주황) | `#FBBF24` | `studies/fuzzing/**` | 미착수 |
| `finance` | Finance | `#2563EB` (파랑) | `#60A5FA` | `studies/finance/**` | Claude (AI 에이전트) — [progress.md](progress.md) 참고 |

CS 계열(crypto/network/system/web/fuzzing)과 성격이 다른 카테고리(finance 등)를 추가할 때, **디자인 톤(우드&베이지) 자체를 바꿀 필요는 없습니다.** 배경/폰트/카드 스타일은 그대로 재사용하고, 뱃지 색상 하나로만 "이 노트는 어떤 분야다"를 구분하면 충분합니다 — 오히려 페이지마다 톤이 달라지면 사이트 전체의 일관성이 깨집니다.

---

## 폰트

| 용도 | 폰트 | 굵기 | 소스 |
|------|-------|------|------|
| 한글 본문 | **Pretendard** | 300, 400, 500, 600, 700 | CDN (jsdelivr) |
| 영문 본문 | **Inter** | 300, 400, 500, 600, 700 | Google Fonts |
| 코드 | **JetBrains Mono** | 400, 500 | Google Fonts |

### 폰트 스택

```css
--font-sans: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### 폰트 변경 시 체크리스트
1. 이 문서의 폰트 테이블 수정
2. `global.css`의 `--font-sans` 또는 `--font-mono` 변수 수정
3. HTML `<head>`의 폰트 CDN 링크 수정 (architecture.md의 공통 HTML 구조 참고)
4. 필요 시 굵기(weight) 변수 조정

---

## 타이포그래피 스케일

| 토큰 | 사이즈 | 행간(line-height) | 용도 |
|------|--------|-------------------|------|
| `--text-xs` | `0.75rem` (12px) | 1.5 | 배지, 캡션 |
| `--text-sm` | `0.875rem` (14px) | 1.5 | 보조 텍스트 |
| `--text-base` | `1rem` (16px) | 1.75 | 본문 |
| `--text-lg` | `1.125rem` (18px) | 1.75 | 큰 본문 |
| `--text-xl` | `1.25rem` (20px) | 1.5 | 서브 헤딩 |
| `--text-2xl` | `1.5rem` (24px) | 1.4 | 섹션 제목 |
| `--text-3xl` | `1.875rem` (30px) | 1.3 | 페이지 제목 |
| `--text-4xl` | `2.25rem` (36px) | 1.2 | 히어로 타이틀 |

---

## 간격 시스템 (Spacing)

4px 기반 배수 시스템:

| 토큰 | 값 |
|------|----|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-12` | `3rem` (48px) |
| `--space-16` | `4rem` (64px) |
| `--space-20` | `5rem` (80px) |

---

## 그림자 (Shadow)

| 토큰 | 값 | 용도 |
|------|----|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 미세한 깊이 |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | 카드 |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | 모달, 드롭다운 |
| `--shadow-glow` | `0 0 20px rgba(184, 134, 11, 0.15)` | 포인트 글로우 효과 |

다크 모드에서는 그림자 대신 보더 강조로 깊이를 표현한다.

---

## 라운딩 (Border Radius)

| 토큰 | 값 | 용도 |
|------|----|------|
| `--radius-sm` | `0.375rem` (6px) | 배지, 작은 요소 |
| `--radius-md` | `0.5rem` (8px) | 버튼, 인풋 |
| `--radius-lg` | `0.75rem` (12px) | 카드 |
| `--radius-xl` | `1rem` (16px) | 큰 카드, 모달 |
| `--radius-full` | `9999px` | 원형 (아바타, 토글) |

---

## 트랜지션

| 토큰 | 값 | 용도 |
|------|----|------|
| `--transition-fast` | `150ms ease` | 호버 효과, 토글 |
| `--transition-base` | `250ms ease` | 일반 애니메이션 |
| `--transition-slow` | `350ms ease` | 페이지 전환, 모달 |
| `--transition-theme` | `300ms ease` | 다크/라이트 모드 전환 |

---

## 레이아웃

| 토큰 | 값 | 용도 |
|------|----|------|
| `--max-width` | `1200px` | 콘텐츠 최대 너비 |
| `--max-width-narrow` | `768px` | 글 읽기 최대 너비 |
| `--header-height` | `64px` | 헤더 높이 |
| `--footer-height` | `200px` | 푸터 최소 높이 |

### 반응형 브레이크포인트

| 이름 | 값 | 기준 |
|------|----|------|
| 모바일 | `< 768px` | 햄버거 메뉴, 1열 레이아웃 |
| 데스크톱 | `≥ 768px` | 풀 네비게이션, 다열 그리드 |

---

## 컴포넌트 스타일 명세

### 카드

```
배경: --color-bg-secondary
보더: 1px solid --color-border
라운딩: --radius-lg
그림자: --shadow-md
패딩: --space-6
호버: 보더 → --color-accent-primary, 그림자 → --shadow-lg, translateY(-2px)
트랜지션: --transition-base
```

### 배지 (카테고리, 기술 스택, 상태)

```
배경: --color-accent-primary (10% opacity)
텍스트: --color-accent-primary
폰트: --text-xs, font-weight 500
패딩: --space-1 --space-3
라운딩: --radius-full
```

상태 배지 색상:
- 완료: `--color-success`
- 진행 중: `--color-warning`
- 중단: `--color-error`

### 버튼

```
Primary: 배경 --color-accent-gradient, 텍스트 white, 라운딩 --radius-md
Secondary: 배경 transparent, 보더 --color-border, 텍스트 --color-text-primary
호버: 밝기 조정 + 살짝 scale(1.02)
패딩: --space-3 --space-6
```

### 난이도 표시 (★)

```
5단계: ★★★★★
채워진 별: --color-warning (#F59E0B)
빈 별: --color-text-muted
폰트사이즈: --text-sm
```

### TL;DR 요약 박스

```
배경: --color-accent-primary (5% opacity)
좌측 보더: 3px solid --color-accent-primary
패딩: --space-6
라운딩: --radius-md
```
