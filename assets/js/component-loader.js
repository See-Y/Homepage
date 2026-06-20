/**
 * @file component-loader.js
 * @description 공통 컴포넌트(헤더/푸터) 동적 로드 모듈
 * @phase Phase 1
 */

(function (root) {
  'use strict';

  const loadedComponents = new Set();

  /**
   * HTML 컴포넌트를 fetch하여 placeholder에 삽입한다.
   * @param {string} url - 컴포넌트 HTML 파일 URL
   * @param {string} placeholderId - 삽입 대상 요소의 ID
   * @param {Function} [onLoad] - 삽입 완료 후 실행할 콜백
   * @returns {Promise<boolean>} 성공 여부
   */
  async function loadComponent(url, placeholderId, onLoad) {
    // 이미 로드된 컴포넌트는 건너뛴다
    const key = `${url}:${placeholderId}`;
    if (loadedComponents.has(key)) {
      return false;
    }

    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      return false;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      placeholder.innerHTML = html;
      placeholder.classList.add('loaded');
      loadedComponents.add(key);
      
      if (typeof onLoad === 'function') {
        onLoad();
      }
      
      return true;
    } catch (error) {
      console.error(`[ComponentLoader] Failed to load ${url}:`, error.message);
      return false;
    }
  }

  /**
   * 헤더와 푸터를 로드한다.
   * @returns {Promise<{header: boolean, footer: boolean}>}
   */
  async function loadAllComponents() {
    const [header, footer] = await Promise.all([
      loadComponent('/components/header.html', 'header-placeholder'),
      loadComponent('/components/footer.html', 'footer-placeholder')
    ]);

    return { header, footer };
  }

  /**
   * 로드 상태를 초기화한다 (테스트용).
   */
  function resetLoadedState() {
    loadedComponents.clear();
  }

  /**
   * 특정 컴포넌트가 이미 로드되었는지 확인한다.
   * @param {string} url
   * @param {string} placeholderId
   * @returns {boolean}
   */
  function isLoaded(url, placeholderId) {
    return loadedComponents.has(`${url}:${placeholderId}`);
  }

  // Export
  const componentLoaderModule = {
    loadComponent,
    loadAllComponents,
    resetLoadedState,
    isLoaded
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = componentLoaderModule;
  }
  if (typeof root !== 'undefined') {
    root.ComponentLoader = componentLoaderModule;
  }
})(typeof window !== 'undefined' ? window : this);
