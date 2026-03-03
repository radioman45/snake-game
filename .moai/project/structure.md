# Snake Game - 프로젝트 구조

## 디렉토리 구조

```
snake-game/
├── src/                           # 소스 코드 디렉토리
│   ├── main.ts                    # 애플리케이션 진입점
│   ├── game/                      # 게임 로직 모듈
│   │   ├── Game.ts               # 게임 메인 클래스 (게임 루프, 상태 관리)
│   │   ├── Snake.ts              # 스네이크 엔티티 (위치, 이동, 성장)
│   │   ├── Food.ts               # 먹이 엔티티 (랜덤 위치 생성)
│   │   └── GameBoard.ts          # 게임 보드 (Canvas 렌더링)
│   ├── ui/                        # 사용자 인터페이스 모듈
│   │   ├── ScoreBoard.ts         # 점수판 UI (점수, 최고 기록, 레벨 표시)
│   │   ├── GameMenu.ts           # 메뉴 UI (시작, 일시정지, 게임오버)
│   │   └── SoundControl.ts       # 음소거 제어 UI (선택사항)
│   ├── utils/                     # 유틸리티 및 헬퍼 함수
│   │   ├── storage.ts            # localStorage 기반 최고 점수 관리
│   │   ├── constants.ts          # 게임 상수 (격자 크기, 색상, 속도)
│   │   ├── types.ts              # TypeScript 타입 정의
│   │   └── helpers.ts            # 공용 헬퍼 함수
│   └── styles/                    # 스타일시트
│       └── main.css              # 주요 게임 스타일 (Canvas, UI, 반응형)
├── public/                        # 정적 자산 디렉토리
│   ├── index.html                # HTML 진입점
│   ├── favicon.ico               # 파비콘
│   └── assets/                   # 게임 에셋 (선택사항)
│       ├── sounds/               # 음향 파일
│       │   ├── eat.mp3
│       │   ├── gameover.mp3
│       │   └── background.mp3
│       └── images/               # 이미지 파일 (로고 등)
├── tests/                         # 단위 테스트 디렉토리
│   ├── game.test.ts              # 게임 로직 테스트
│   ├── snake.test.ts             # 스네이크 클래스 테스트
│   ├── food.test.ts              # 먹이 클래스 테스트
│   └── storage.test.ts           # localStorage 유틸 테스트
├── .github/                       # GitHub 설정
│   └── workflows/                # GitHub Actions 워크플로우
│       ├── test.yml              # 자동 테스트 파이프라인
│       └── deploy.yml            # 자동 배포 파이프라인
├── .moai/                         # MoAI 프로젝트 설정
│   ├── project/                  # 프로젝트 문서
│   │   ├── product.md            # 제품 정의서
│   │   ├── structure.md          # 프로젝트 구조 (이 파일)
│   │   └── tech.md               # 기술 스택
│   └── specs/                    # SPEC 문서 (개발 진행 시 생성)
├── node_modules/                 # npm 의존성 (git 무시)
├── dist/                         # 빌드 출력 디렉토리 (git 무시)
├── .env.example                  # 환경 변수 예시
├── .gitignore                    # Git 무시 파일 목록
├── .eslintrc.json                # ESLint 설정 (코드 린팅)
├── package.json                  # 프로젝트 메타데이터 및 의존성
├── package-lock.json             # npm 의존성 잠금 파일
├── tsconfig.json                 # TypeScript 설정
├── vite.config.ts                # Vite 빌드 설정
├── vitest.config.ts              # Vitest 테스트 설정
└── README.md                      # 프로젝트 전체 문서

```

---

## 핵심 디렉토리 및 파일 설명

### src/ - 소스 코드 디렉토리

프로젝트의 모든 TypeScript 소스 코드를 포함합니다. main.ts에서 애플리케이션이 시작되며, 기능별로 game, ui, utils 모듈로 분리되어 있습니다.

### src/game/ - 게임 로직 모듈

게임의 핵심 로직을 담당하는 모듈입니다.

**Game.ts**: 게임의 메인 클래스로서 게임 루프, 상태 관리, 게임 이벤트 처리를 담당합니다. requestAnimationFrame을 사용하여 60 FPS 게임 루프를 구현하고, 게임 시작, 일시정지, 재개, 종료 같은 상태를 관리합니다.

**Snake.ts**: 스네이크 엔티티를 표현하는 클래스입니다. 스네이크의 좌표(segments), 현재 방향, 다음 방향을 저장하며, move() 메서드로 이동 처리, grow() 메서드로 성장 처리, checkCollision() 메서드로 충돌 감지를 담당합니다.

**Food.ts**: 게임 보드에 나타날 먹이를 표현하는 클래스입니다. 게임 보드 내 랜덤 위치에서 먹이를 생성하고, 먹이가 이미 존재하는 스네이크 세그먼트와 겹치지 않도록 처리합니다.

**GameBoard.ts**: HTML5 Canvas API를 사용하여 게임 보드를 렌더링하는 클래스입니다. 격자 배경, 스네이크, 먹이, UI 요소를 Canvas에 그리며, 반응형 디자인을 위해 화면 크기 변화에 따라 Canvas 크기를 조정합니다.

### src/ui/ - 사용자 인터페이스 모듈

게임의 UI 요소들을 관리하는 모듈입니다.

**ScoreBoard.ts**: 화면에 표시되는 점수판 UI를 관리합니다. 현재 점수, 최고 기록, 현재 레벨을 실시간으로 업데이트하여 표시합니다.

