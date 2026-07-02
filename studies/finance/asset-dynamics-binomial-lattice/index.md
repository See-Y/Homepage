# 자산가격의 동학과 이항격자모형

## 왜 자산가격의 "동학" 모델이 필요한가

지금까지의 노트들은 채권 가격, 선도·선물·스왑처럼 현금흐름이 확정되어 있거나 결정론적 구조를 가진 자산을 다뤘다. 그러나 실제 다기간 투자는 가치가 끊임없이 변동하고, 배당이 불확실하며, 금리 환경도 변하는 등 여러 불확실성에 노출되어 있다. 옵션 가격결정이나 동적 포트폴리오 이론을 공부하려면, 먼저 <strong>자산 가격이 시간에 따라 어떻게 확률적으로 움직이는가</strong>를 수학적으로 정교하게 모델링해야 한다. 이 노트는 그 출발점이다.

자산가격 동학을 표현하는 방법은 크게 두 갈래다.

- <strong>이항격자모형(binomial lattice model)</strong>: 매 기간 가격이 두 값 중 하나로만 움직인다고 가정하는 이산시간 모형. 분석이 단순하고 계산에 적합해, 실무 투자문제의 상당수가 이 틀 안에서 풀린다.
- <strong>이토 과정(Ito process)</strong>: 매 기간 가격이 연속적인 값의 범위를 가질 수 있다고 가정하는 연속시간 모형. 더 사실적이며 일부 문제는 해석적으로 풀 수 있다. 이항격자모형을 일관되게 구성하는 이론적 토대이기도 하다.

이 노트에서는 이항격자모형을 중심으로 다루되, 그 배후에 있는 무작위보행(random walk), 위너 과정(Wiener process), 기하브라운운동(geometric Brownian motion)까지 순서대로 쌓아 올린다.

## 이항격자모형 (Binomial Lattice Model)

이항격자모형을 정의하려면 먼저 기본 기간 길이(예: 1주일)를 정한다. 이 모형에 따르면, 어떤 기간 초의 가격을 알고 있을 때 다음 기간 초의 가격은 오직 두 값 중 하나다. 이 두 값은 통상 직전 가격의 배수로 정의된다 — 상승 배율 \\(u\\)(up)와 하락 배율 \\(d\\)(down). \\(u\\)와 \\(d\\)는 모두 양수이며 \\(u > 1\\), (보통) \\(d < 1\\)이다.

현재 가격이 \\(S\\)라면, 다음 기간에는 확률 \\(p\\)로 \\(uS\\), 확률 \\(1-p\\)로 \\(dS\\)가 된다 (\\(0 < p < 1\\)). 이 과정이 여러 기간에 걸쳐 반복된다.

이때 가격은 "나무(tree)"가 아니라 <strong>격자(lattice)</strong> 구조로 움직인다는 점이 핵심이다. 상승 후 하락과 하락 후 상승은 둘 다 가격에 \\(ud\\)를 곱한 것과 같아서 같은 노드로 합쳐지기 때문이다. 언뜻 보면 매 기간 두 값만 가능하다는 점에서 지나치게 단순해 보이지만, 기간을 잘게 쪼개어 여러 스텝을 진행하면 도달 가능한 가격의 가짓수가 빠르게 늘어나 현실적인 가격 분포에 가까워진다.

### 격자의 단계적 확장 (애니메이션)

아래는 이항격자가 1기 → 2기 → 3기로 확장되는 과정을 보여준다. 각 노드는 그 시점에서 가능한 가격이며, 위쪽 간선은 상승(\\(\times u\\)), 아래쪽 간선은 하락(\\(\times d\\))을 의미한다. 3기에서 가운데 노드로 여러 경로가 모이는 것(예: \\(u\\)-\\(d\\)-\\(u\\)와 \\(d\\)-\\(u\\)-\\(u\\)가 같은 \\(Su^2d\\) 노드로 합쳐짐)이 "나무"가 아니라 "격자"인 이유다.

