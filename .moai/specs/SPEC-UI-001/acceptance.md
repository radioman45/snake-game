# SPEC-UI-001: 인수 조건

## 메타데이터

| 항목 | 값 |
|------|-----|
| **SPEC ID** | SPEC-UI-001 |
| **제목** | Snake Game 완전 구현 |
| **테스트 프레임워크** | Vitest |
| **커버리지 목표** | 85%+ |
| **관련 요구사항** | R-001 ~ R-029 |

---

## 모듈 1: 게임 엔진 테스트 시나리오

### AC-001: 게임 초기화 (R-001)

```gherkin
Scenario: 게임 초기 상태 설정
  Given 게임이 처음 로드됨
  When Game 인스턴스가 생성됨
  Then 스네이크는 보드 중앙에 3 세그먼트로 배치되어야 한다
  And 먹이가 보드 내 유효한 위치에 생성되어야 한다
  And 게임 상태는 MENU이어야 한다
  And 점수는 0이어야 한다
  And 레벨은 1이어야 한다
```

### AC-002: 스네이크 이동 (R-003)

```gherkin
Scenario: 스네이크 방향별 이동
  Given 스네이크가 위치 (10, 10)에 머리가 있음
  When 방향이 RIGHT일 때 한 틱이 지남
  Then 스네이크 머리는 (11, 10)으로 이동해야 한다
  And 이전 꼬리 세그먼트는 제거되어야 한다

Scenario: 스네이크 상향 이동
  Given 스네이크가 위치 (10, 10)에 머리가 있음
  When 방향이 UP일 때 한 틱이 지남
  Then 스네이크 머리는 (10, 9)로 이동해야 한다

Scenario: 스네이크 하향 이동
  Given 스네이크가 위치 (10, 10)에 머리가 있음
  When 방향이 DOWN일 때 한 틱이 지남
  Then 스네이크 머리는 (10, 11)로 이동해야 한다

Scenario: 스네이크 좌향 이동
  Given 스네이크가 위치 (10, 10)에 머리가 있음
  When 방향이 LEFT일 때 한 틱이 지남
  Then 스네이크 머리는 (9, 10)으로 이동해야 한다
```

### AC-003: 먹이 획득 및 성장 (R-004)

```gherkin
Scenario: 먹이를 먹으면 성장
  Given 스네이크 길이가 3이고 점수가 0임
  And 스네이크 머리가 (5, 5)이고 방향이 RIGHT임
  And 먹이가 (6, 5)에 위치함
  When 한 틱이 지남
  Then 스네이크 길이는 4가 되어야 한다
  And 점수는 10이 되어야 한다
  And 새로운 먹이가 빈 셀에 생성되어야 한다
```

### AC-004: 벽 충돌 (R-005)

```gherkin
Scenario: 오른쪽 벽 충돌
  Given 스네이크 머리가 (19, 10)이고 방향이 RIGHT임
  And 보드 크기가 20x20임
  When 한 틱이 지남
  Then 게임 상태는 GAME_OVER이어야 한다

Scenario: 상단 벽 충돌
  Given 스네이크 머리가 (10, 0)이고 방향이 UP임
  When 한 틱이 지남
  Then 게임 상태는 GAME_OVER이어야 한다

Scenario: 하단 벽 충돌
  Given 스네이크 머리가 (10, 19)이고 방향이 DOWN임
  When 한 틱이 지남
  Then 게임 상태는 GAME_OVER이어야 한다

Scenario: 왼쪽 벽 충돌
  Given 스네이크 머리가 (0, 10)이고 방향이 LEFT임
  When 한 틱이 지남
  Then 게임 상태는 GAME_OVER이어야 한다
```

### AC-005: 자기 충돌 (R-006)

```gherkin
Scenario: 스네이크가 자기 몸과 충돌
  Given 스네이크 세그먼트가 [(5,5), (4,5), (4,6), (5,6)]이고 방향이 DOWN임
  When 한 틱이 지남
  Then 스네이크 머리 (5,6)은 기존 세그먼트와 겹침
  And 게임 상태는 GAME_OVER이어야 한다
```

### AC-006: 먹이 생성 위치 유효성 (R-007)

```gherkin
Scenario: 먹이가 스네이크 위에 생성되지 않음
  Given 스네이크가 [(10,10), (9,10), (8,10)]을 차지하고 있음
  When 새로운 먹이가 생성됨
  Then 먹이 위치는 (10,10), (9,10), (8,10)이 아니어야 한다
  And 먹이 위치는 보드 범위 (0-19, 0-19) 내에 있어야 한다
```