**GameMenu.ts**: 게임 시작, 일시정지, 게임오버 화면을 담당하는 메뉴 UI 클래스입니다. 버튼 클릭 이벤트를 처리하고, 게임 상태에 따라 적절한 메뉴를 표시합니다.

**SoundControl.ts** (선택사항): 음소거 토글 버튼과 같은 음향 관련 UI 요소를 관리합니다.

### src/utils/ - 유틸리티 및 헬퍼 함수

게임 전체에서 공용으로 사용되는 함수와 데이터를 포함합니다.

**storage.ts**: 브라우저의 localStorage를 사용하여 최고 점수를 저장하고 불러오는 함수들을 제공합니다. getHighScore(), setHighScore() 같은 함수를 구현합니다.

**constants.ts**: 게임 전체에서 사용되는 상수값들을 정의합니다. 격자 크기(GRID_SIZE), 초기 스네이크 길이(INITIAL_LENGTH), 기본 게임 속도(BASE_SPEED), 색상값(COLORS), 레벨별 속도 배수 등을 포함합니다.

**types.ts**: TypeScript 타입 정의 파일입니다. Position, GameState, KeyDirection 같은 인터페이스와 타입을 정의하여 타입 안전성을 보장합니다.

**helpers.ts**: 재사용 가능한 헬퍼 함수들을 포함합니다. 충돌 감지, 좌표 변환, 난수 생성 같은 공용 로직을 구현합니다.

### src/styles/ - 스타일시트

**main.css**: 게임의 모든 스타일을 정의합니다. Canvas 요소의 스타일, 게임 메뉴의 디자인, 점수판 UI, 반응형 레이아웃을 포함합니다.

### public/ - 정적 자산 디렉토리

**index.html**: 게임의 HTML 진입점입니다. Canvas 요소를 생성하고, main.ts의 JavaScript를 로드합니다.

**assets/**: 게임에 필요한 음향, 이미지 같은 정적 자산을 저장합니다.

### tests/ - 단위 테스트 디렉토리

Vitest를 사용한 단위 테스트 파일들을 포함합니다. 게임 로직, 스네이크 클래스, 먹이 클래스, 저장소 유틸 등의 테스트를 작성하여 코드 품질을 보장합니다.

### .github/workflows/ - GitHub Actions 자동화

**test.yml**: 모든 커밋에서 자동으로 테스트를 실행합니다. 의존성 설치, 린트 검사, 테스트 실행, 커버리지 리포팅을 수행합니다.

**deploy.yml**: 메인 브랜치로의 푸시 시 자동으로 Vercel, GitHub Pages 또는 선택한 호스팅 서비스에 배포합니다.

### .moai/ - MoAI 프로젝트 설정

MoAI-ADK 프로젝트 관리 시스템의 설정과 문서를 저장합니다.

**project/**: 프로젝트 레벨의 문서 (product.md, structure.md, tech.md)를 포함합니다.

**specs/**: 개발 진행 중 생성되는 SPEC 문서들을 저장합니다. 각 기능이나 작업 항목에 대한 상세 명세서가 저장됩니다.

### 설정 파일들

**package.json**: 프로젝트의 메타데이터, 스크립트 명령어, npm 의존성을 정의합니다. 타입스크립트, Vite, Vitest, ESLint 등의 의존성을 포함합니다.

**tsconfig.json**: TypeScript 컴파일러 설정입니다. 대상 ECMAScript 버전, 모듈 시스템, 엄격한 타입 검사 옵션 등을 정의합니다.

**vite.config.ts**: Vite 빌드 도구의 설정 파일입니다. 진입점, 출력 디렉토리, 개발 서버 설정, 플러그인 등을 정의합니다.

**vitest.config.ts**: Vitest 테스트 프레임워크의 설정 파일입니다. 테스트 환경, 커버리지 설정, 모의 객체(Mock) 설정 등을 정의합니다.

---

## 파일 간 의존성 구조

게임 초기화 흐름: index.html → main.ts → Game 클래스

게임 렌더링 흐름: Game 클래스 → GameBoard (Canvas 렌더링) → 매 프레임 반복

게임 상태 관리: Game 클래스 ↔ Snake, Food 클래스

UI 업데이트 흐름: Game 클래스 → ScoreBoard, GameMenu UI 업데이트

데이터 저장: ScoreBoard → storage.ts (localStorage)

---

## 모듈별 책임

| 모듈 | 책임 | 의존성 |
|------|------|--------|
| main.ts | 앱 초기화 | Game, GameBoard |
| Game.ts | 게임 루프, 상태 관리 | Snake, Food, GameBoard, ScoreBoard |
| Snake.ts | 스네이크 로직 | constants |
| Food.ts | 먹이 로직 | constants, helpers |
| GameBoard.ts | Canvas 렌더링 | constants |
| ScoreBoard.ts | 점수 UI | storage, constants |
| GameMenu.ts | 메뉴 UI | - |
| storage.ts | 데이터 지속성 | - |
| constants.ts | 상수 정의 | - |
| types.ts | 타입 정의 | - |
| helpers.ts | 공용 유틸 | constants |

---

## 개발 흐름

새 기능 개발 시 해당 모듈 디렉토리에서 필요한 파일을 작성하고, tests/ 디렉토리에 대응하는 테스트를 작성합니다. 게임 로직은 src/game/, UI는 src/ui/, 공용 함수는 src/utils/에 작성하는 방식으로 관심사를 분리합니다.

---

**최종 수정일**: 2026-03-04
**버전**: 1.0.0
