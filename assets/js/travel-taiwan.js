/**
 * 대만 여행기 전용 스크롤텔링 스크립트
 * assets/js/travel-taiwan.js
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 컴포넌트 로드 대기 (헤더/푸터)
  if (typeof loadComponent === 'function') {
    await Promise.all([
      loadComponent('/components/header.html', 'header-placeholder'),
      loadComponent('/components/footer.html', 'footer-placeholder')
    ]);
  }

  // 1. JSON 데이터 불러오기
  let travelData = [];
  try {
    const response = await fetch('/assets/data/travel-taiwan.json');
    travelData = await response.json();
  } catch (e) {
    console.error('Failed to load travel data:', e);
    return;
  }

  // 2. DOM 요소 생성 (.step)
  const scrollyTextContainer = document.getElementById('scrolly-text');
  
  travelData.forEach((item, index) => {
    const stepEl = document.createElement('div');
    stepEl.classList.add('step');
    stepEl.setAttribute('data-index', index);
    
    // Receipt 이벤트가 있는 경우 버튼 추가
    let extraHTML = '';
    if (item.effect === 'receipt') {
      extraHTML = `<button class="btn btn--primary" style="margin-top: 16px;" onclick="window.showReceipt(${index})">영수증 보기</button>`;
    }

    stepEl.innerHTML = `
      <div class="text-sm text-muted" style="margin-bottom: 8px;">Day ${item.day} • ${item.location}</div>
      <h2>${item.title}</h2>
      <p>${item.text}</p>
      ${extraHTML}
    `;
    scrollyTextContainer.appendChild(stepEl);
  });

  // 3. Leaflet 지도 초기화
  const map = L.map('scrolly-map', {
    zoomControl: false,
    scrollWheelZoom: false, // 스크롤은 텍스트를 위해 예약
    dragging: false
  });

  // 다크모드 타일 설정 (Stamen Toner Lite 또는 CartoDB DarkMatter 등 대안 사용, 여기선 기본 OpenStreetMap)
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 마커 아이콘 설정
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // 모든 좌표에 마커 찍기 및 경로선 데이터 준비
  const latLngs = [];
  const markers = [];
  
  travelData.forEach(item => {
    if (item.coordinates && item.coordinates.length === 2) {
      latLngs.push(item.coordinates);
      const marker = L.marker(item.coordinates, { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`<b>${item.location}</b><br>Day ${item.day}`);
      markers.push(marker);
    } else {
      markers.push(null);
    }
  });

  // 초기 위치 세팅
  if (latLngs.length > 0) {
    map.setView(latLngs[0], 12);
  }

  // 전체 여정 라인 (지도 위)
  const routeLine = L.polyline(latLngs, {
    color: 'var(--color-accent-primary)',
    weight: 3,
    opacity: 0.5,
    dashArray: '5, 10'
  }).addTo(map);


  // 4. 스크롤텔링 로직 (Intersection Observer)
  let currentActiveIndex = -1;
  const steps = document.querySelectorAll('.step');
  
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // 화면 중앙 부근에서 트리거
    threshold: 0
  };

  const rainCanvas = document.getElementById('rain-canvas');
  const scrollyMapWrapper = document.querySelector('.scrolly-map-wrapper');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-index'), 10);
        if (currentActiveIndex !== index) {
          // 기존 active 제거
          steps.forEach(s => s.classList.remove('is-active'));
          // 현재 active 추가
          entry.target.classList.add('is-active');
          currentActiveIndex = index;
          
          const item = travelData[index];
          
          // Map FlyTo 처리
          if (item.coordinates && item.coordinates.length === 2) {
            map.flyTo(item.coordinates, item.zoom || 14, {
              duration: 2,
              easeLinearity: 0.25
            });
            if (markers[index]) {
              markers[index].openPopup();
            }
          }

          // 특수 이펙트 처리
          // 1. 비 내림 효과 (지우펀)
          if (item.effect === 'rain') {
            rainCanvas.classList.add('is-raining');
            startRain();
          } else {
            rainCanvas.classList.remove('is-raining');
            stopRain();
          }

          // 2. 무드 라이트 (용산사)
          if (item.effect === 'moodLight') {
            scrollyMapWrapper.style.boxShadow = 'inset 0 0 100px rgba(212, 163, 115, 0.5)';
            scrollyMapWrapper.style.filter = 'sepia(0.5) hue-rotate(15deg)';
          } else if (item.effect === 'sunset') {
            // 노을 효과 (단수이)
            scrollyMapWrapper.style.boxShadow = 'inset 0 0 150px rgba(255, 100, 50, 0.4)';
            scrollyMapWrapper.style.filter = 'sepia(0.3) saturate(150%) brightness(0.9)';
          } else {
            scrollyMapWrapper.style.boxShadow = 'none';
            scrollyMapWrapper.style.filter = 'none';
          }
          
          // SVG 좌측 진행률 드로잉 업데이트
          updateJourneyLine(index, travelData.length);
        }
      }
    });
  }, observerOptions);

  steps.forEach(step => observer.observe(step));

  // 5. 부가 기능: 집중 모드 (Theater Mode)
  const theaterBtn = document.getElementById('theater-mode-toggle');
  theaterBtn.addEventListener('click', () => {
    document.body.classList.toggle('is-theater-mode');
  });

  // 6. 영수증 모달 로직 전역 바인딩
  window.showReceipt = (index) => {
    const item = travelData[index];
    if (item && item.effectData) {
      const listHtml = item.effectData.items.map(i => `
        <div class="receipt-item">
          <span>${i.name}</span>
          <span>${i.price}</span>
        </div>
      `).join('');
      
      document.getElementById('receipt-items').innerHTML = listHtml;
      document.getElementById('receipt-total').innerHTML = `
        <span>TOTAL</span>
        <span style="color: var(--color-error);">${item.effectData.total}</span>
      `;
      document.getElementById('receipt-modal').classList.add('is-open');
    }
  };

  document.getElementById('close-receipt').addEventListener('click', () => {
    document.getElementById('receipt-modal').classList.remove('is-open');
  });

  // 7. 좌측 SVG 진행률 드로잉 함수
  function updateJourneyLine(currentIndex, totalSteps) {
    const path = document.getElementById('journey-path');
    const svg = document.getElementById('journey-line');
    if(!path || !svg) return;

    // 단순한 직선 드로잉
    const height = svg.clientHeight;
    const stepHeight = height / (totalSteps - 1 || 1);
    const currentY = currentIndex * stepHeight;

    path.setAttribute('d', `M 20 0 L 20 ${currentY}`);
  }

  // 8. 캔버스 빗방울 애니메이션 (아주 간단한 버전)
  let rainInterval;
  function startRain() {
    if (rainInterval) return;
    const ctx = rainCanvas.getContext('2d');
    rainCanvas.width = rainCanvas.clientWidth;
    rainCanvas.height = rainCanvas.clientHeight;
    
    const drops = [];
    for(let i=0; i<100; i++) {
      drops.push({
        x: Math.random() * rainCanvas.width,
        y: Math.random() * rainCanvas.height,
        len: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 15
      });
    }

    rainInterval = setInterval(() => {
      ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      drops.forEach(drop => {
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.len * 0.1, drop.y + drop.len);
        drop.y += drop.speed;
        drop.x += drop.speed * 0.1;
        if (drop.y > rainCanvas.height) {
          drop.y = -drop.len;
          drop.x = Math.random() * rainCanvas.width;
        }
      });
      ctx.stroke();
    }, 30);
  }

  function stopRain() {
    if (rainInterval) {
      clearInterval(rainInterval);
      rainInterval = null;
    }
  }

  // 창 크기 변경 시 라인 갱신
  window.addEventListener('resize', () => {
    updateJourneyLine(currentActiveIndex, travelData.length);
    if(rainInterval) {
      rainCanvas.width = rainCanvas.clientWidth;
      rainCanvas.height = rainCanvas.clientHeight;
    }
  });

});
