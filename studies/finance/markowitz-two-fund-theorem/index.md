# Markowitz 모델과 Two-Fund 정리

이전 노트에서는 효율적 프론티어를 정성적으로만 그렸다. 이번 노트에서는 이를 정확한 <strong>최적화 문제</strong>로 정식화한 Harry Markowitz의 1950년대 모델을 다루고, 그로부터 따라나오는 두 개의 우아한 정리 — <strong>Two-Fund 정리</strong>와 <strong>One-Fund 정리</strong> — 를 살펴본다. Markowitz와 이후 이론을 발전시킨 William Sharpe는 이 공로로 1990년 노벨 경제학상을 받았으며, 이 이론 체계를 <strong>현대 포트폴리오 이론(Modern Portfolio Theory, MPT)</strong>이라 부른다.

## Markowitz 모델의 가정

Markowitz 모델은 다음 세 가지를 가정한다.

1. 투자자의 의사결정은 오직 <strong>기대수익률과 분산</strong> 두 값에만 의존한다.
2. 투자자는 <strong>효율적 포트폴리오</strong>를 원한다 — 주어진 기대수익에서 위험 최소, 또는 주어진 위험에서 기대수익 최대.
3. 투자자는 <strong>단일 투자 기간</strong>을 가정한다.

## 이차계획법(QP) 정식화

\\(n\\)개 자산이 있고, 기대수익률 벡터 \\(\mu\\)와 공분산행렬 \\(\Sigma\\)가 주어졌다고 하자. 목표수익 \\(\mu_0\\)을 임의로 고정하고, 그 수익을 달성하면서 분산이 최소인 포트폴리오를 찾는 문제는 다음과 같은 <strong>이차계획법(Quadratic Programming, QP)</strong> 문제가 된다.

$$
\begin{aligned}
\underset{w}{\text{minimize}}\quad & \frac{1}{2} w^T \Sigma w \\
\text{subject to}\quad & w^T \mu \ge \mu_0 \\
& \mathbf{1}^T w = 1
\end{aligned}
$$

여기서 \\(w \in \mathbb{R}^n\\)은 결정변수(포트폴리오 비중벡터), \\(\mathbf{1}\\)은 모든 원소가 1인 벡터다. 공매도를 허용하는 표준 정식화에서는 \\(w_i\\)에 부호 제약이 없다. \\(\mu_0\\)을 바꿔가며 이 문제를 반복해서 풀면, 각 \\(\mu_0\\)에 대응하는 최소분산 포트폴리오들이 바로 이전 노트의 <strong>최소분산집합</strong>을 이룬다.

### 동치 형태

같은 문제를 표현하는 방법이 몇 가지 더 있다. 라그랑주 형태로 쓰면

$$
\underset{w}{\text{minimize}}\quad \frac{1}{2} w^T \Sigma w - \lambda\, w^T \mu \qquad \text{subject to}\quad \mathbf{1}^T w = 1
$$

여기서 \\(\lambda\\)는 <strong>위험선호 파라미터</strong>로 해석할 수 있다 (\\(\lambda\\)가 클수록 수익을 더 중시). 또는 위험 상한을 고정하고 수익을 최대화하는 형태로 쓸 수도 있다.

$$
\underset{w}{\text{maximize}}\quad w^T \mu \qquad \text{subject to}\quad w^T \Sigma w \le \sigma_0^2,\quad \mathbf{1}^T w = 1
$$

세 정식화 모두 같은 최소분산집합(효율적 프론티어를 포함)을 생성한다 — 어떤 파라미터(\\(\mu_0\\), \\(\lambda\\), \\(\sigma_0^2\\))를 고정하고 최적화하느냐만 다를 뿐이다.

## Two-Fund 정리

첫 번째 QP 정식화의 최적조건(KKT 조건에 해당)을 정리하면, 최적해 \\(w\\)는 다음을 만족해야 한다.

$$
\sum_{j=1}^{n} \sigma_{ij} w_j - \lambda \bar r_i - \mu = 0, \quad i=1,\ldots,n \qquad \left(\text{그리고 } \sum_i w_i \bar r_i = \bar r,\ \ \sum_i w_i = 1\right)
$$

