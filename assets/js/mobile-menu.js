/**
 * @file mobile-menu.js
 * @description 모바일 햄버거 메뉴 모듈
 * @phase Phase 1
 */

(function (root) {
  'use strict';

  let menuOpen = false;
  let hamburgerBtn = null;
  let mobileNav = null;
  let overlay = null;

  // 바인딩된 이벤트 핸들러 참조 (정리용)
  let boundHandleOutsideClick = null;
  let boundHandleKeydown = null;
  let boundHandleLinkClick = null;

  /**
   * 메뉴가 열려있는지 반환한다.
   * @returns {boolean}
   */
  function isMenuOpen() {
    return menuOpen;
  }

  /**
   * 메뉴를 연다.
   */
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;

    if (mobileNav) mobileNav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');

    document.body.style.overflow = 'hidden';
  }

  /**
   * 메뉴를 닫는다.
   */
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;

    if (mobileNav) mobileNav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
  }

  /**
   * 메뉴를 토글한다.
   */
  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * 외부 클릭 시 메뉴를 닫는다.
   * @param {Event} e
   */
  function handleOutsideClick(e) {
    if (!menuOpen) return;
    if (mobileNav && !mobileNav.contains(e.target) &&
        hamburgerBtn && !hamburgerBtn.contains(e.target)) {
      closeMenu();
    }
  }

  /**
   * ESC 키로 메뉴를 닫는다.
   * @param {KeyboardEvent} e
   */
  function handleKeydown(e) {
    if (e.key === 'Escape' && menuOpen) {
      closeMenu();
    }
  }

  /**
   * 메뉴 내 링크 클릭 시 메뉴를 닫는다.
   * @param {Event} e
   */
  function handleLinkClick(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      closeMenu();
    }
  }

  /**
   * 모바일 메뉴를 초기화한다.
   */
  function initMobileMenu() {
    hamburgerBtn = document.getElementById('hamburger-btn');
    mobileNav = document.getElementById('mobile-nav');
    overlay = document.getElementById('mobile-overlay');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMenu);
    }

    // 이벤트 핸들러 바인딩
    boundHandleOutsideClick = handleOutsideClick;
    boundHandleKeydown = handleKeydown;
    boundHandleLinkClick = handleLinkClick;

    document.addEventListener('click', boundHandleOutsideClick);
    document.addEventListener('keydown', boundHandleKeydown);

    if (mobileNav) {
      mobileNav.addEventListener('click', boundHandleLinkClick);
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }
  }

  /**
   * 이벤트 리스너를 정리한다 (테스트용).
   */
  function destroy() {
    if (hamburgerBtn) {
      hamburgerBtn.removeEventListener('click', toggleMenu);
    }
    document.removeEventListener('click', boundHandleOutsideClick);
    document.removeEventListener('keydown', boundHandleKeydown);
    if (mobileNav) {
      mobileNav.removeEventListener('click', boundHandleLinkClick);
    }
    if (overlay) {
      overlay.removeEventListener('click', closeMenu);
    }

    menuOpen = false;
    hamburgerBtn = null;
    mobileNav = null;
    overlay = null;
  }

  // Export
  const mobileMenuModule = {
    initMobileMenu,
    openMenu,
    closeMenu,
    toggleMenu,
    isMenuOpen,
    destroy
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mobileMenuModule;
  }
  if (typeof root !== 'undefined') {
    root.MobileMenu = mobileMenuModule;
  }
})(typeof window !== 'undefined' ? window : this);
