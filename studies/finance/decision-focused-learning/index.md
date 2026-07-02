# Decision-Focused Learning: 예측과 최적화를 함께

지금까지의 노트는 "이미 확정된 기대수익·공분산이 주어졌을 때 최적 포트폴리오를 어떻게 구성하는가"(Markowitz, CAPM)를 다뤘다. 그런데 현실에서 \\(\mu\\)와 \\(\Sigma\\)는 주어지는 것이 아니라 <strong>예측해야 하는 값</strong>이다. 이 노트는 "예측"과 "최적화(의사결정)"를 분리해서 다루는 기존 관행의 허점을 짚고, 이 둘을 하나의 파이프라인으로 묶어 학습하는 <strong>Decision-Focused Learning (DFL)</strong>을 다룬다.

## 기존 방식의 문제: Predict-then-Optimize

머신러닝 기반 의사결정의 표준 파이프라인은 다음과 같다.

```
입력 x  →  [머신러닝: 예측]  →  ŷ  →  [최적화: 의사결정]  →  결정 a
```

여기에는 두 가지 근본적인 문제가 있다.

<strong>문제 1</strong>: 예측에는 항상 오차가 있다("Garbage in, garbage out") — 완벽한 예측 모델은 존재하지 않는다.

<strong>문제 2</strong>: <strong>"가장 좋은 예측"이 "가장 좋은 결정"과 같지 않다.</strong> 이것이 더 미묘하고 중요한 문제다.

### 왜 최고의 예측이 최고의 결정을 보장하지 않는가

<strong>예제 1 (재고관리)</strong>: 두 시설이 있다고 하자. 시설 A는 평소 재고가 수요보다 항상 많아서 특별한 조치가 필요 없다. 시설 B는 평소 재고가 수요보다 부족해서 조치가 필요하다. 그런데 평균제곱오차(MSE)를 최소화하는 예측 모델은 "이 예측 오차가 의사결정에 실제로 영향을 미치는지"를 전혀 고려하지 않는다 — A의 오차든 B의 오차든 그저 똑같은 오차로 취급한다. 하지만 실제로 중요한 것은 B처럼 <strong>의사결정이 뒤바뀔 수 있는 지점의 오차</strong>다.

<strong>예제 2 (Elmachtoub & Grigas, 2022)</strong>: 비용 벡터 \\(c\\)를 예측해 \\(\min_a\, c^T a\\)(실현가능영역 내에서)를 푸는 상황을 생각하자. 두 예측 \\(\hat c_A\\), \\(\hat c_B\\)가 (MSE 기준으로) <strong>비슷한 크기의 오차</strong>를 갖더라도, 실현가능영역의 기하학적 구조에 따라 한쪽은 참값 \\(c\\)를 썼을 때와 <strong>똑같은 결정</strong>을 내리고 다른 쪽은 <strong>완전히 다른 결정</strong>을 내릴 수 있다. 즉 오차의 "크기"가 아니라 오차의 "방향"이 결정에 영향을 미치는지가 핵심이다.

두 예제 모두 같은 메시지를 준다: <strong>예측 오차와 결정 품질은 별개의 문제이며, 예측 정확도(MSE)만 최적화하는 것은 최선의 결정을 보장하지 않는다.</strong>

## Decision-Focused Learning의 정식화

데이터 \\(\mathcal{D} = \{(x_1,y_1), \ldots, (x_n,y_n)\}\\)이 있고, 각 \\(x\\)에 대해 결정을 내려야 한다고 하자.

<strong>Predict-then-optimize</strong>는 예측 손실만 최소화한다.

$$
\hat\theta = \underset{\theta\in\Theta}{\arg\min} \sum_{i=1}^n \mathcal{L}_{pred}\big(f_\theta(x_i),\, y_i\big), \qquad \text{예: } \mathcal{L}_{pred}(y,\hat y) = (y-\hat y)^2
$$

그 뒤 결정은 예측값에 대해 별도의 최적화 문제 \\(a^\star(\hat y) := \arg\min_{a\in\mathcal{A}} c(a,\hat y)\\)를 풀어 얻는다: \\(A_\pi(x) = a^\star(f_{\hat\theta}(x))\\).

