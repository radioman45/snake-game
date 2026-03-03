# SPEC-UI-001: 구현 계획

## 메타데이터

| 항목 | 값 |
|------|-----|
| **SPEC ID** | SPEC-UI-001 |
| **제목** | Snake Game 완전 구현 |
| **개발 방법론** | TDD (RED-GREEN-REFACTOR) |
| **관련 요구사항** | R-001 ~ R-029 |

---

## 프로젝트 구조

```
src/
├── main.ts                  # 진입점, DOM 초기화, Game 인스턴스 생성
├── game/
│   ├── Game.ts             # 게임 메인 클래스 (루프, 상태 머신, 조율)
│   ├── Snake.ts            # 스네이크 엔티티 (이동, 성장, 충돌)
│   ├── Food.ts             # 먹이 엔티티 (생성, 위치 유효성)
│   └── Renderer.ts         # Canvas 렌더러 (보드, 스네이크, 먹이 그리기)
├── systems/
│   ├── InputSystem.ts      # 키보드/터치 입력 처리
│   ├── ScoreSystem.ts      # 점수 계산, 레벨 관리, 속도 계산
│   └── StorageSystem.ts    # localStorage 최고 점수 관리
├── ui/
│   ├── HUD.ts              # 점수, 레벨, 최고점수 HUD 렌더링
│   └── Menu.ts             # 시작/일시정지/게임오버 메뉴 렌더링
├── audio/
│   └── SoundManager.ts     # 효과음 관리 (선택)
└── utils/
    ├── constants.ts         # 게임 상수 정의
    └── types.ts             # TypeScript 타입/인터페이스 정의
```

---

## 마일스톤

### Primary Goal: 핵심 게임 엔진

**범위**: R-001 ~ R-009 (게임 엔진 + 기본 입력)

**작업 목록**:

1. **프로젝트 초기 설정**
   - Vite + TypeScript 프로젝트 생성
   - Vitest 설정 (jsdom 환경)
   - ESLint 설정
   - 디렉토리 구조 생성

2. **타입 및 상수 정의** (utils/)
   - Position, Direction, GameState 타입 정의
   - 게임 상수 정의 (GRID_SIZE, BOARD_WIDTH 등)
   - TDD: 상수 유효성 테스트

3. **Snake 클래스 구현** (game/Snake.ts)
   - 초기화 (중앙 배치, 3 세그먼트)
   - move() - 방향별 이동 로직
   - grow() - 꼬리 유지하여 성장
   - checkSelfCollision() - 자기 충돌 감지
   - checkWallCollision() - 벽 충돌 감지
   - TDD: 모든 이동/충돌 케이스 테스트

4. **Food 클래스 구현** (game/Food.ts)
   - spawn() - 빈 셀에 랜덤 위치 생성
   - 스네이크 세그먼트 회피 로직
   - TDD: 위치 유효성, 겹침 방지 테스트

5. **InputSystem 구현** (systems/InputSystem.ts)
   - 키보드 이벤트 리스너 등록
   - 화살표 키 매핑
   - 반대 방향 전환 방지
   - TDD: 방향 전환 유효성 테스트

6. **Game 클래스 구현** (game/Game.ts)
   - 게임 상태 머신 (MENU, PLAYING, PAUSED, GAME_OVER)
   - requestAnimationFrame 게임 루프
   - 고정 타임스텝 업데이트 (delta time 기반)
   - 충돌 감지 -> 상태 전환
   - 먹이 충돌 -> 성장 + 새 먹이
   - TDD: 상태 전환, 게임 루프 로직 테스트

---

### Secondary Goal: 점수/레벨 + UI 렌더링

**범위**: R-010 ~ R-021 (일시정지, 점수, 레벨, UI)

**작업 목록**:

7. **ScoreSystem 구현** (systems/ScoreSystem.ts)
   - 점수 추가 (먹이당 10점)
   - 레벨 계산 (먹이 4개마다 레벨업)
   - 속도 계산 (BASE_SPEED / (1 + level * 0.15))
   - TDD: 점수/레벨/속도 계산 테스트

8. **StorageSystem 구현** (systems/StorageSystem.ts)
   - getHighScore() - localStorage 읽기
   - setHighScore() - localStorage 쓰기
   - 데이터 유효성 검사
   - TDD: localStorage Mock 테스트

9. **Renderer 구현** (game/Renderer.ts)
   - Canvas 초기화 및 크기 설정
   - drawBoard() - 격자 배경
   - drawSnake() - 스네이크 세그먼트 그리기
   - drawFood() - 먹이 그리기
   - clear() - Canvas 초기화

10. **HUD 구현** (ui/HUD.ts)
    - 점수, 레벨, 최고점수 표시
    - 실시간 업데이트
    - Canvas 또는 DOM 요소 기반 렌더링

11. **Menu 구현** (ui/Menu.ts)
    - 시작 메뉴 (MENU 상태)
    - 일시정지 오버레이 (PAUSED 상태)
    - 게임오버 화면 (GAME_OVER 상태)
    - 버튼 클릭/키보드 이벤트 처리

12. **일시정지 기능** (InputSystem + Game)
    - Space/P 키 바인딩
    - PLAYING <-> PAUSED 토글
    - 게임 루프 정지/재개
    - TDD: 상태 토글 테스트

---

