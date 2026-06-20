/**
 * @file filter.js
 * @description 카테고리 및 태그 필터링 로직
 */

/**
 * 필터 시스템 초기화
 */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tagBtns = document.querySelectorAll('.tag-btn');
  const cards = document.querySelectorAll('.section-card');
  const emptyState = document.getElementById('empty-state');
  
  if (filterBtns.length === 0 && tagBtns.length === 0) return;

  let activeCategory = 'all';
  let activeTags = new Set();

  function updateCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTagsRaw = card.getAttribute('data-tags') || '';
      const cardTags = cardTagsRaw.split(',').map(t => t.trim()).filter(Boolean);

      // 카테고리 매칭
      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      
      // 태그 매칭 (선택된 태그가 하나도 없으면 전체 허용, 있으면 하나라도 포함되는지 확인)
      // 문제 명세에서는 "교집합"인지 "합집합"인지 명확하지 않으나, 
      // 통상적으로 선택한 태그를 포함한 카드를 보여주므로 부분 일치(intersection > 0)로 처리
      let tagMatch = true;
      if (activeTags.size > 0) {
        tagMatch = false;
        for (const tag of activeTags) {
          if (cardTags.includes(tag)) {
            tagMatch = true;
            break;
          }
        }
      }

      if (categoryMatch && tagMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = '';
      } else {
        emptyState.style.display = 'none';
      }
    }
  }

  // 카테고리 필터 이벤트 리스너
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 액티브 상태 토글 로직
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      
      updateCards();
    });
  });

  // 태그 필터 이벤트 리스너
  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('active');
      } else {
        // 단일 선택으로 할지 다중 선택으로 할지 - 요구사항(T5-6) "태그 필터 해제 시 복원"이므로 다중 선택 지원
        activeTags.add(tag);
        btn.classList.add('active');
      }
      
      updateCards();
    });
  });

  // 초기 렌더링
  updateCards();
}

module.exports = { initFilter };
