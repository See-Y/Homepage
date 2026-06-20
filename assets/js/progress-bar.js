/**
 * @file progress-bar.js
 * @description 스크롤 진행률 (Reading Progress Bar) 로직
 */

/**
 * Reading Progress Bar 초기화
 */
function initProgressBar() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  function updateProgress() {
    // 뷰포트 높이
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    // 전체 문서 높이
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    // 현재 스크롤 위치 (상단)
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    // 최대 스크롤 가능한 거리
    const maxScroll = scrollHeight - clientHeight;

    let percentage = 0;

    if (maxScroll > 0) {
      if (scrollTop < 0) {
        scrollTop = 0; // 바운스 스크롤 방어
      } else if (scrollTop > maxScroll) {
        scrollTop = maxScroll; // 바운스 스크롤 방어
      }
      percentage = (scrollTop / maxScroll) * 100;
    }

    progressBar.style.width = percentage + '%';
  }

  // 스크롤 및 리사이즈 이벤트에 바인딩
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  // 초기 로드 시 한 번 실행
  updateProgress();
}

module.exports = { initProgressBar };