<div class="chart-container" id="lattice-anim-wrap">
<svg viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; max-width:760px; display:block; margin:0 auto;">
  <!-- 간선: 0기 -> 1기 -->
  <line class="lattice-edge edge-gen1" x1="60" y1="210" x2="230" y2="110" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen1" x1="60" y1="210" x2="230" y2="310" stroke="#B08D57" stroke-width="2" opacity="0"></line>

  <!-- 간선: 1기 -> 2기 -->
  <line class="lattice-edge edge-gen2" x1="230" y1="110" x2="400" y2="60"  stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen2" x1="230" y1="110" x2="400" y2="210" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen2" x1="230" y1="310" x2="400" y2="210" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen2" x1="230" y1="310" x2="400" y2="360" stroke="#B08D57" stroke-width="2" opacity="0"></line>

  <!-- 간선: 2기 -> 3기 -->
  <line class="lattice-edge edge-gen3" x1="400" y1="60"  x2="570" y2="20"  stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen3" x1="400" y1="60"  x2="570" y2="135" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen3" x1="400" y1="210" x2="570" y2="135" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen3" x1="400" y1="210" x2="570" y2="285" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen3" x1="400" y1="360" x2="570" y2="285" stroke="#B08D57" stroke-width="2" opacity="0"></line>
  <line class="lattice-edge edge-gen3" x1="400" y1="360" x2="570" y2="400" stroke="#B08D57" stroke-width="2" opacity="0"></line>

  <!-- 0기 노드 -->
  <circle class="lattice-node node-gen0" cx="60" cy="210" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen0" x="60" y="215" text-anchor="middle" font-size="13" fill="#fff" opacity="0">S</text>

  <!-- 1기 노드 -->
  <circle class="lattice-node node-gen1" cx="230" cy="110" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen1" x="230" y="115" text-anchor="middle" font-size="12" fill="#fff" opacity="0">Su</text>
  <circle class="lattice-node node-gen1" cx="230" cy="310" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen1" x="230" y="315" text-anchor="middle" font-size="12" fill="#fff" opacity="0">Sd</text>

  <!-- 2기 노드 -->
  <circle class="lattice-node node-gen2" cx="400" cy="60"  r="26" fill="#60A5FA" opacity="0"></circle>
  <text class="lattice-label node-gen2" x="400" y="65" text-anchor="middle" font-size="11" fill="#1e3a8a" opacity="0">Su²</text>
  <circle class="lattice-node node-gen2" cx="400" cy="210" r="26" fill="#60A5FA" opacity="0"></circle>
  <text class="lattice-label node-gen2" x="400" y="215" text-anchor="middle" font-size="11" fill="#1e3a8a" opacity="0">Sud</text>
  <circle class="lattice-node node-gen2" cx="400" cy="360" r="26" fill="#60A5FA" opacity="0"></circle>
  <text class="lattice-label node-gen2" x="400" y="365" text-anchor="middle" font-size="11" fill="#1e3a8a" opacity="0">Sd²</text>

  <!-- 3기 노드 -->
  <circle class="lattice-node node-gen3" cx="570" cy="20"  r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen3" x="570" y="25" text-anchor="middle" font-size="10" fill="#fff" opacity="0">Su³</text>
  <circle class="lattice-node node-gen3" cx="570" cy="135" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen3" x="570" y="140" text-anchor="middle" font-size="10" fill="#fff" opacity="0">Su²d</text>
  <circle class="lattice-node node-gen3" cx="570" cy="285" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen3" x="570" y="290" text-anchor="middle" font-size="10" fill="#fff" opacity="0">Sud²</text>
  <circle class="lattice-node node-gen3" cx="570" cy="400" r="26" fill="#2563EB" opacity="0"></circle>
  <text class="lattice-label node-gen3" x="570" y="405" text-anchor="middle" font-size="10" fill="#fff" opacity="0">Sd³</text>

  <!-- 시점 라벨 -->
  <text x="60"  y="30" text-anchor="middle" font-size="13" fill="#8a7250">t=0</text>
  <text x="230" y="30" text-anchor="middle" font-size="13" fill="#8a7250">t=1</text>
  <text x="400" y="30" text-anchor="middle" font-size="13" fill="#8a7250">t=2</text>
  <text x="570" y="30" text-anchor="middle" font-size="13" fill="#8a7250">t=3</text>
</svg>
<p class="chart-caption">이항격자의 단계적 확장. 0기 노드 하나에서 시작해 매 기간 위(×u)/아래(×d) 두 갈래로 갈라지며, 서로 다른 경로가 같은 가격 노드로 재결합하는 모습(격자 구조)을 확인할 수 있다.</p>
</div>

### u, d, p의 결정: 모멘트 매칭

모형을 완전히 규정하려면 \\(u\\), \\(d\\), \\(p\\)의 값을 정해야 한다. 이 값들은 실제 주식의 확률적 성질을 최대한 충실히 반영하도록 선택되어야 한다. 모형이 승법적(multiplicative)이므로(다음 값이 \\(uS\\) 또는 \\(dS\\)) 가격은 결코 음수가 될 수 없고, 따라서 <strong>가격의 로그</strong>를 기본 변수로 다루는 것이 자연스럽다.

연간 기대성장률 \\(\nu\\)와 연간 표준편차 \\(\sigma\\)를 다음과 같이 정의한다 ( \\(S_0\\)는 초기 가격, \\(S_T\\)는 1년 뒤 가격).

$$
\nu = \mathrm{E}\big[\ln(S_T/S_0)\big], \qquad \sigma^2 = \mathrm{var}\big[\ln(S_T/S_0)\big]
$$

기간 길이 \\(\Delta t\\)가 1에 비해 작을 때, 이항격자의 파라미터는 다음과 같이 선택할 수 있다.

$$
p = \frac{1}{2} + \frac{1}{2}\left(\frac{\nu}{\sigma}\right)\sqrt{\Delta t}, \qquad u = e^{\sigma\sqrt{\Delta t}}, \qquad d = e^{-\sigma\sqrt{\Delta t}}
$$

이렇게 선택하면 이항모형에서 \\(\ln S\\)의 기대성장률과 분산이 각각 \\(\nu\\), \\(\sigma^2\\)에 가깝게 일치하며, \\(\Delta t\\)를 작게 할수록 일치도가 개선되어 \\(\Delta t \to 0\\)에서 정확히 일치한다.

<strong>예제 1 (변동성 있는 주식)</strong>: 연 기대성장률 \\(\nu = 15\%\\), 연 변동성 \\(\sigma = 30\%\\)인 주식을 주 단위(1주 = \\(\Delta t = 1/52\\))로 이항격자를 구성하면

$$
u = e^{.30/\sqrt{52}} = 1.04248, \qquad d = 1/u = .95925
$$

$$
p = \frac{1}{2}\left(1 + \frac{.15}{.30}\sqrt{\frac{1}{52}}\right) = .534669
$$

초기 가격 \\(S(0) = 100\\)으로 놓고 이 값을 5기간 전개하면 다음과 같은 격자가 만들어진다 (단위: 원/달러 표기 없이 지수 값).

| 기간 | 가능한 가격들 (내림차순) |
|---|---|
| 0 | 100 |
| 1 | 104.25, 95.93 |
| 2 | 108.67, 100, 92.02 |
| 3 | 113.29, 104.25, 95.93, 88.27 |
| 4 | (생략) |
| 5 | 118.11, 108.67, 100, 92.02, 84.67 |