---

## 모듈 2: 입력 시스템 테스트 시나리오

### AC-007: 키보드 방향 입력 (R-008)

```gherkin
Scenario: 화살표 키로 방향 변경
  Given 스네이크가 RIGHT 방향으로 이동 중임
  When 사용자가 ArrowUp 키를 누름
  Then 스네이크의 다음 방향은 UP으로 설정되어야 한다

Scenario: 화살표 키로 하향 변경
  Given 스네이크가 RIGHT 방향으로 이동 중임
  When 사용자가 ArrowDown 키를 누름
  Then 스네이크의 다음 방향은 DOWN으로 설정되어야 한다
```

### AC-008: 반대 방향 전환 방지 (R-009)

```gherkin
Scenario: 반대 방향 전환 무시
  Given 스네이크가 RIGHT 방향으로 이동 중임
  When 사용자가 ArrowLeft 키를 누름
  Then 스네이크의 방향은 여전히 RIGHT이어야 한다

Scenario: 상하 반대 방향 전환 무시
  Given 스네이크가 UP 방향으로 이동 중임
  When 사용자가 ArrowDown 키를 누름
  Then 스네이크의 방향은 여전히 UP이어야 한다
```

### AC-009: 일시정지 토글 (R-010)

```gherkin
Scenario: Space 키로 일시정지
  Given 게임 상태가 PLAYING임
  When 사용자가 Space 키를 누름
  Then 게임 상태는 PAUSED이어야 한다

Scenario: Space 키로 재개
  Given 게임 상태가 PAUSED임
  When 사용자가 Space 키를 누름
  Then 게임 상태는 PLAYING이어야 한다

Scenario: P 키로 일시정지
  Given 게임 상태가 PLAYING임
  When 사용자가 P 키를 누름
  Then 게임 상태는 PAUSED이어야 한다
```

---

## 모듈 3: 점수 및 레벨 시스템 테스트 시나리오

### AC-010: 점수 계산 (R-012)

```gherkin
Scenario: 먹이당 10점 증가
  Given 현재 점수가 0임
  When 스네이크가 먹이를 1개 먹음
  Then 점수는 10이어야 한다

Scenario: 연속 먹이 획득
  Given 현재 점수가 30임
  When 스네이크가 먹이를 1개 더 먹음
  Then 점수는 40이어야 한다
```

### AC-011: 레벨 진행 (R-013)

```gherkin
Scenario: 먹이 4개로 레벨업
  Given 현재 레벨이 1이고 먹은 먹이 수가 3임
  When 스네이크가 먹이를 1개 더 먹음 (총 4개)
  Then 레벨은 2이어야 한다

Scenario: 먹이 8개로 레벨 3
  Given 현재 레벨이 2이고 먹은 먹이 수가 7임
  When 스네이크가 먹이를 1개 더 먹음 (총 8개)
  Then 레벨은 3이어야 한다

Scenario: 레벨업 전 유지
  Given 현재 레벨이 1이고 먹은 먹이 수가 2임
  When 스네이크가 먹이를 1개 더 먹음 (총 3개)
  Then 레벨은 여전히 1이어야 한다
```

### AC-012: 속도 계산 (R-014)

```gherkin
Scenario: 레벨별 속도 증가
  Given 기본 속도가 150ms임
  When 레벨이 1이면
  Then 이동 간격은 약 130ms이어야 한다 (150 / 1.15)

  When 레벨이 2이면
  Then 이동 간격은 약 115ms이어야 한다 (150 / 1.30)

  When 레벨이 5이면
  Then 이동 간격은 약 85ms이어야 한다 (150 / 1.75)
```

### AC-013: 최고 점수 저장/로드 (R-015, R-016)

```gherkin
Scenario: 새 최고 점수 저장
  Given 현재 최고 점수가 50임
  And 현재 게임 점수가 80임
  When 게임이 종료됨
  Then localStorage에 최고 점수 80이 저장되어야 한다

Scenario: 최고 점수 미달 시 미저장
  Given 현재 최고 점수가 100임
  And 현재 게임 점수가 60임
  When 게임이 종료됨
  Then localStorage의 최고 점수는 여전히 100이어야 한다

Scenario: 최고 점수 로드
  Given localStorage에 최고 점수 120이 저장되어 있음
  When 게임이 초기화됨
  Then HUD에 최고 점수 120이 표시되어야 한다

Scenario: 최고 점수 없을 때 기본값
  Given localStorage에 최고 점수가 없음
  When 게임이 초기화됨
  Then 최고 점수는 0으로 표시되어야 한다
```

