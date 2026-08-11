# 작업 현황 (Work-in-Progress Tracker)

> **decisions.md와 다른 문서입니다.**
> `decisions.md`는 "논의를 거쳐 확정된 결정"의 영구 기록이고, 이 문서는 **"지금 누가 어디를 작업 중인지"**를 보여주는 임시/유동적 상태판입니다.
> 여러 사람(과 여러 AI 에이전트)이 동시에 이 저장소를 건드릴 수 있기 때문에 만들었습니다. 결정 이력이 아니라 트래픽 신호 역할입니다.

---

## 사용 규칙

1. **작업 시작 전**: 아래 "진행 중 작업" 표에서 내가 건드리려는 경로(폴더/파일)가 이미 담당자가 있는지 확인한다.
2. **작업 착수 시**: 표에 본인 행을 추가한다 (영역 / 담당 / 경로 / 상태 / 마지막 업데이트 / 메모).
3. **경로 겹침 발견 시**: 다른 담당자가 이미 있는 경로는 건드리지 않는다. 겹쳐야 한다면 먼저 조율한다 (커밋 메시지나 이 문서의 메모란에 남기기).
4. **작업 종료/휴식 시**: 상태를 갱신한다 (진행 중 / 완료 / 보류). "완료"가 되고 실제로 merge까지 끝나면 아래 "완료 로그"로 옮기고 이 표에서는 지운다.
5. 이 문서 자체는 자주 바뀌는 게 정상입니다 — 오래된 스냅샷이라고 의심되면 git log로 최신 상태인지 확인하세요.

---

## 진행 중 작업 (Active)

| 영역 | 담당 | 경로 (건드리는 파일/폴더) | 상태 | 마지막 업데이트 | 메모 |
|---|---|---|---|---|---|
| (현재 진행 중인 작업 없음) | | | | | |

---

## 완료 로그 (병합 완료 후 이동, 주기적으로 정리/삭제)

