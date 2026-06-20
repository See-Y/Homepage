/**
 * @file travel-map.js
 * @description Leaflet 기반 여행 지도 로직
 */

/**
 * 핀 데이터를 순회하며 지도에 마커를 찍는다.
 * @param {Object} map Leaflet Map 인스턴스
 * @param {Array} data 여행 핀 데이터 배열
 */
function renderMarkers(map, data) {
  const emptyState = document.getElementById('empty-state');
  
  if (!data || data.length === 0) {
    if (emptyState) emptyState.style.display = '';
    return;
  }

  let validCount = 0;

  data.forEach(item => {
    const { lat, lng, title, url } = item;

    // 간단한 유효성 검사 (위도: -90~90, 경도: -180~180)
    if (typeof lat !== 'number' || typeof lng !== 'number') return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;

    validCount++;

    const popupContent = `
      <div class="travel-popup">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${title}</h4>
        <a href="${url}" style="font-size: 12px; color: var(--primary-color); text-decoration: none;">여행기 보기 →</a>
      </div>
    `;

    // L (Leaflet) 전역 객체가 존재한다고 가정
    if (window.L && typeof window.L.marker === 'function') {
      window.L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
    }
  });

  if (validCount === 0 && emptyState) {
    emptyState.style.display = '';
  } else if (validCount > 0 && emptyState) {
    emptyState.style.display = 'none';
  }
}

/**
 * 지도 컨테이너를 초기화하고 데이터를 불러온다.
 * @param {string} containerId 지도 요소를 렌더링할 DOM ID
 * @param {string} dataUrl 여행 데이터 JSON 경로
 */
async function initMap(containerId, dataUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!window.L) {
    console.error('[TravelMap] Leaflet is not loaded.');
    return;
  }

  try {
    // 기본 중심 좌표 (서울) 및 줌 레벨
    const map = window.L.map(containerId).setView([20, 0], 2);

    // OpenStreetMap 타일 레이어 추가
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 데이터 Fetch
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();

    renderMarkers(map, data);
  } catch (error) {
    console.error('[TravelMap] Error initializing map:', error);
    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = '';
  }
}

module.exports = { initMap, renderMarkers };