---

## 모듈 4: UI 렌더링 테스트 시나리오

### AC-014: 상태별 메뉴 표시 (R-019 ~ R-021)

```gherkin
Scenario: MENU 상태에서 시작 화면 표시
  Given 게임 상태가 MENU임
  When 화면이 렌더링됨
  Then "게임 시작" 버튼이 표시되어야 한다
  And 게임 제목이 표시되어야 한다

Scenario: GAME_OVER 상태에서 결과 화면 표시
  Given 게임 상태가 GAME_OVER이고 최종 점수가 70임
  When 화면이 렌더링됨
  Then 최종 점수 70이 표시되어야 한다
  And "다시 시작" 버튼이 표시되어야 한다

Scenario: PAUSED 상태에서 일시정지 오버레이 표시
  Given 게임 상태가 PAUSED임
  When 화면이 렌더링됨
  Then "일시정지" 텍스트가 표시되어야 한다
  And 재개 안내가 표시되어야 한다
```

### AC-015: HUD 실시간 업데이트 (R-018)

```gherkin
Scenario: HUD 점수 업데이트
  Given 게임이 진행 중이고 점수가 30, 레벨이 1, 최고점수가 100임
  When HUD가 렌더링됨
  Then 점수 "30", 레벨 "1", 최고점수 "100"이 표시되어야 한다
```

---

## 모듈 5: 반응형 및 접근성 테스트 시나리오

### AC-016: Canvas 반응형 스케일링 (R-027)

```gherkin
Scenario: 창 크기 변경 시 Canvas 조정
  Given Canvas가 400x400 크기로 렌더링됨
  When 브라우저 창 크기가 변경됨
  Then Canvas 크기가 새 창 크기에 맞게 조정되어야 한다
  And 게임 보드 비율은 유지되어야 한다
```

### AC-017: 키보드 접근성 (R-029)

```gherkin
Scenario: 키보드만으로 게임 조작
  Given 게임이 MENU 상태임
  When 사용자가 Enter 키를 누름
  Then 게임이 시작되어야 한다
  And 화살표 키로 스네이크를 조작할 수 있어야 한다
  And Space 키로 일시정지할 수 있어야 한다
```

---

## 통합 테스트 시나리오

### AC-018: 전체 게임 흐름

```gherkin
Scenario: 완전한 게임 세션
  Given 게임이 처음 로드됨
  When 사용자가 게임을 시작함
  Then 게임 상태는 PLAYING이어야 한다

  When 스네이크가 먹이를 4개 먹음
  Then 점수는 40이어야 한다
  And 레벨은 2이어야 한다
  And 게임 속도가 증가해야 한다

  When 스네이크가 벽에 충돌함
  Then 게임 상태는 GAME_OVER이어야 한다
  And 점수가 최고 점수보다 높으면 저장되어야 한다

  When 사용자가 "다시 시작"을 선택함
  Then 게임이 초기 상태로 리셋되어야 한다
  And 이전 최고 점수는 유지되어야 한다
```

---

## Quality Gate

### Definition of Done

- [ ] 모든 단위 테스트 통과 (Vitest)
- [ ] 테스트 커버리지 85% 이상
- [ ] ESLint 경고/에러 0개
- [ ] TypeScript 컴파일 에러 0개
- [ ] 60 FPS 안정적 유지 (Chrome DevTools Performance 확인)
- [ ] 초기 로딩 2초 이내
- [ ] 모든 EARS 요구사항(R-001 ~ R-029) 충족
- [ ] Chrome, Firefox, Safari, Edge에서 정상 동작
- [ ] WCAG 2.1 AA 색상 대비 충족
- [ ] 번들 크기 100KB 이하

### 검증 방법

| 항목 | 도구 | 명령어 |
|------|------|--------|
| 단위 테스트 | Vitest | `npm run test` |
| 커버리지 | @vitest/coverage-v8 | `npm run test:coverage` |
| 타입 검사 | TypeScript | `npx tsc --noEmit` |
| 린트 | ESLint | `npm run lint` |
| 빌드 | Vite | `npm run build` |
| 성능 | Chrome DevTools | Performance 패널 |
| 접근성 | Lighthouse | Accessibility 점수 |
