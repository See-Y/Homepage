/**
 * @file search.js
 * @description 전역 검색 및 모달 UI 제어 로직
 */

(function () {
  'use strict';

  // DOM 요소
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  let fuse = null;
  let searchData = [];
  let isFuseLoaded = false;

  /**
   * Fuse.js 라이브러리 동적 로드
   */
  async function loadFuseLibrary() {
    if (isFuseLoaded) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js';
      script.onload = () => {
        isFuseLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * 검색 인덱스 데이터 Fetch
   */
  async function fetchSearchIndex() {
    if (searchData.length > 0) return; // 이미 로드됨
    try {
      const response = await fetch('/assets/data/search-index.json');
      if (response.ok) {
        searchData = await response.json();
      }
    } catch (error) {
      console.error('[Search] Failed to fetch search index:', error);
    }
  }

  /**
   * 검색 모달 열기
   */
  async function openSearchModal() {
    searchModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    searchInput.focus();

    try {
      await Promise.all([loadFuseLibrary(), fetchSearchIndex()]);
      if (!fuse && isFuseLoaded && window.Fuse) {
        const options = {
          keys: ['title', 'content', 'snippet'],
          includeScore: true,
          threshold: 0.4
        };
        fuse = new window.Fuse(searchData, options);
      }
    } catch (e) {
      console.error('[Search] Setup failed:', e);
    }
  }

  /**
   * 검색 모달 닫기
   */
  function closeSearchModal() {
    searchModal.style.display = 'none';
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  /**
   * 검색 실행 및 결과 렌더링
   */
  function handleSearch(e) {
    const query = e.target.value.trim();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    if (!fuse) {
      searchResults.innerHTML = '<div class="search-empty">검색 시스템 준비 중...</div>';
      return;
    }

    const results = fuse.search(query);
    renderResults(results);
  }

  function renderResults(results) {
    if (results.length === 0) {
      const emptyMsg = (typeof I18n !== 'undefined' && I18n.t) 
        ? I18n.t('common.search.noResults') || '검색 결과가 없습니다' 
        : '검색 결과가 없습니다';
      searchResults.innerHTML = `<div class="search-empty">${emptyMsg}</div>`;
      return;
    }

    let html = '';
    results.forEach(({ item }) => {
      // 카테고리 태그 처리
      const categoryTag = item.category ? `<span class="badge badge--crypto" style="font-size: 0.7rem; padding: 0.1rem 0.4rem; margin-bottom: 0.2rem; display: inline-block;">${item.category}</span><br>` : '';
      
      html += `
        <a href="${item.url}" class="search-result-item">
          ${categoryTag}
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-snippet">${item.snippet}...</div>
        </a>
      `;
    });
    searchResults.innerHTML = html;
  }

  // 이벤트 리스너 등록
  if (searchBtn) searchBtn.addEventListener('click', openSearchModal);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearchModal);
  if (searchClose) searchClose.addEventListener('click', closeSearchModal);
  if (searchInput) searchInput.addEventListener('input', handleSearch);

  // 전역 단축키 (Ctrl+K 또는 Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal && searchModal.style.display === 'flex') {
        closeSearchModal();
      } else {
        if (searchBtn) openSearchModal();
      }
    }
    // ESC로 닫기
    if (e.key === 'Escape' && searchModal && searchModal.style.display === 'flex') {
      closeSearchModal();
    }
  });

  // 노출용 Export
  window.SearchModal = {
    open: openSearchModal,
    close: closeSearchModal
  };

})();