가장 위쪽 경로(5연속 상승)는 \\(100 \times u^5 = 100 \times 1.04248^5 \approx 118.11\\), 가장 아래쪽 경로(5연속 하락)는 \\(100 \times d^5 \approx 84.67\\)이다. 중간의 \\(Su^kd^{5-k}\\) 노드들은 상승 \\(k\\)회·하락 \\(5-k\\)회를 거친 모든 경로가 공유하는 값이며, 그 확률은 이항분포 \\(\binom{5}{k}p^k(1-p)^{5-k}\\)로 주어진다. \\(n\\)이 커질수록 이 이항분포는 근사적으로 정규분포에 가까워지고, 최종 가격의 로그는 \\(k\\)에 대해 선형이므로 최종 가격의 분포는 근사적으로 로그정규분포가 된다.

## 이산시간 연속가격 모형: 가산모형과 승법모형

이항격자모형이 "두 값만 가능"한 이산 모형이라면, 이제 가격이 연속적인 값의 범위를 가질 수 있는 모형으로 넘어간다. 시점 \\(k = 0, 1, \ldots, N\\)에서 가격 \\(S(k)\\)를 생각하자.

### 가산모형 (Additive Model)

가장 단순한 모형은 <strong>가산모형</strong>이다.

$$
S(k+1) = aS(k) + u(k)
$$

여기서 \\(a\\)는 상수(보통 \\(a>1\\))이고 \\(u(k)\\)는 서로 통계적으로 독립인 확률변수("충격"이나 "교란")다. 직접 대입해보면

$$
S(1) = aS(0) + u(0), \quad S(2) = a^2S(0) + au(0) + u(1)
$$

일반적으로

$$
S(k) = a^k S(0) + a^{k-1}u(0) + a^{k-2}u(1) + \cdots + u(k-1)
$$

이 성립한다. \\(u(k)\\)들이 독립인 정규확률변수(공통분산 \\(\sigma^2\\))라면, 정규확률변수의 선형결합도 정규분포이므로 \\(S(k)\\) 자체도 정규확률변수가 된다. 모든 \\(u(k)\\)의 기댓값이 0이면 \\(\mathrm{E}[S(k)] = a^kS(0)\\)이며, \\(a>1\\)일 때 가격의 기댓값은 \\(a^k\\)에 따라 기하급수적으로 증가한다.

가산모형은 구조가 단순하고 다루기 쉽지만 <strong>현실성이 떨어진다는 결정적 결함</strong>이 있다: 정규확률변수는 음수 값도 취할 수 있으므로 이 모형의 가격도 음수가 될 수 있는데, 실제 주가는 결코 음수가 되지 않는다. 또한 주가가 \\(\$1\\)에서 시작해 \\(\sigma\\)가 \\(\$50\\) 정도인 채로 \\(\$100\\)까지 상승했다면, 그 사이 표준편차가 계속 \\(\$50\\)으로 고정되어 있다고 보기는 어렵다 — 표준편차는 가격 수준에 비례하는 것이 더 자연스럽다. 이런 이유로 가산모형은 단독으로 장기·중기 자산가격을 표현하는 모형으로는 부적합하며, 짧은 기간(일반 주식이라면 길어야 몇 달)의 국지적 분석이나 다른 모형의 구성요소로만 유용하다.

### 승법모형 (Multiplicative Model)

더 나은 대안은 <strong>승법모형</strong>이다.

$$
S(k+1) = u(k)S(k)
$$

여기서 \\(u(k)\\)는 시점 \\(k\\)와 \\(k+1\\) 사이의 <strong>상대적 가격 변화</strong> \\(S(k+1)/S(k)\\)를 정의하며, \\(S(k)\\)의 크기나 가격 단위와 무관하다(예: 달러를 마르크로 바꿔도 \\(u(k)\\)는 그대로다). 양변에 자연로그를 취하면

$$
\ln S(k+1) = \ln S(k) + \ln u(k)
$$

즉 \\(\ln S(k)\\)에 대해서는 가산모형과 같은 형태가 된다. 여기서 교란을 \\(w(k) = \ln u(k)\\)로 직접 정의하고, 이 \\(w(k)\\)들이 평균 \\(\nu\\), 분산 \\(\sigma^2\\)인 독립 정규확률변수라고 가정하면

$$
u(k) = e^{w(k)}
$$

이 되어 \\(u(k)\\)는 <strong>로그정규(lognormal)</strong> 확률변수다. 로그는 음수일 수 있어도 그 지수함수 값은 항상 양수이므로, 가격을 곱하는 인자 \\(u(k)\\)가 항상 양수가 되어 <strong>가격이 결코 음수가 되지 않는다</strong>는 현실적인 성질을 얻는다.

### 로그정규 가격

승법모형을 반복 적용하면

$$
S(k) = u(k-1)u(k-2)\cdots u(0)S(0)
$$

양변에 로그를 취하면

$$
\ln S(k) = \ln S(0) + \sum_{i=0}^{k-1} \ln u(i) = \ln S(0) + \sum_{i=0}^{k-1} w(i)
$$

정규확률변수의 합은 정규분포이므로 \\(\ln S(k)\\)는 정규분포를 따르고, 따라서 <strong>모든 가격 \\(S(k)\\)는 로그정규분포</strong>를 따른다. 각 \\(w(i)\\)가 평균 \\(\nu\\), 분산 \\(\sigma^2\\)이고 서로 독립이라면

$$
\mathrm{E}[\ln S(k)] = \ln S(0) + \nu k, \qquad \mathrm{var}[\ln S(k)] = k\sigma^2
$$

즉 \\(\ln S(k)\\)의 기댓값과 분산은 모두 \\(k\\)에 <strong>선형으로</strong> 증가한다.

### 실제 주가는 로그정규분포에 얼마나 가까운가

