/**
 * @file i18n.js
 * @description 다국어(한/영) 처리 모듈
 * @phase Phase 1
 */

(function (root) {
  'use strict';

  const STORAGE_KEY = 'lang';
  const SUPPORTED_LANGS = ['ko', 'en'];
  const DEFAULT_LANG = 'ko';

  /**
   * 번역 텍스트 맵
   */
  const translations = {
    ko: {
      // 공통 - 네비게이션
      'common.nav.home': '홈',
      'common.nav.about': '소개',
      'common.nav.now': '근황',
      'common.nav.studies': '공부',
      'common.nav.projects': '프로젝트',
      'common.nav.travel': '여행',
      // 공통 - UI
      'common.theme.toggle': '다크모드 전환',
      'common.lang.toggle': 'EN',
      'common.search.placeholder': '검색어를 입력하세요',
      'common.search.noResults': '검색 결과가 없습니다',
      'common.search.title': '검색',
      'common.search.shortcut': 'Ctrl+K',
      // 공통 - 푸터
      'common.footer.copyright': '© 2026. All rights reserved.',
      'common.footer.rss': 'RSS 피드',
      'common.footer.source': '소스 코드',
      // 홈
      'home.hero.title': '환영합니다',
      'home.hero.subtitle': '공부 노트, 프로젝트, 여행 기록',
      'home.hero.description': '보안과 CS를 공부하고, 프로젝트를 만들고, 여행을 기록합니다.',
      'home.recent.title': '최근 업데이트',
      'home.sections.studies': '공부 노트',
      'home.sections.studies.desc': '보안, 네트워크, 암호학 등 공부한 내용을 정리합니다.',
      'home.sections.projects': '프로젝트',
      'home.sections.projects.desc': '직접 만든 프로젝트들을 소개합니다.',
      'home.sections.travel': '여행',
      'home.sections.travel.desc': '여행 기록과 사진을 공유합니다.',
      'home.sections.about': '소개',
      'home.sections.about.desc': '저에 대해 알아보세요.',
      'home.recent.empty': '아직 업데이트가 없습니다.',
      // About
      'about.title': '소개',
      'about.intro.heading': '안녕하세요',
      'about.intro.text': '여기에 자기소개를 작성하세요.',
      'about.skills.heading': '기술 스택',
      'about.timeline.heading': '타임라인',
      'about.contact.heading': '연락처',
      'about.pgp.heading': 'PGP 공개키',
      // Studies
      'studies.title': '공부 노트',
      'studies.filter.all': '전체',
      'studies.filter.crypto': '암호학',
      'studies.filter.network': '네트워크',
      'studies.filter.system': '시스템',
      'studies.filter.web': '웹 보안',
      'studies.filter.fuzzing': '퍼징',
      'studies.card.difficulty': '난이도',
      'studies.card.duration': '소요시간',
      'studies.empty': '아직 노트가 없습니다',
      'studies.note.tldr': '핵심 요약',
      'studies.note.backlinks': '연관 노트',
      'studies.note.editOnGithub': '오류 제보 / 수정 제안',
      // Projects
      'projects.title': '프로젝트',
      'projects.status.done': '완료',
      'projects.status.active': '진행 중',
      'projects.status.paused': '중단',
      'projects.section.problem': '문제',
      'projects.section.solution': '해결',
      'projects.section.result': '결과',
      'projects.empty': '아직 프로젝트가 없습니다',
      // Travel
      'travel.title': '여행',
      'travel.empty': '아직 여행 기록이 없습니다',
      // Now
      'now.title': '근황',
      'now.lastUpdated': '마지막 업데이트',
      'now.placeholder': '여기에 근황을 작성하세요.'
    },
    en: {
      // Common - Navigation
      'common.nav.home': 'Home',
      'common.nav.about': 'About',
      'common.nav.now': 'Now',
      'common.nav.studies': 'Studies',
      'common.nav.projects': 'Projects',
      'common.nav.travel': 'Travel',
      // Common - UI
      'common.theme.toggle': 'Toggle dark mode',
      'common.lang.toggle': '한',
      'common.search.placeholder': 'Search...',
      'common.search.noResults': 'No results found',
      'common.search.title': 'Search',
      'common.search.shortcut': 'Ctrl+K',
      // Common - Footer
      'common.footer.copyright': '© 2026. All rights reserved.',
      'common.footer.rss': 'RSS Feed',
      'common.footer.source': 'Source Code',
      // Home
      'home.hero.title': 'Welcome',
      'home.hero.subtitle': 'Study Notes, Projects, Travel Logs',
      'home.hero.description': 'I study security and CS, build projects, and document my travels.',
      'home.recent.title': 'Recent Updates',
      'home.sections.studies': 'Study Notes',
      'home.sections.studies.desc': 'Notes on security, networking, cryptography, and more.',
      'home.sections.projects': 'Projects',
      'home.sections.projects.desc': 'Showcasing personal projects.',
      'home.sections.travel': 'Travel',
      'home.sections.travel.desc': 'Travel logs and photos.',
      'home.sections.about': 'About',
      'home.sections.about.desc': 'Learn more about me.',
      'home.recent.empty': 'No updates yet.',
      // About
      'about.title': 'About',
      'about.intro.heading': 'Hello',
      'about.intro.text': 'Write your introduction here.',
      'about.skills.heading': 'Skills',
      'about.timeline.heading': 'Timeline',
      'about.contact.heading': 'Contact',
      'about.pgp.heading': 'PGP Public Key',
      // Studies
      'studies.title': 'Study Notes',
      'studies.filter.all': 'All',
      'studies.filter.crypto': 'Cryptography',
      'studies.filter.network': 'Network',
      'studies.filter.system': 'System',
      'studies.filter.web': 'Web Security',
      'studies.filter.fuzzing': 'Fuzzing',
      'studies.card.difficulty': 'Difficulty',
      'studies.card.duration': 'Duration',
      'studies.empty': 'No notes yet',
      'studies.note.tldr': 'TL;DR',
      'studies.note.backlinks': 'Related Notes',
      'studies.note.editOnGithub': 'Report Error / Suggest Edit',
      // Projects
      'projects.title': 'Projects',
      'projects.status.done': 'Completed',
      'projects.status.active': 'In Progress',
      'projects.status.paused': 'Paused',
      'projects.section.problem': 'Problem',
      'projects.section.solution': 'Solution',
      'projects.section.result': 'Result',
      'projects.empty': 'No projects yet',
      // Travel
      'travel.title': 'Travel',
      'travel.empty': 'No travel logs yet',
      // Now
      'now.title': 'Now',
      'now.lastUpdated': 'Last updated',
      'now.placeholder': 'Write your current status here.'
    }
  };

  /**
   * URL 파라미터에서 언어를 감지한다.
   * @returns {string|null}
   */
  function getLangFromURL() {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      return SUPPORTED_LANGS.includes(lang) ? lang : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * localStorage에서 언어를 가져온다.
   * @returns {string|null}
   */
  function getLangFromStorage() {
    try {
      const lang = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.includes(lang) ? lang : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 현재 언어를 감지한다. 우선순위: URL > localStorage > 기본값
   * @returns {'ko'|'en'}
   */
  function detectLanguage() {
    return getLangFromURL() || getLangFromStorage() || DEFAULT_LANG;
  }

  let currentLang = DEFAULT_LANG;

  /**
   * 현재 언어를 반환한다.
   * @returns {'ko'|'en'}
   */
  function getCurrentLang() {
    return currentLang;
  }

  /**
   * 특정 키에 대한 번역 텍스트를 반환한다.
   * @param {string} key
   * @param {string} [lang]
   * @returns {string|null} 번역 텍스트, 없으면 null
   */
  function t(key, lang) {
    const l = lang || currentLang;
    const langMap = translations[l];
    if (!langMap) return null;
    return langMap[key] !== undefined ? langMap[key] : null;
  }

  /**
   * 페이지의 모든 data-i18n 요소를 번역한다.
   * @param {Element} [scope=document] 번역 범위
   */
  function translatePage(scope) {
    const root = scope || document;
    const elements = root.querySelectorAll('[data-i18n]');

    elements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);

      if (translated === null) return; // 키가 없으면 원본 유지

      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, translated);
      } else {
        el.textContent = translated;
      }
    });

    // <html lang=""> 속성 업데이트
    document.documentElement.setAttribute('lang', currentLang);
  }

  /**
   * 언어를 설정하고 페이지를 번역한다.
   * @param {'ko'|'en'} lang
   */
  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      return; // 지원하지 않는 언어면 이전 값 유지
    }

    currentLang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage 쓰기 불가
    }

    // URL 파라미터 업데이트 (히스토리 변경 없이)
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // URL 업데이트 실패 무시
    }

    translatePage();
    updateLangToggle();
  }

  /**
   * 언어를 토글한다 (ko ↔ en).
   */
  function toggleLanguage() {
    const next = currentLang === 'ko' ? 'en' : 'ko';
    setLanguage(next);
  }

  /**
   * 언어 토글 버튼의 텍스트를 업데이트한다.
   */
  function updateLangToggle() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const label = btn.querySelector('.lang-toggle__label');
    if (label) {
      label.textContent = currentLang === 'ko' ? 'EN' : '한';
    }
  }

  /**
   * i18n 모듈을 초기화한다.
   */
  function initI18n() {
    currentLang = detectLanguage();
    translatePage();
    updateLangToggle();

    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', toggleLanguage);
    }
  }

  // Export
  const i18nModule = {
    initI18n,
    setLanguage,
    getCurrentLang,
    translatePage,
    toggleLanguage,
    t,
    detectLanguage,
    translations,
    SUPPORTED_LANGS,
    DEFAULT_LANG
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18nModule;
  }
  if (typeof root !== 'undefined') {
    root.I18n = i18nModule;
  }
})(typeof window !== 'undefined' ? window : this);