| 영역 | 담당 | 완료일 | 요약 |
|---|---|---|---|
| 피드백 반영 및 2강 재작성 | Antigravity (AI 에이전트) | 2026-07-02 | 1~5강 전체에서 쓸데없는 PPTX 다운로드 버튼 및 TL;DR 삭제. 2강(`02-threat-model`) 내용 부실 지적에 따라 원본 PPTX 기반으로 상세 내용 전면 추가. 가짜 통계 차트 제거 및 Mermaid 기반 다이어그램을 능동/수동 공격 Anime.js 애니메이션으로 교체. |
| CS / Crypto 스터디 5강 | Antigravity (AI 에이전트) | 2026-07-02 | `studies/cs/05-number-theory` 정수론 노트 추가 완료. `studies/index.html` 링크 오류 수정 및 메인 포털 구조 업데이트. |
| Crypto 스터디노트 1~4강 및 플러그인 연동 | Antigravity (AI 에이전트) | 2026-07-02 | `studies/crypto/01-intro` ~ `04-symmetric`까지 Series 기반 3단 레이아웃 노트 작성 완료. `plugins.md` 신설 및 `AGENTS.md` 맵에 추가하여 Anime.js, KaTeX, Prism.js, Mermaid.js 연동 가이드라인 설정. 2강, 3강, 4강에 애니메이션 및 시각화 적용. (기존 방식의 번호 없는 구형 마크다운 폴더들은 사용하지 않으며 정리됨). |
| Finance 스터디노트 (IE412 AI for Finance) 11편 | Claude (AI 에이전트) | 2026-07-02 | `studies/finance/{slug}/index.md`+`index.html` 11쌍 작성 완료(투자과학 개론 → 이자/현재가치 → IRR·NPV → 채권·듀레이션 → 기간구조 → 기대효용·평균분산 → Markowitz·Two-Fund → CAPM → Decision-Focused Learning → LLM for Finance → 이상거래탐지·개인투자자). `finance-notes.css` 신규(선수지식 배지/용어사전/차트 컨테이너/노트 네비게이션). KaTeX 0.16.8 재사용, Chart.js 4.4.4로 버전 고정(7개 노트에 시각화 포함). `studies/index.html`에 Finance 필터·태그·카드 11개 등록. decisions.md D17~D21 기록. 부수적으로 사이트 전역 CSS 변수 누락 버그 발견·수정(`global.css`에 16개 호환 별칭 추가, D20) — crypto 등 다른 카테고리 렌더링에도 영향. **최종 검증 완료**: 최종 검증 중 `**bold(괄호)**한글` 패턴이 CommonMark의 right-flanking-delimiter 규칙에 걸려 렌더링 안 되는 버그 108건 발견 → 전체 11개 파일의 `**...**`(총 351쌍, 모두 볼드용, 수식과 겹침 없음 확인)를 raw `<strong>` HTML로 일괄 치환해 해결. KaTeX 구분자 균형·차트 캔버스 ID 매칭·내부 링크·표 렌더링 재검증 모두 통과 |
| 사이트 전역 버그: 스크롤 진행률 바(`#reading-progress`) 겹침 | Claude (AI 에이전트) | 2026-07-16 | `global.css`(standalone `.reading-progress`: position:fixed+height:3px)와 `studies.css`(container+fill `.reading-progress`: height:100%)가 동일 클래스명을 다른 용도로 정의 → CSS 캐스케이드가 속성 단위로 병합되면서 스크롤 시 그라데이션 패널이 화면 전체를 옆에서 덮는 버그 발생(전 카테고리 공통, `note-template.html`/`travel-template.html`/`project-template.html` 및 finance 11개 노트 등 14개 파일 영향). `studies.css`의 규칙을 `.reading-progress-container .reading-progress`로 스코프하고 `position/top/left/z-index`를 명시적으로 재설정(static/auto)해 상위 규칙 유입 차단하는 방식으로 수정(`global.css`는 다른 곳에서 쓰일 수 있어 그대로 둠). 부수적으로 `progress-bar.js`의 `module.exports`가 브라우저 plain `<script>`에서 `ReferenceError`를 던지던 것도 가드 처리로 수정. decisions.md D25 기록 |
| Finance 스터디노트 10편 확장 (교재 전체 커버리지, 총 21편) | Claude (AI 에이전트) | 2026-07-16 | 사용자가 "PPT가 건너뛴 선물·옵션 등 교재 내용을 채워달라"고 요청 → AskUserQuestion으로 범위 확인 후 "교재 전체 커버" 선택받아 Ch5/Ch8/Ch9후반/Ch10~16 총 10편 신설(응용 이자율 분석 → 팩터 모델·APT → 상태가격·위험중립가격결정 → 선도·선물·스왑 → 이항격자모형 → 옵션 기초이론 → 블랙-숄즈 → 이자율파생상품 → 최적포트폴리오성장 → 일반투자안평가). 텍스트북(Luenberger, *Investment Science*) 원문을 bash `pdftoppm`으로 렌더링 후 병렬 서브에이전트로 정독·집필(1차 10개 동시 실행 시 세션 한도로 5편만 완료 → 2차에 3+2로 나눠 재시도해 전부 완료, 페이지 이미지 읽기 직후 즉시 파일 저장하도록 지시해 토큰 소진 리스크 완화). Anime.js는 crypto가 이미 등록해둔 자산을 재사용해 이항격자 확장/위험중립확률 전환/델타헤지 리밸런싱 3곳에만 제한적으로 적용(D24). 기존 11편의 prev/next pagination href·순번(x/11→x/21)·prereq-box 순번을 21편 전체 기준으로 재정렬하고, `investment-science-intro`의 시리즈 목차와 `studies/index.html` 카드 10개·태그 8개(apt/risk-neutral/forward/lattice/option/black-scholes/kelly 등)를 신규 등록. decisions.md D22~D24 기록. **검증**: 10개 노트 전부 `\\(`/`\\)` 균형·`$$` 짝수·`**` 잔존 0건·canvas/애니메이션 id 일치 확인(1건은 파일 끝 null byte 3개 발견해 제거). 21편 전체 pagination href·순번을 스크립트로 교차검증해 구조적 불일치 0건 확인(단, 일부 기존 노트의 nav 링크 텍스트가 h1보다 짧게 축약된 것은 이 작업 이전부터 있던 디자인이라 그대로 둠) |

---

## 담당 영역 나누는 원칙

- **경로 기준으로 나눈다.** `studies/{category}/**` 처럼 폴더 단위로 소유권을 표시하면 충돌 위험이 가장 적다.
- **공용 파일(`studies/index.html`, `assets/css/components.css`, `assets/data/search-index.json` 등)은 "전체 교체"가 아니라 "내 카테고리에 해당하는 블록만" 수정한다.** 예: `studies/index.html`의 카드 그리드에서 내 카테고리 카드만 추가/수정하고 다른 카테고리 카드는 건드리지 않는다.
- **카테고리별 시각적 구분(뱃지 색상 등)은 반드시 [styles.md](styles.md)의 "카테고리별 액센트 컬러" 표에 먼저 등록한 뒤 사용한다.** 등록 없이 임의로 새 색을 쓰면 다른 담당자와 충돌하거나 site-wide 톤(우드&베이지)과 안 어울릴 수 있다.
- **새 외부 라이브러리(KaTeX, Chart.js 등) 도입은 `decisions.md`에 결정 항목으로 남긴다.** 이 문서(progress.md)는 "누가 뭘 하는 중인지"만 다루고, "왜 그 라이브러리를 쓰기로 했는지"는 decisions.md 몫이다.
