/**
 * @file markdown-loader.js
 * @description 클라이언트 사이드 마크다운 로더 및 렌더러
 */

/**
 * 마크다운 파일을 로드하여 지정된 컨테이너에 HTML로 렌더링
 * @param {string} url 마크다운 파일 URL
 * @param {string} placeholderId 렌더링할 요소 ID
 */
async function loadMarkdown(url, placeholderId) {
  const container = document.getElementById(placeholderId);
  if (!container) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // marked.js 가 글로벌 환경에 로드되어 있어야 함
    if (window.marked && typeof window.marked.parse === 'function') {
      container.innerHTML = window.marked.parse(text);
    } else {
      throw new Error('marked.js is not loaded');
    }
  } catch (error) {
    console.error(`[MarkdownLoader] Failed to load ${url}:`, error);
    container.innerHTML = `
      <div class="empty-state">
        <h3>Error loading content</h3>
        <p>Failed to load markdown: ${error.message}</p>
      </div>
    `;
  }
}

module.exports = { loadMarkdown };
