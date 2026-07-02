# 외부 라이브러리 및 플러그인 (External Libraries & Plugins)

블로그 내 공부 노트의 가독성을 높이고 인터랙티브한 요소를 제공하기 위해 사용하는 서드파티 라이브러리 목록입니다.
새로운 기능이 필요할 때 이 문서를 확인하고 일관된 버전과 방식을 사용해 주세요.

모든 라이브러리는 가급적 **CDN을 통해 지연 로드(defer)**하여 초기 페이지 로딩 속도에 영향을 주지 않도록 구성합니다.

---

## 1. 구문 강조 (Syntax Highlighting) - Prism.js

코드 블록(`pre > code`)의 가독성을 높여줍니다. 다크 모드에 어울리는 `Okaidia` 테마를 기본으로 사용합니다.

**추가 방법 (HTML Header/Footer):**
```html
<!-- CSS (head 내) -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css" rel="stylesheet" />

<!-- JS (body 닫기 전) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js" defer></script>
```

**사용 예제:**
```html
<pre><code class="language-python">
def encrypt(data):
    return "encrypted"
</code></pre>
```

---

## 2. 수식 렌더링 (Math Rendering) - KaTeX

정수론, 암호학의 수학 공식을 빠르게 렌더링합니다. MathJax보다 정적 렌더링 속도가 훨씬 빠릅니다.

**추가 방법 (HTML Header/Footer):**
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
<!-- JS -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
```

**사용 예제:**
```html
<!-- 인라인 수식 -->
<p>이것은 \( E = mc^2 \) 입니다.</p>
<!-- 블록 수식 -->
<p>$$ a^2 + b^2 = c^2 $$</p>
```

---

## 3. 다이어그램 생성 - Mermaid.js

텍스트로 구조도, 시퀀스 다이어그램, 아키텍처를 그릴 수 있습니다.

**추가 방법:**
```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  });
</script>
```

**사용 예제:**
```html
<div class="mermaid">
  graph TD;
      A[Client] -->|Request| B(Server);
      B --> C{Database};
</div>
```

---

## 4. 데이터 시각화 - Chart.js

성능 그래프, 타이밍 공격 레이턴시 등을 동적인 차트로 보여줍니다.

**추가 방법:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**사용 예제:**
```html
<canvas id="myChart" width="400" height="200"></canvas>
<script>
  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'B'],
      datasets: [{ label: '# of Votes', data: [12, 19] }]
    }
  });
</script>
```

---

## 5. 알고리즘 애니메이션 - Anime.js

시저 암호, AES 라운드 등 암호학 알고리즘 동작을 시각화하기 위한 경량 웹 애니메이션 엔진입니다.

**추가 방법:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js" defer></script>
```

**사용 예제:**
```html
<div class="box" style="width:50px; height:50px; background:red;"></div>
<script>
  // DOM 로드 후 실행
  anime({
    targets: '.box',
    translateX: 250,
    duration: 1000,
    easing: 'easeInOutQuad'
  });
</script>
```