### Final Goal: 시각 효과 + 반응형 + 사운드

**범위**: R-022 ~ R-029 (애니메이션, 사운드, 반응형, 접근성)

**작업 목록**:

13. **시각 효과**
    - 레벨업 애니메이션 (숫자 확대/축소)
    - 게임오버 페이드 아웃 효과
    - 스네이크 이동 부드러운 보간 (선택)

14. **반응형 Canvas**
    - window.resize 이벤트 리스너
    - Canvas 크기 동적 조정
    - 그리드 비율 유지 스케일링
    - 최소/최대 크기 제한

15. **모바일 터치 지원** (선택)
    - touchstart/touchend 이벤트 감지
    - 스와이프 방향 계산
    - 화살표 키 입력으로 변환

16. **SoundManager 구현** (선택)
    - Web Audio API 또는 HTMLAudioElement
    - 먹이 획득, 게임오버 효과음
    - 음소거 토글
    - 오디오 로딩 실패 시 무음 폴백

17. **접근성 개선**
    - WCAG 2.1 AA 색상 대비 검증
    - 키보드 포커스 관리
    - 적절한 ARIA 레이블

18. **스타일링**
    - 다크 테마 CSS
    - 게임 레이아웃 중앙 정렬
    - 반응형 미디어 쿼리
    - 폰트 및 간격 최적화

---

### Optional Goal: 품질 및 배포

**작업 목록**:

19. **테스트 커버리지 확보**
    - 핵심 로직 85%+ 커버리지
    - 통합 테스트 (게임 흐름 전체)
    - 엣지 케이스 테스트

20. **성능 최적화**
    - 60 FPS 안정성 검증
    - 메모리 누수 방지 (이벤트 리스너 정리)
    - 가비지 컬렉션 최소화

21. **빌드 및 배포**
    - Vite 프로덕션 빌드 최적화
    - GitHub Actions CI/CD 설정
    - 배포 환경 설정 (Vercel/GitHub Pages)

---

## 기술 접근법

### 게임 루프 설계

```
requestAnimationFrame 기반 루프:

1. 현재 시간 측정 (timestamp)
2. 경과 시간 계산 (delta = timestamp - lastTime)
3. 누적 시간에 delta 추가
4. 누적 시간 >= moveInterval 이면:
   a. 입력 처리
   b. 스네이크 이동
   c. 충돌 감지
   d. 상태 업데이트
   e. 누적 시간 -= moveInterval
5. 렌더링 (매 프레임)
6. 다음 프레임 요청
```

### 상태 관리 패턴

GameState 열거형으로 유한 상태 머신을 구현합니다. 각 상태에서 허용되는 전환만 가능하도록 제어합니다.

### TDD 접근 전략

**순수 함수 우선 설계**: 게임 로직(이동, 충돌, 점수 계산)을 Canvas/DOM에 의존하지 않는 순수 함수로 분리하여 테스트 용이성을 극대화합니다.

**테스트 레이어**:
- **단위 테스트**: Snake, Food, ScoreSystem, StorageSystem의 개별 메서드
- **통합 테스트**: Game 클래스의 상태 전환과 게임 흐름
- **Canvas Mock**: Renderer 테스트 시 Canvas Context를 Mock 처리

### 의존성 방향

```
main.ts
  └── Game
       ├── Snake (순수 로직)
       ├── Food (순수 로직)
       ├── Renderer (Canvas 의존)
       ├── InputSystem (DOM 의존)
       ├── ScoreSystem (순수 로직)
       └── StorageSystem (localStorage 의존)
```

순수 로직 모듈은 외부 의존성 없이 테스트 가능하도록 설계합니다.

---

## 위험 요소 및 대응

| 위험 | 영향 | 대응 방안 |
|------|------|----------|
| Canvas 렌더링 성능 저하 (저사양 기기) | Medium | requestAnimationFrame + 고정 타임스텝으로 FPS 독립적 로직 |
| 모바일 터치 인식 불안정 | Low | 스와이프 임계값 조정, 터치 영역 확대 |
| localStorage 접근 차단 (프라이빗 모드) | Low | try-catch로 감싸고, 실패 시 메모리 내 저장 폴백 |
| Audio 자동 재생 차단 (브라우저 정책) | Low | 사용자 인터랙션 후 첫 재생, 실패 시 무음 모드 |
| 빠른 키 입력 시 방향 전환 충돌 | Medium | 프레임당 1회만 방향 전환 허용 |

---

## 의존성

### 런타임 의존성
- **없음** (순수 TypeScript + Browser API)

### 개발 의존성

| 패키지 | 용도 |
|--------|------|
| typescript ^5.3.0 | TypeScript 컴파일러 |
| vite ^5.0.0 | 빌드 도구 및 개발 서버 |
| vitest ^1.0.0 | 테스트 프레임워크 |
| @vitest/coverage-v8 | 커버리지 리포팅 |
| eslint ^8.0.0 | 코드 린팅 |
| prettier ^3.0.0 | 코드 포맷팅 |

---

## 관련 문서

| 문서 | 경로 |
|------|------|
| 제품 정의서 | .moai/project/product.md |
| 프로젝트 구조 | .moai/project/structure.md |
| 기술 스택 | .moai/project/tech.md |
| 인수 조건 | .moai/specs/SPEC-UI-001/acceptance.md |
