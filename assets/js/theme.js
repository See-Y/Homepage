/**
 * @file theme.js
 * @description 다크/라이트 모드 전환 모듈
 * @phase Phase 1
 */

(function (root) {
  'use strict';

  const STORAGE_KEY = 'theme';
  const VALID_THEMES = ['light', 'dark'];
  const DEFAULT_THEME = 'light';

  /**
   * 저장된 테마를 가져온다. 유효하지 않으면 기본값 반환.
   * @returns {'light'|'dark'}
   */
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return VALID_THEMES.includes(saved) ? saved : DEFAULT_THEME;
    } catch (e) {
      // localStorage 접근 불가 (private browsing 등)
      return DEFAULT_THEME;
    }
  }

  /**
   * 테마를 DOM과 localStorage에 적용한다.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    const validTheme = VALID_THEMES.includes(theme) ? theme : DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', validTheme);
    try {
      localStorage.setItem(STORAGE_KEY, validTheme);
    } catch (e) {
      // localStorage 쓰기 불가
    }
  }

  /**
   * 현재 적용된 테마를 반환한다.
   * @returns {'light'|'dark'}
   */
  function getCurrentTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    return VALID_THEMES.includes(current) ? current : DEFAULT_THEME;
  }

  /**
   * 테마를 토글한다 (light ↔ dark).
   * @returns {'light'|'dark'} 전환된 테마
   */
  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    updateToggleButton(next);
    return next;
  }

  /**
   * 토글 버튼의 아이콘/텍스트를 업데이트한다.
   * @param {'light'|'dark'} theme
   */
  function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icon = btn.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * 테마 모듈을 초기화한다.
   * - 저장된 테마를 복원한다.
   * - 토글 버튼에 이벤트 리스너를 바인딩한다.
   */
  function initTheme() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    updateToggleButton(savedTheme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  // Export
  const themeModule = {
    initTheme,
    toggleTheme,
    getCurrentTheme,
    getSavedTheme,
    applyTheme
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeModule;
  }
  if (typeof root !== 'undefined') {
    root.Theme = themeModule;
  }
})(typeof window !== 'undefined' ? window : this);