<strong>Decision-focused learning</strong>은 예측 손실이 아니라 <strong>그 예측으로 인해 내려진 결정이 실제로 얼마나 좋은 비용을 내는지</strong>를 직접 최소화한다.

$$
\hat\theta = \underset{\theta\in\Theta}{\arg\min} \sum_{i=1}^n \mathcal{L}_{dec}\big(f_\theta(x_i),\, y_i\big), \qquad \mathcal{L}_{dec}(\hat y, y) := c\big(a^\star(\hat y),\, y\big)
$$

즉 <strong>예측값으로 내린 결정 \\(a^\star(\hat y)\\)를, 실제 참값 \\(y\\)에 대해 평가한 비용</strong>을 손실로 삼는다 — "예측이 맞았는가"가 아니라 "그 예측 때문에 내린 결정이 실제로 좋았는가"를 직접 학습 목표로 삼는 것이다.

## 미분의 어려움: 체인룰과 KKT

이 손실을 경사하강법으로 최적화하려면 \\(\theta\\)에 대해 미분해야 한다. 모든 항이 미분 가능하다면 체인룰로

$$
\frac{d\mathcal{L}_{dec}}{d\theta} = \frac{dc\big(a^\star(f_\theta(x_i)), y_i\big)}{da^\star(f_\theta(x_i))} \cdot \frac{da^\star(f_\theta(x_i))}{df_\theta(x_i)} \cdot \frac{df_\theta(x_i)}{d\theta}
$$

문제는 가운데 항 \\(\dfrac{da^\star(y)}{dy}\\)다 — \\(a^\star(y)\\)는 최적화 문제의 해이므로, <strong>유일하게 정의되지 않거나 미분 불가능</strong>할 수 있다(예: 선형계획법의 최적해가 실현가능영역의 꼭짓점에서 급격히 바뀌는 경우).

<strong>Wilder et al. (2018)</strong>의 해법: 목적함수가 선형인 문제 \\(\min y^T a \ \text{s.t.}\ Aa \le b\\)에 작은 이차항 \\(\gamma\|a\|^2\\)를 더해 해의 유일성을 보장한다. 그러면 최적 primal-dual 해 \\((a^\star, \lambda^\star)\\)가 만족하는 <strong>KKT 조건을 미분</strong>해서 \\(\dfrac{da^\star}{dy}\\)를 다음과 같은 선형계로 구할 수 있다.

$$
\begin{bmatrix} \nabla_a^2 c(a^\star, y) & A^T \\ \text{diag}(\lambda^\star) A & \text{diag}(Aa^\star - b) \end{bmatrix} \begin{bmatrix} \dfrac{da^\star}{dy} \\[4pt] \dfrac{d\lambda^\star}{dy} \end{bmatrix} = \begin{bmatrix} \dfrac{d\nabla_a c(a^\star, y)}{d\theta} \\[4pt] 0 \end{bmatrix}
$$

이는 최적화 문제 내부(inner optimization)를 한 번 풀 때마다 이런 선형계까지 함께 풀어야 한다는 뜻이므로 계산비용이 상당하다.

### 대안: 대리목적함수(Proxy Objectives)

결정 손실을 직접 미분하기 어렵거나 계산량이 클 때는 <strong>근사적인 대리 손실함수(surrogate)</strong>를 대신 사용하는 접근이 많이 제안되었다.

- 선형 재매개변수화(Wang et al., 2020)
- <strong>SPO+</strong> (Elmachtoub & Grigas, 2022) — Smart Predict-then-Optimize의 볼록 대리손실
- 지역 근사(Chung et al., 2022; Shah et al., 2022)
- <strong>LODL</strong> (Locally Optimized Decision Losses, Shah et al., 2022) — 각 데이터 지점 주변에서 결정 손실을 국소적으로 근사하는 손실함수를 학습

### 추가로 고려할 점