과거 주가 기록을 분석해보면, 대부분 주식의 가격 분포는 로그정규분포에 상당히 가깝다. 일정 기간(예: 1주)마다 \\(\ln S(k+1) - \ln S(k)\\)(로그수익률)를 오랜 기간에 걸쳐 기록하고 히스토그램을 그려 같은 분산의 정규분포와 비교하면, 대체로 정규분포에 가깝지만 관측 분포가 평균 근처에서는 약간 낮고 극단값(양쪽 꼬리)에서는 정규분포보다 더 두텁게 나타나는 경향이 있다. 이 현상을 <strong>팻 테일(fat tails)</strong>이라 부르며, 큰 폭의 가격 변동이 정규분포가 예측하는 것보다 다소 더 자주 일어난다는 뜻이다. 대부분의 응용에서는 이 정도 괴리는 무시할 만하지만, 극단적 리스크를 다룰 때는 주의가 필요하다.

### 전형적인 파라미터 값

주식 수익률의 로그 \\(w(k) = \ln u(k)\\)의 평균 \\(\nu\\)와 표준편차 \\(\sigma\\)는, 기간 길이가 1년일 때 전형적으로

$$
\nu = 12\%, \qquad \sigma = 15\%
$$

정도의 값을 가진다. 기간 길이가 1년의 \\(p\\)만큼(\\(p<1\\))으로 짧아지면 다음과 같이 스케일이 조정된다.

$$
\nu_p = p\,\nu, \qquad \sigma_p = \sqrt{p}\,\sigma
$$

과거 데이터 \\(N+1\\)개 시점(즉 \\(N\\)개 기간)이 있을 때 표준적인 추정량은

$$
\hat\nu = \frac{1}{N}\sum_{k=0}^{N-1}\Big[\ln S(k+1) - \ln S(k)\Big] = \frac{1}{N}\ln\!\left[\frac{S(N)}{S(0)}\right]
$$

즉 \\(\hat\nu\\)는 결국 <strong>마지막 가격과 처음 가격의 비율</strong>만으로 결정된다(중간 경로는 무관). 분산의 추정량은

$$
\hat\sigma^2 = \frac{1}{N-1}\sum_{k=0}^{N-1}\left\{\ln\!\left[\frac{S(k+1)}{S(k)}\right] - \hat\nu\right\}^2
$$

이 추정량들의 오차는 \\(\mathrm{var}(\hat\nu) = \sigma^2/N\\), \\(\mathrm{var}(\hat\sigma^2) = 2\sigma^4/(N-1)\\)로 주어진다. \\(\nu = .12\\), \\(\sigma = .15\\)라면, \\(\hat\nu\\)의 표준편차를 \\(.05\\)까지 줄이려면 <strong>10년치</strong> 데이터가 필요하다 — 이는 참값의 상당한 비율에 해당하는 여전히 큰 오차다. 반면 \\(\sigma^2\\)는 <strong>단 1년치</strong> 주간 데이터만으로도 꽤 좋은 추정치를 얻을 수 있다. 이는 평균(성장률) 추정이 분산(변동성) 추정보다 본질적으로 훨씬 어렵다는 것을 보여준다.

## 로그정규 확률변수의 성질

\\(u\\)가 로그정규 확률변수라면 \\(w = \ln u\\)는 정규분포를 따른다. 로그정규분포는 항상 0 이상의 값만 가지며 오른쪽으로 약간 치우친(skewed) 모양을 갖는다.

\\(w\\)가 평균 \\(\bar w\\), 분산 \\(\sigma^2\\)인 정규확률변수라 하자. \\(u = e^w\\)의 기댓값은 얼핏 \\(\bar u = e^{\bar w}\\)일 것 같지만 이는 <strong>틀린 직관</strong>이다. 실제로는

$$
\bar u = e^{\bar w + \frac{1}{2}\sigma^2}
$$

으로, \\(e^{\bar w}\\)보다 \\(e^{\frac{1}{2}\sigma^2}\\)배만큼 더 크다. 직관적으로는, \\(\sigma\\)가 커질수록 로그정규분포는 아래쪽(0)으로는 더 이상 퍼질 수 없지만 위쪽으로는 무한히 퍼질 수 있으므로, 평균값이 \\(\sigma\\)가 커질수록 함께 커진다고 이해할 수 있다.

<strong>예제 2</strong>: 연간 \\(\bar w = .12\\), 연간 \\(\sigma = .15\\)인 주식이라면 보정항은 \\(\frac{1}{2}\sigma^2 = \frac{1}{2}(.15)^2 = .0225\\)로, \\(\bar w = .12\\)에 비해 작은 값이다. 그러나 변동성이 큰 주식일수록 이 보정항은 무시할 수 없이 커진다.

## 무작위보행과 위너 과정

승법모형의 기간 길이를 0으로 보내는 극한을 취하면 연속시간 모형을 얻는다. 이를 위한 준비로 <strong>무작위보행(random walk)</strong>과 <strong>위너 과정(Wiener process)</strong>을 도입한다.

길이 \\(\Delta t\\)인 \\(N\\)개 기간이 있다고 하자. 가산과정 \\(z\\)를 다음과 같이 정의한다.

$$
z(t_{k+1}) = z(t_k) + \epsilon(t_k)\sqrt{\Delta t}, \qquad t_{k+1} = t_k + \Delta t
$$

여기서 \\(\epsilon(t_k)\\)는 평균 0, 분산 1인 정규확률변수(<strong>표준화 정규확률변수</strong>)이며 서로 비상관이다 (\\(\mathrm{E}[\epsilon(t_j)\epsilon(t_k)] = 0,\ j\ne k\\)). 이 과정을 <strong>무작위보행</strong>이라 하며, \\(z(t_0)=0\\)에서 출발해 \\(\epsilon(t_k)\\)의 무작위성에 따라 경로가 흔들리며 나아간다.