이제 이 문제의 서로 다른 두 해 \\(w^1\\)(기대수익 \\(\bar r_1\\))과 \\(w^2\\)(기대수익 \\(\bar r_2\\))가 있다고 하자. 이 둘을 \\(\alpha : (1-\alpha)\\) 비율로 섞은 새 포트폴리오 \\(\alpha w^1 + (1-\alpha) w^2\\)를 생각해보면

- 비중의 합은 여전히 1이다 (\\(\alpha \cdot 1 + (1-\alpha)\cdot 1 = 1\\))
- 기대수익은 \\(\alpha \bar r_1 + (1-\alpha)\bar r_2\\)이다
- 위 최적조건 방정식은 <strong>선형</strong>이므로, \\(w^1\\)과 \\(w^2\\)가 각각 그 식을 0으로 만든다면 둘의 선형결합도 그 식을 0으로 만든다

즉 <strong>두 최소분산 포트폴리오의 임의의 선형결합 역시 최소분산집합에 속한다.</strong> \\(\alpha\\)를 \\(-\infty\\)부터 \\(\infty\\)까지 움직이면, 이 결합 포트폴리오는 최소분산집합 전체를 정확히 쓸어낸다(sweep). 이로부터 다음 정리가 따라나온다.

> <strong>Two-Fund 정리</strong>: 두 개의 효율적 포트폴리오(펀드)를 적절히 구성해두면, 임의의 효율적 포트폴리오를 평균·분산 관점에서 이 두 펀드의 조합만으로 복제할 수 있다. 즉, 효율적 포트폴리오를 원하는 모든 투자자는 이 두 펀드의 조합에만 투자하면 충분하다.

이는 실무적으로 강력한 결론이다 — 개별 투자자의 위험 성향이 아무리 달라도, "두 개의 대표 펀드"만 준비되어 있으면 그 비율만 조절해서 원하는 모든 효율적 포트폴리오를 만들어낼 수 있다는 뜻이기 때문이다.

## 무위험자산의 포함

지금까지는 \\(n\\)개 자산이 모두 위험자산이라고 가정했다. 이제 수익률이 확정적인(\\(\sigma=0\\)) <strong>무위험자산</strong>을 포함시켜보자. 무위험자산의 수익률을 \\(r_f\\)라 하면, 위험자산(평균 \\(\bar r\\), 분산 \\(\sigma^2\\))과의 공분산은 당연히 0이다.

무위험자산에 비중 \\(\alpha\\)(\\(\alpha \le 1\\), 남은 부분은 위험자산에 투자하거나 \\(\alpha<0\\)이면 무위험이자율로 차입해 위험자산에 더 많이 투자)를 배분한 포트폴리오는

$$
\text{평균} = \alpha r_f + (1-\alpha)\bar r, \qquad \text{표준편차} = (1-\alpha)\sigma
$$

<strong>두 식 모두 \\(\alpha\\)에 대해 선형이다.</strong> 즉 \\(\alpha\\)가 변함에 따라 평균-표준편차 평면 위에서 포트폴리오는 <strong>정확히 하나의 직선</strong>을 그린다. (무위험자산을 차입하는 것이 금지된다면, 원래의 실현가능영역과 무위험자산 점을 잇는 유한한 선분들만 추가된다.)

## One-Fund 정리

무위험자산으로 자유롭게 빌리고 빌려줄 수 있다면, 효율적 집합 전체가 <strong>단 하나의 직선</strong>이 된다는 놀라운 결론에 도달한다. 원래의 위험자산 실현가능영역 안에 있는 특정 포트폴리오 \\(F\\) 하나가 존재해서, 이 직선이 무위험자산 점 \\((\,0,\ r_f\,)\\)에서 출발해 \\(F\\)를 지나도록 그려진다 — 즉 \\(F\\)는 원래 위험자산 실현가능영역의 경계에 <strong>접하는(tangent)</strong> 점이다.