- <strong>결정 품질에 과적합되면 예측 품질이 심각하게 나빠질 수 있다.</strong> 극단적인 경우 모델이 사실상 "최적 행동을 그대로 예측하는" 모방학습(imitation learning)처럼 되어버려, 다른 용도로는 쓸모없는 예측이 될 수 있다. 이를 막기 위해 결정손실 최소화에 정규화 항을 추가하는 것이 권장된다.
- <strong>예측 모델이 재학습하기에 너무 무거울 수 있다</strong>(특히 제3자가 만든 사전학습 모델을 쓰는 경우). 이럴 때는 예측 모델은 고정(freeze)한 채, 그 위에 작은 수정 레이어(modification layer)를 추가해 그 레이어만 결정손실 기준으로 학습하는 방법이 흔히 제안된다.

## 포트폴리오 최적화에 DFL 적용하기

이제 이 프레임워크를 평균-분산 포트폴리오 최적화(MVO)에 적용해보자. Markowitz 모델의 한 변형인 다음 문제를 생각한다.

$$
\underset{w}{\text{maximize}}\quad w^T\mu - \lambda\, w^T \Sigma w \qquad \text{subject to}\quad w^T\mathbf{1}=1,\quad w \ge 0
$$

최적해 \\(w^\star(\mu)\\)를 예측된 기대수익 \\(\mu\\)의 함수로 본다. 여기서 두 종류의 \\(\mu\\)를 구별해야 한다: <strong>참값 \\(\mu^\star\\)</strong>(사전에 관측 불가능)와 <strong>예측값 \\(\hat\mu\\)</strong>.

### 후회(Regret)로서의 손실함수

<strong>후회(Regret)</strong>는 "예측값으로 내린 결정"과 "참값을 알았을 때의 최선의 결정"이 참값 기준으로 평가했을 때 벌어지는 차이다.

$$
\mathcal{L}_{MVO} = \text{Regret}\big(w^\star(\hat\mu),\, \mu^\star\big) = \underbrace{\Big(w^\star(\hat\mu)^T\mu^\star - \lambda\, w^\star(\hat\mu)^T\Sigma w^\star(\hat\mu)\Big)}_{\text{예측으로 내린 결정, 참값으로 평가}} - \underbrace{\Big(w^\star(\mu^\star)^T\mu^\star - \lambda\, w^\star(\mu^\star)^T\Sigma w^\star(\mu^\star)\Big)}_{\text{참값으로 내린 최선의 결정}}
$$

이 후회를 최소화하도록 예측 모델을 학습하면, "MVO에 실제로 도움이 되는" 예측을 얻을 수 있다는 것이 DFL의 아이디어다. 여기서 자연스러운 질문이 생긴다.

> <strong>"MVO를 위한 예측"은 일반적인 예측(예: MSE 최소화)과 어떻게 다른가?"</strong>

MSE는 모든 자산의 오차를 동등하게 취급한다. 하지만 포트폴리오 관점에서는, <strong>어차피 투자하지 않을 자산의 예측 오차에는 신경 쓸 필요가 없다</strong> — 이것이 예측과 결정을 분리했을 때 놓치는 부분이다.

### 간단한 이론적 분석: 샤프비율의 그래디언트

샤프비율을 최대화하는 포트폴리오(One-Fund 정리에서 다룬 탄젠트 포트폴리오의 방향)는 잘 알려진 닫힌형 해를 갖는다.

$$
\text{Sharpe Ratio} = \frac{w^T\mu}{\sqrt{w^T\Sigma w}}, \qquad w^\star(\mu) = \underset{w}{\arg\max}\ \frac{w^T\mu}{\sqrt{w^T\Sigma w}} \ \propto\ \Sigma^{-1}\mu
$$

예측값 \\(\hat\mu\\)로 만든 포트폴리오를 참값 \\(\mu^\star\\)로 평가한 샤프비율은

$$
SR(\hat\mu, \mu^\star) = \frac{w^\star(\hat\mu)^T\mu^\star}{\sqrt{w^\star(\hat\mu)^T\Sigma w^\star(\hat\mu)}} = \frac{\hat\mu^T \Sigma^{-1}\mu^\star}{\sqrt{\hat\mu^T\Sigma^{-1}\hat\mu}}
$$

이를 예측값 \\(\hat\mu\\)에 대해 미분하면

