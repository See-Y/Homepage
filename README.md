# Antigravity Blog & Portfolio

이 저장소는 개인 포트폴리오 겸 기술/보안 블로그 소스 코드입니다. 복잡한 프레임워크나 백엔드 서버 없이, **순수 웹 표준 기술(HTML, CSS, JavaScript)**만으로 구축된 모던 정적 웹사이트입니다. 

빠른 로딩 속도와 유지보수의 용이성을 극대화하기 위해 설계되었으며, Cloudflare Pages를 통해 전 세계에 무료로 배포됩니다.

## 🌟 주요 기능 (Features)

* **프레임워크 프리 (No Frameworks):** React, Vue 등 무거운 프레임워크 없이 순수 Vanilla JS와 CSS Variables로 구축되었습니다.
* **전역 검색 (Global Search):** [Fuse.js](https://fusejs.io/)를 활용하여 클라이언트 사이드에서 즉각적인 본문 검색(`Ctrl+K`)을 지원합니다.
* **마크다운 렌더링:** 별도의 DB 없이, 로컬에 작성된 `.md` 파일을 브라우저 단에서 동적으로 렌더링합니다. (marked.js 사용)
* **세계 여행 지도 (Travel Map):** [Leaflet.js](https://leafletjs.com/)를 연동하여 여행 기록을 인터랙티브한 세계 지도로 보여줍니다.
* **사용자 친화적 UI:** 
  * 매끄러운 다크모드/라이트모드 전환 및 저장 기능
  * 완벽한 반응형(Mobile-First) 디자인
  * 다국어(i18n) 지원 체계 마련
  * 상단 스크롤 진행률 바(Reading Progress Bar)

## 📁 디렉토리 구조

```text
/
├── assets/         # CSS, JS, 폰트, 이미지 등 전역 정적 파일들
│   └── data/       # 검색 인덱스 및 지도 마커를 위한 JSON 데이터
├── components/     # 모든 페이지에서 재사용되는 헤더/푸터 HTML 조각
├── studies/        # IT, 보안, CS 공부 마크다운 노트 폴더
├── projects/       # 프로젝트 포트폴리오 쇼케이스
├── travel/         # 여행 기록 및 사진 갤러리
├── scripts/        # 배포 자동화 및 데이터 빌드 스크립트 (Node.js)
├── index.html      # 메인 홈페이지
└── rss.xml         # 구독자를 위한 전역 RSS 피드
```

## 🛠 빌드 및 배포 방법

이 블로그는 Node.js를 이용해 배포 전 검색 인덱스와 RSS 피드를 동적으로 구성한 뒤, Cloudflare Pages에 최적화된 폴더만 배포합니다.

### 1. 로컬 개발 환경
```bash
# 별도의 의존성 설치 없이 로컬 정적 서버로 띄워 확인합니다.
npx serve .
```

### 2. 검색 데이터 및 RSS 업데이트
새로운 마크다운 글이나 여행 기록을 추가한 뒤에는 다음 명령어를 실행하여 데이터를 최신화합니다.
```bash
npm run build:data
```
> 이 명령어는 `assets/data/search-index.json`과 `rss.xml`을 자동으로 갱신하고, 배포에 필요한 파일만 모은 `dist/` 폴더를 생성합니다.

### 3. Cloudflare Pages 배포
Cloudflare Pages 대시보드에서 이 GitHub 레포지토리를 연결한 뒤, 아래와 같이 설정하면 `git push`마다 자동 배포가 이루어집니다.
* **Build command:** `npm run build:data`
* **Build output directory:** `/dist`

## 📄 License
MIT License