두 시점 사이의 차이 \\(z(t_k) - z(t_j)\ (j<k)\\)는

$$
z(t_k) - z(t_j) = \sum_{i=j}^{k-1}\epsilon(t_i)\sqrt{\Delta t}
$$

로, 정규확률변수들의 합이므로 그 자체도 정규분포를 따른다. 이 차이의 평균과 분산을 계산하면

$$
\mathrm{E}[z(t_k)-z(t_j)] = 0
$$

$$
\mathrm{var}[z(t_k)-z(t_j)] = \mathrm{E}\left[\sum_{i=j}^{k-1}\epsilon(t_i)\sqrt{\Delta t}\right]^2 = \sum_{i=j}^{k-1}\mathrm{E}[\epsilon(t_i)^2]\,\Delta t = (k-j)\Delta t = t_k - t_j
$$

즉 <strong>차이의 분산은 두 시점 사이의 시간 간격과 정확히 같다.</strong> 이 성질을 얻기 위해 정의식에서 \\(\sqrt{\Delta t}\\)를 곱해준 것이다. 또한 겹치지 않는 두 구간의 차이 확률변수는 서로 비상관이다.

\\(\Delta t \to 0\\) 극한을 취하면 <strong>위너 과정</strong>을 얻는다. 기호적으로

$$
dz = \epsilon(t)\sqrt{dt}
$$

로 쓰며, 여기서 \\(\epsilon(t)\\)는 표준화 정규확률변수이고 \\(t' \ne t''\\)일 때 \\(\epsilon(t')\\)와 \\(\epsilon(t'')\\)는 비상관이다. 더 엄밀하게는, 과정 \\(z(t)\\)가 다음 세 조건을 만족할 때 이를 위너 과정(또는 <strong>브라운운동, Brownian motion</strong>)이라 정의한다.

1. 임의의 \\(s<t\\)에 대해 \\(z(t)-z(s)\\)는 평균 0, 분산 \\(t-s\\)인 정규확률변수다.
2. 임의의 \\(0 \le t_1 < t_2 \le t_3 < t_4\\)에 대해 \\(z(t_2)-z(t_1)\\)과 \\(z(t_4)-z(t_3)\\)는 비상관이다.
3. \\(z(t_0)=0\\)이 확률 1로 성립한다.

위너 과정은 시간에 대해 연속이지만 미분 가능하지 않다. \\(t<s\\)일 때

$$
\mathrm{E}\left[\frac{z(s)-z(t)}{s-t}\right]^2 = \frac{s-t}{(s-t)^2} = \frac{1}{s-t} \to \infty \quad (s\to t)
$$

이므로 미분이 존재하지 않음을 확인할 수 있다. 그럼에도 \\(dz/dt\\)라는 표현은 여러 확률미분방정식에서 자주 등장하며, 이를 <strong>백색잡음(white noise)</strong>이라 부른다.

### 일반화된 위너 과정과 이토 과정

위너 과정(브라운운동)은 더 일반적인 여러 과정의 기본 구성요소다. 이런 일반화는 상미분방정식에 백색잡음을 삽입해 얻는다. 가장 단순한 형태는 <strong>일반화된 위너 과정</strong>이다.

$$
dx(t) = a\,dt + b\,dz
$$

여기서 \\(x(t)\\)는 각 \\(t\\)마다 확률변수이고, \\(z\\)는 위너 과정, \\(a\\)와 \\(b\\)는 상수다. 이 과정은 양변을 적분해 해석적 해를 구할 수 있다는 점에서 특히 중요하다.

$$
x(t) = x(0) + at + bz(t)
$$

<strong>이토 과정(Ito process)</strong>은 이보다 조금 더 일반적인 형태다.

$$
dx(t) = a(x,t)\,dt + b(x,t)\,dz
$$

이번에는 계수 \\(a(x,t)\\)와 \\(b(x,t)\\)가 \\(x\\)와 \\(t\\)에 의존할 수 있으며, 일반적으로 해석적인 해를 쓸 수 없다. 금융자산의 움직임을 나타내는 데에는 이토 과정의 특수한 형태가 자주 쓰인다.

## 주가 과정: 기하브라운운동

승법모형을 연속시간으로 확장하면 다음을 얻는다. 이산형 승법모형은

$$
\ln S(k+1) - \ln S(k) = w(k)
$$

였는데, 이것의 연속시간 버전은

$$
d\ln S(t) = \nu\,dt + \sigma\,dz
$$

이다. 여기서 \\(\nu \ge 0\\), \\(\sigma \ge 0\\)는 상수이고 \\(z\\)는 표준 위너 과정이다. 이 방정식은 \\(\ln S(t)\\)에 대한 일반화된 위너 과정이므로 앞의 결과를 그대로 적용해 명시적인 해를 구할 수 있다.

$$
\ln S(t) = \ln S(0) + \nu t + \sigma z(t)
$$

따라서 \\(\mathrm{E}[\ln S(t)] = \ln S(0) + \nu t\\)로, \\(\ln S(t)\\)의 기댓값은 \\(t\\)에 대해 선형으로 증가한다. 이는 마치 연속복리 예금계좌처럼 증가한다는 뜻에서, 이 과정을 <strong>기하브라운운동(geometric Brownian motion)</strong>이라 부른다.

### 로그정규 가격 (연속시간)

이산시간 승법모형과 마찬가지로, 식 \\(d\ln S(t) = \nu\,dt + \sigma\,dz\\)로 기술되는 기하브라운운동 과정도 로그정규 과정이다. 해 \\(\ln S(t) = \ln S(0) + \nu t + \sigma z(t)\\)의 우변은 평균 \\(\ln S(0) + \nu t\\), 표준편차 \\(\sigma\sqrt{t}\\)인 정규확률변수이므로