$$
\frac{\partial SR(\hat\mu,\mu^\star)}{\partial \hat\mu} = \frac{\Sigma^{-1}\big(\mu^\star - SR(\hat\mu,\mu^\star)\,\hat\mu\big)}{\sqrt{\hat\mu^T\Sigma^{-1}\hat\mu}}
$$

\\(i\\)번째 자산에 대한 그래디언트만 떼어보면 \\(\Sigma^{-1}\\)의 \\(i\\)번째 행 \\(\Sigma_i^{-1}\\)이 등장한다.

$$
\frac{\partial SR(\hat\mu,\mu^\star)}{\partial \hat\mu_i} = \frac{\Sigma_i^{-1}\big(\mu^\star - SR(\hat\mu,\mu^\star)\,\hat\mu\big)}{\sqrt{\hat\mu^T\Sigma^{-1}\hat\mu}}
$$

반면 일반적인 MSE 손실의 그래디언트는 단순히

$$
\frac{\partial \text{MSE}(\hat\mu,\mu^\star)}{\partial \hat\mu_i} = \frac{2(\mu_i^\star - \hat\mu_i)}{N}
$$

<strong>두 그래디언트를 비교하면</strong>: MSE는 자산 \\(i\\) 하나의 오차 \\((\mu_i^\star-\hat\mu_i)\\)만 본다. 반면 샤프비율 그래디언트는 <strong>모든 자산의 오차를 공분산행렬의 역행렬 \\(\Sigma^{-1}\\)로 재가중</strong>한 형태다 — 즉 "MSE를 \\(\Sigma_i^{-1}\\)로 보정한 것"으로 해석할 수 있다. 이것이 바로 앞서 던진 질문에 대한 정량적인 답이다: <strong>자산 간 공분산 구조(다른 자산과 얼마나 함께 움직이는지)를 반영해서 예측 오차의 중요도를 다시 매기는 것</strong>이, MVO에 특화된 예측과 일반적인 예측의 차이다.

## 이 연구실의 최신 연구

이 강의를 진행하는 연구실(UNIST Financial Engineering Lab)에서 최근 발표한 관련 논문들도 소개되었다.

- Lee, Jeon, Bae & Lee (2025), *Return Prediction for Mean-Variance Portfolio Selection: How Decision-Focused Learning Shapes Forecasting Models*, ACM ICAIF
- Kim, Tae & Lee (2025), *Estimating Covariance for Global Minimum Variance Portfolio: A Decision-Focused Learning Approach*, ACM ICAIF
- Hwang, Kong, Zohren & Lee (2025), *Decision-informed neural networks with large language model integration for portfolio optimization*, arXiv
- Jeon, Bae, Kim, Lee & Kim (2025), *Prediction Loss Guided Decision-Focused Learning*, arXiv
- Lee, Jin & Lee (2026, working paper), *Decision-Focused Learning via Tangent-Space Projection of Prediction Error*

이 논문들은 각각 수익률 예측·공분산 추정·LLM 통합·예측손실과 결정손실의 결합·오차의 접공간 투영 등 다양한 각도에서 "예측을 포트폴리오 결정에 더 유용하게 만드는 법"을 다루고 있다 — DFL이 여전히 활발히 발전 중인 연구 분야임을 보여준다.

## 정리

전통적인 predict-then-optimize 파이프라인은 예측 정확도(MSE 등)만 최적화하지만, 이는 최선의 의사결정을 보장하지 않는다 — 오차의 "크기"가 아니라 오차가 결정을 뒤바꾸는지가 중요하기 때문이다. <strong>Decision-Focused Learning</strong>은 예측에서 바로 결정손실(또는 후회)을 최소화하도록 학습하며, 이를 위해 KKT 조건을 이용한 미분이나 SPO+/LODL 같은 대리손실이 쓰인다. 포트폴리오 최적화에 적용하면, 샤프비율 기준의 그래디언트가 "공분산행렬의 역행렬로 재가중된 MSE"라는 형태를 띠는 것을 확인할 수 있다 — 어떤 자산의 예측 오차가 실제로 중요한지를 자산 간 상관구조 자체가 알려주는 셈이다.