> <strong>One-Fund 정리</strong>: 위험자산으로만 구성된 단 하나의 포트폴리오(펀드) \\(F\\)가 존재하여, 모든 효율적 포트폴리오는 이 펀드 \\(F\\)와 무위험자산의 조합만으로 구성할 수 있다.

<div class="chart-container">
  <canvas id="chart-efficient-frontier" height="300"></canvas>
  <p class="chart-caption">두 위험자산(예시)으로 만들 수 있는 최소분산 곡선(회색)과, 무위험자산에서 출발해 접점(탄젠트 포트폴리오 F)을 지나는 직선(주황색 — One-Fund 정리가 말하는 새로운 효율적 프론티어). 접점 왼쪽은 무위험자산에 일부 투자, 오른쪽은 무위험자산을 차입해 F에 더 많이 투자하는 구간이다.</p>
</div>

## 탄젠트 포트폴리오 찾기: 샤프비율 최대화

그렇다면 이 접점 \\(F\\)는 구체적으로 어떻게 찾을까? 정답은 <strong>샤프비율(Sharpe ratio)</strong>을 최대화하는 포트폴리오다.

$$
\text{Sharpe ratio} = \frac{\mu_p - r_f}{\sigma_p} = \frac{w^T\mu - r_f}{\sqrt{w^T \Sigma w}}
$$

샤프비율은 "위험(표준편차) 한 단위당 얻는 초과수익(무위험이자율을 넘어서는 수익)"을 나타내는 지표다. 무위험자산 점에서 위험자산의 실현가능영역 쪽으로 그은 직선들 중, 기울기(=샤프비율)가 가장 큰 직선이 바로 실현가능영역에 접하는 직선이고, 그 접점이 탄젠트 포트폴리오다.

$$
\underset{w}{\text{maximize}}\quad \frac{w^T\mu - r_f}{\sqrt{w^T\Sigma w}} \qquad \text{subject to}\quad \mathbf{1}^T w = 1
$$

문제는 이 목적함수가 <strong>비볼록(non-convex)</strong>이라는 점이다 — 일반적으로 비볼록 문제는 풀기 어렵고 전역 최적해가 보장되지 않는다. 하지만 다음과 같은 변수 치환 \\(w = y/t\\)을 통해 <strong>동치인 볼록 문제</strong>로 바꿀 수 있다.

$$
\begin{aligned}
\underset{y,\,t}{\text{maximize}}\quad & y^T \mu - t\, r_f \\
\text{subject to}\quad & \mathbf{1}^T y = t \\
& y^T \Sigma y \le 1 \\
& t \ge 0
\end{aligned}
$$

이는 <strong>이차제약 이차계획법(Quadratically Constrained Quadratic Programming, QCQP)</strong> 문제로, 볼록(convex)하기 때문에 표준 알고리즘으로 전역 최적해를 안정적으로 구할 수 있다. 해를 구한 뒤 \\(w = y/t\\)로 되돌리면 원래 문제의 최적해(탄젠트 포트폴리오의 비중)를 얻는다.

## 정리

Markowitz 모델은 "주어진 기대수익에서 분산 최소화"라는 직관을 이차계획법(QP)으로 정식화한 것이다. 이 문제의 최적조건이 선형이라는 사실로부터 <strong>Two-Fund 정리</strong>(효율적 포트폴리오는 단 두 개의 기준 펀드의 조합으로 모두 표현 가능)가 유도되고, 여기에 무위험자산을 추가하면 효율적 집합이 하나의 직선으로 단순해지는 <strong>One-Fund 정리</strong>로 이어진다. 그 유일한 위험자산 펀드(탄젠트 포트폴리오)는 샤프비율을 최대화하는 포트폴리오이며, 이 최적화 문제는 비볼록이지만 변수 치환을 통해 볼록 QCQP로 바꿔 안정적으로 풀 수 있다. 다음 노트에서는 "모든 투자자가 결국 같은 위험자산 펀드를 보유한다면, 시장균형에서 그 펀드는 무엇이어야 하는가"라는 질문에서 출발해 <strong>CAPM</strong>을 유도한다.