$$
\ln S(t) \sim N\big(\ln S(0) + \nu t,\ \sigma^2 t\big)
$$

가 성립하고, 가격 \\(S(t)\\) 자체는 로그정규분포를 따른다. \\(S(t) = \exp[\ln S(t)] = S(0)\exp[\nu t + \sigma z(t)]\\)라고 쓸 수 있지만, 이로부터 \\(\mathrm{E}[S(t)] = S(0)e^{\nu t}\\)라고 결론짓는 것은 <strong>틀린 계산</strong>이다. 로그정규확률변수의 기댓값 공식 \\(\bar u = e^{\bar w + \frac12\sigma^2}\\)을 적용해야 하므로

$$
\mathrm{E}[S(t)] = S(0)\,e^{(\nu + \frac{1}{2}\sigma^2)t}
$$

\\(\mu = \nu + \frac{1}{2}\sigma^2\\)로 정의하면 \\(\mathrm{E}[S(t)] = S(0)e^{\mu t}\\)로 간결하게 쓸 수 있다. \\(S(t)\\)의 표준편차 역시 로그정규분포의 일반 공식으로부터

$$
\mathrm{stdev}[S(t)] = S(0)\,e^{\nu t + \frac{1}{2}\sigma^2 t}\big(e^{\sigma^2 t}-1\big)^{1/2}
$$

### 표준 이토 형태

지금까지는 \\(\ln S(t)\\)에 대한 과정으로 표현했는데, \\(S(t)\\) 자신에 대한 식으로 바꿔 쓰는 편이 유용할 때가 많다. 통상적인 미적분이라면 \\(d\ln[S(t)] = dS(t)/S(t)\\)이므로 단순히 대입하면 될 것 같지만, 이렇게 하면 틀린다 — 이토 과정에서 변수를 바꿀 때는 <strong>보정항</strong>이 필요하다 (위너 과정은 일반적인 함수가 아니라 통상적인 미적분 규칙을 따르지 않기 때문). 올바른 이토 과정은

$$
\frac{dS(t)}{S(t)} = \left(\nu + \frac{1}{2}\sigma^2\right)dt + \sigma\,dz
$$

이다. 보정항 \\(\frac{1}{2}\sigma^2\\)는 앞서 로그정규확률변수의 기댓값 공식에 등장한 것과 정확히 같은 항이다. \\(\mu = \nu + \frac{1}{2}\sigma^2\\)로 놓으면 가격 동학의 <strong>표준 이토 형태(standard Ito form)</strong>를 얻는다.

$$
\frac{dS(t)}{S(t)} = \mu\,dt + \sigma\,dz
$$

\\(dS(t)/S(t)\\)는 주식의 <strong>미분수익률(differential return)</strong>로 해석할 수 있으며, 이 형태로 쓰면 미분수익률이 아주 단순한 식이 된다. \\(S\\)가 분모에 있는 형태이므로 이 방정식을 "순간수익률(instantaneous return)에 대한 방정식"이라고도 부른다.

<strong>예제 3 (채권 가격 동학)</strong>: 만기 \\(t=T\\)에 \\(\$1\\)를 지급하고 다른 지급은 없는 채권의 가격을 \\(P(t)\\)라 하고, 금리가 상수 \\(r\\)로 일정하다고 하자. 이 채권 가격은

$$
\frac{dP(t)}{P(t)} = r\,dt
$$

를 만족하는데, 이는 확률항이 없는 <strong>결정론적</strong> 이토 방정식으로, 주가 방정식과 형태적으로 병렬을 이룬다. 해는 \\(P(t) = P(0)e^{rt}\\)이고, 만기 조건 \\(P(T)=1\\)을 적용하면 \\(P(t) = e^{r(t-T)}\\)를 얻는다.

정리하면, 기하브라운운동 \\(dS(t) = \mu S(t)\,dt + \sigma S(t)\,dz\\)를 따르는 과정에 대해 \\(\nu = \mu - \frac{1}{2}\sigma^2\\)로 정의할 때

$$
\mathrm{E}\{\ln[S(t)/S(0)]\} = \nu t, \qquad \mathrm{stdev}\{\ln[S(t)/S(0)]\} = \sigma\sqrt{t}
$$

$$
\mathrm{E}\{S(t)/S(0)\} = e^{\mu t}, \qquad \mathrm{stdev}\{S(t)/S(0)\} = e^{\mu t}\big(e^{\sigma^2 t}-1\big)^{1/2}
$$

### 시뮬레이션: 두 가지 방법

연속시간 가격 과정은 짧은 시간 구간을 여러 번 진행시키며 시뮬레이션할 수 있다. 이때 정확히 동등하지 않은 두 가지 자연스러운 방법이 있다.

<strong>방법 1 (표준형 기반)</strong>: 기본 기간 길이 \\(\Delta t\\)를 정하고 \\(S(t_0)=S_0\\)로 놓으면, 시뮬레이션 식은

$$
S(t_{k+1}) - S(t_k) = \mu S(t_k)\Delta t + \sigma S(t_k)\epsilon(t_k)\sqrt{\Delta t}
$$

$$
S(t_{k+1}) = \big[1 + \mu\,\Delta t + \sigma\epsilon(t_k)\sqrt{\Delta t}\big]S(t_k)
$$

이는 승법모형이지만, 무작위 계수가 로그정규가 아니라 정규 분포를 가지므로 근본이 되는 이토 과정이 갖는 로그정규 가격분포를 정확히 재현하지는 못한다.

<strong>방법 2 (로그형 기반)</strong>: 로그(또는 승법) 형태를 이산화하면

$$
\ln S(t_{k+1}) - \ln S(t_k) = \nu\,\Delta t + \sigma\epsilon(t_k)\sqrt{\Delta t}
$$

