/**
 * @file main.js
 * @description 공통 진입점 — 컴포넌트 로드, 테마, 메뉴, i18n 초기화
 * @phase Phase 1
 */

(function () {
  'use strict';

  /**
   * 모든 공통 모듈을 초기화한다.
   */
  async function init() {
    // 1. 헤더/푸터 로드
    if (typeof ComponentLoader !== 'undefined') {
      await ComponentLoader.loadAllComponents();
    }

    // 2. 테마 초기화 (헤더의 토글 버튼이 로드된 후)
    if (typeof Theme !== 'undefined') {
      Theme.initTheme();
    }

    // 3. 모바일 메뉴 초기화
    if (typeof MobileMenu !== 'undefined') {
      MobileMenu.initMobileMenu();
    }

    // 4. i18n 초기화 (모든 컴포넌트가 로드된 후 번역 적용)
    if (typeof I18n !== 'undefined') {
      I18n.initI18n();
    }

    // 5. 검색 초기화 (비동기로 모듈 및 스타일 로드)
    loadSearchModule();

    // 6. 현재 페이지에 해당하는 네비게이션 활성 표시
    highlightActiveNav();
  }

  /**
   * Search 모듈과 스타일을 동적으로 로드합니다.
   */
  function loadSearchModule() {
    // search.css 로드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/search.css';
    document.head.appendChild(link);

    // search.js 로드
    const script = document.createElement('script');
    script.src = '/assets/js/search.js';
    document.body.appendChild(script);
  }

  /**
   * 현재 URL에 해당하는 네비게이션 항목을 활성화한다.
   */
  function highlightActiveNav() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // 정확히 일치하거나, 하위 경로인 경우 활성화
      const isActive = (href === '/' && path === '/') ||
                        (href !== '/' && path.startsWith(href));

      if (isActive) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // DOMContentLoaded에서 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