$$
S(t_{k+1}) = e^{\nu\Delta t + \sigma\epsilon(t_k)\sqrt{\Delta t}}\,S(t_k)
$$

이 역시 승법모형이지만 이번에는 무작위 계수가 로그정규다.

두 방법은 스텝별로는 다른 값을 내지만, 그 차이는 장기적으로는 서로 상쇄되는 경향이 있어 실무적으로는 어느 쪽을 써도 큰 차이가 없다.

<strong>예제 4 (두 방법에 의한 시뮬레이션)</strong>: 초기가 \\(\$10\\), \\(\nu=15\%\\), \\(\sigma=40\%\\)인 주식을 기본 구간 1주(\\(\Delta t=1/52\\))로 잡아 1년간 시뮬레이션한다. 같은 난수열 \\(\epsilon\\)을 두 방법에 동일하게 적용했을 때의 결과 일부는 다음과 같다.

| 주 | \\(\epsilon\\) | \\(\mu\Delta t+\sigma\,dz\\) | \\(P_1\\) (방법1) | \\(\nu\Delta t+\sigma\,dz\\) | \\(P_2\\) (방법2) |
|---|---|---|---|---|---|
| 0 | — | — | 10.0000 | — | 10.0000 |
| 1 | .06476 | .00802 | 10.0802 | .00648 | 10.0650 |
| 5 | -.33892 | -.01438 | 9.7557 | -.01592 | 9.6951 |
| 13 | .80590 | .04913 | 12.3261 | .04759 | 12.2049 |
| 26 | -1.23335 | -.06399 | 13.1428 | -.06553 | 12.9157 |
| 52 | .69955 | .04323 | 15.1230 | .04169 | 14.7564 |

1주차부터 두 방법의 결과(\\(P_1 = 10.0802\\) vs \\(P_2=10.0650\\))가 서로 다르지만, 52주 후에도 \\(15.12\\)와 \\(14.76\\)로 비슷한 수준을 유지하는 것을 볼 수 있다 — 스텝별로는 다르지만 전체적으로는 상당히 근접한 결과를 낸다는 앞선 서술을 수치로 확인할 수 있다.

## 이토의 보조정리 (Ito's Lemma)

\\(S(t)\\)에 대한 이토 방정식과 \\(\ln S(t)\\)에 대한 이토 방정식이 서로 다르고, 그 차이가 \\(S(t)\\)에서 \\(\ln S(t)\\)로 변수를 바꾸는 통상적 미적분 계산에서 기대되는 것과 정확히 일치하지 않는다는 것(추가 항 \\(\frac{1}{2}\sigma^2\\) 필요)을 앞서 확인했다. 이런 변수 변환을 일반적으로 다루는 체계적 방법이 바로 <strong>이토의 보조정리</strong>다.

<strong>이토의 보조정리</strong>: 확률과정 \\(x\\)가 이토 과정

$$
dx(t) = a(x,t)\,dt + b(x,t)\,dz
$$

를 따르고(\\(z\\)는 표준 위너 과정), 과정 \\(y(t) = F(x,t)\\)가 정의된다면, \\(y(t)\\)는 다음 이토 방정식을 만족한다.

$$
dy(t) = \left(\frac{\partial F}{\partial x}a + \frac{\partial F}{\partial t} + \frac{1}{2}\frac{\partial^2 F}{\partial x^2}b^2\right)dt + \frac{\partial F}{\partial x}b\,dz
$$

통상적인 미적분이라면 \\(\frac{1}{2}\\) 계수가 붙은 항 없이 비슷한 공식을 주었을 것이다. 이 추가항이 생기는 이유는, \\(y\\)를 \\(\Delta y\\)에 대해 전개할 때 \\(\Delta t\\)에 대해서는 1차까지만 남겨도 되지만, \\(\Delta x\\)는 \\(\sqrt{\Delta t}\\) 크기이므로 \\(\Delta x\\)에 대해서는 2차까지 전개해야 하기 때문이다. 전개 과정에서 \\((\Delta x)^2 = a^2(\Delta t)^2 + 2ab\,\Delta t\,\Delta z + b^2(\Delta z)^2\\)의 세 항 중, 앞의 두 항은 \\(\Delta t\\)보다 고차이므로 버릴 수 있지만, \\(b^2(\Delta z)^2\\)항은 기댓값은 0이지만 분산이 \\(\Delta t\\) 오더이기 때문에 버릴 수 없다. \\(\Delta t \to 0\\)의 극한에서 \\((\Delta z)^2\\)은 (확률적이 아니라) \\(\Delta t\\)와 같아짐을 보일 수 있고, 이를 대입하면 위 보조정리의 형태가 얻어진다.

<strong>예제 5 (이토 보조정리의 적용)</strong>: \\(S(t)\\)가 기하브라운운동 \\(dS = \mu S\,dt + \sigma S\,dz\\)를 따른다고 하자. \\(F(S(t)) = \ln S(t)\\)에 이토의 보조정리를 적용해 \\(\ln S\\)가 만족하는 방정식을 구해보자. 여기서 \\(a = \mu S\\), \\(b = \sigma S\\)이며, \\(\partial F/\partial S = 1/S\\), \\(\partial^2 F/\partial S^2 = -1/S^2\\)이다. 보조정리에 대입하면

$$
d\ln S = \left(\frac{a}{S} - \frac{1}{2}\frac{b^2}{S^2}\right)dt + \frac{b}{S}\,dz = \left(\mu - \frac{1}{2}\sigma^2\right)dt + \sigma\,dz
$$

이는 앞서 직접 유도했던 결과 \\(d\ln S = \nu\,dt + \sigma\,dz\ (\nu = \mu - \frac12\sigma^2)\\)와 정확히 일치한다. 이토의 보조정리가 일반적인 변환에도 같은 결과를 재현함을 확인할 수 있다.

## 이항격자모형 다시 보기: u, d, p의 엄밀한 결정

이제 이토 과정에 대한 이해를 바탕으로, 이항격자모형의 파라미터를 조금 더 엄밀하게 유도할 수 있다. 이항격자는 매 스텝 가격에 무작위 변수 \\(u\\) 또는 \\(d\\)를 곱한다는 점에서 승법모형과 유사하다. 다만 무작위 변수가 오직 두 값만 취한다는 점이 다르다.

\\(u\\), \\(d\\), \\(p\\)를 정하는 방법은, <strong>가격 변화 로그값의 기댓값과 분산</strong>을 모두 승법모형(연속시간 극한에서는 기하브라운운동)의 값과 최대한 일치시키는 것이다. 이 매칭은 첫 스텝의 가격 \\(S_1\\)에 대해서만 확인하면 충분하다(이후로도 과정이 동일하게 반복되므로). \\(S(0)=1\\)로 놓으면

$$
\mathrm{E}(\ln S_1) = p\ln u + (1-p)\ln d
$$

$$
\mathrm{var}(\ln S_1) = p(\ln u)^2 + (1-p)(\ln d)^2 - [p\ln u + (1-p)\ln d]^2 = p(1-p)(\ln u - \ln d)^2
$$

따라서 매칭 조건은 \\(U = \ln u\\), \\(D = \ln d\\)로 놓을 때

$$
pU + (1-p)D = \nu\,\Delta t
$$

$$
p(1-p)(U-D)^2 = \sigma^2\Delta t
$$

정할 파라미터는 \\(U\\), \\(D\\), \\(p\\) 셋인데 조건식은 두 개뿐이므로 <strong>자유도가 하나 남는다.</strong> 이 자유도를 활용하는 가장 흔한 방법은 \\(D = -U\\)로 두는 것(즉 \\(d = 1/u\\)). 이 경우 두 조건식은

$$
(2p-1)U = \nu\,\Delta t, \qquad 4p(1-p)U^2 = \sigma^2\Delta t
$$

로 단순화된다. 첫 식을 제곱해 둘째 식에 더하면

$$
U^2 = \sigma^2\Delta t + (\nu\,\Delta t)^2
$$

을 얻고, 이를 첫 식에 대입해 \\(p\\)를 직접 구할 수 있다. 최종 해는 다음과 같다.

$$
p = \frac{1}{2} + \frac{\frac12}{\sqrt{\sigma^2/(\nu^2\Delta t) + 1}}
$$

$$
\ln u = \sqrt{\sigma^2\Delta t + (\nu\,\Delta t)^2}, \qquad \ln d = -\sqrt{\sigma^2\Delta t + (\nu\,\Delta t)^2}
$$

\\(\Delta t\\)가 작을 때는 이 식을 다음과 같이 근사할 수 있다.

$$
p = \frac{1}{2} + \frac{1}{2}\left(\frac{\nu}{\sigma}\right)\sqrt{\Delta t}, \qquad u = e^{\sigma\sqrt{\Delta t}}, \qquad d = e^{-\sigma\sqrt{\Delta t}}
$$

이 근사식이 바로 이 노트의 첫머리(이항격자모형 절)에서 제시했던 파라미터 선택 공식이다. 즉 이항격자모형의 파라미터는 임의로 정한 것이 아니라, <strong>기하브라운운동이 갖는 로그가격의 평균·분산을 최대한 정확히 재현하도록 이론적으로 유도된 값</strong>이라는 점이 이번 절의 핵심이다.

## 정리

자산가격의 동학을 표현하는 두 축은 <strong>이항격자모형</strong>(이산시간, 매 기간 두 값)과 <strong>이토 과정</strong>(연속시간, 연속적인 값의 범위)이다. 이항격자모형에서는 가격이 매 기간 확률 \\(p\\)로 \\(u\\)배, 확률 \\(1-p\\)로 \\(d\\)배 되며, 상승·하락 경로가 재결합하는 격자 구조를 갖는다.

연속가격 모형은 가산모형에서 시작하지만 음의 가격이 가능하다는 결함 때문에, 로그를 가산적으로 다루는 <strong>승법모형</strong> \\(S(k+1)=u(k)S(k)\\)으로 대체된다. 승법모형에서 가격은 항상 <strong>로그정규분포</strong>를 따르며, 실제 주가 데이터도 팻 테일을 제외하면 이 가정에 상당히 부합한다.

승법모형의 기간을 0으로 보내는 극한이 <strong>기하브라운운동</strong> \\(d\ln S = \nu\,dt + \sigma\,dz\\)이며, 이는 <strong>무작위보행</strong>을 연속화한 <strong>위너 과정(브라운운동)</strong> \\(z\\)에 기반한다. \\(S(t)\\) 자체에 대한 표준형은 \\(dS/S = \mu\,dt + \sigma\,dz\\)(\\(\mu = \nu + \frac12\sigma^2\\))이며, 이 둘 사이의 변환에 필요한 보정항은 <strong>이토의 보조정리</strong>로 일반화된다.

마지막으로 이항격자모형의 파라미터 \\(u\\), \\(d\\), \\(p\\)는 임의의 선택이 아니라, 로그가격의 평균과 분산을 기하브라운운동의 \\(\nu\\), \\(\sigma\\)와 일치시키는 <strong>모멘트 매칭</strong>으로부터 엄밀하게 유도된다 — 이 사실이 이항격자모형과 이토 과정(기하브라운운동)을 하나로 잇는 다리이며, 다음 편(옵션의 기초이론)에서 옵션 가격결정의 계산 뼈대로 그대로 재사용된다.
