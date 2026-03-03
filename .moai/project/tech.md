# Snake Game - 기술 스택

## 핵심 기술 스택

| 영역 | 기술 | 버전 | 설명 |
|------|------|------|------|
| **언어** | TypeScript | 5.3+ | 타입 안전성과 개발 생산성 제공 |
| **런타임** | Node.js | 18+ | 개발 환경 및 빌드 도구 기반 |
| **렌더링** | HTML5 Canvas API | ES2020 | 고성능 2D 그래픽 렌더링 |
| **빌드 도구** | Vite | 5.0+ | 빠른 개발 서버와 최적화 빌드 |
| **테스트** | Vitest | 1.0+ | TypeScript 네이티브 단위 테스트 |
| **린팅** | ESLint | 8.0+ | 코드 품질 검사 및 표준화 |
| **패키지 관리** | npm 또는 bun | 10.0+ (npm) / 1.0+ (bun) | 의존성 관리 및 스크립트 실행 |
| **스타일링** | CSS3 | - | 순수 CSS로 스타일 관리 (프레임워크 미사용) |
| **저장소** | localStorage API | - | 브라우저 로컬 저장소 (최고 점수) |

---

## 개발 환경 요구사항

### 필수 요구사항

- **Node.js**: 18.0.0 이상 (권장: 20 LTS 이상)
- **npm**: 10.0.0 이상 (또는 bun 1.0.0 이상)
- **운영체제**: Windows 10/11, macOS, Linux
- **텍스트 에디터**: VS Code 권장 (또는 WebStorm, IntelliJ IDEA)

### 브라우저 지원

개발 시 테스트할 최신 브라우저 버전:

- **Chrome**: 90+ (권장: 최신 안정 버전)
- **Firefox**: 88+ (권장: 최신 안정 버전)
- **Safari**: 14+ (권장: 최신 안정 버전)
- **Edge**: 90+ (권장: Chromium 기반 최신 버전)

### 개발 도구

- **VS Code Extensions**:
  - ESLint (Microsoft)
  - Prettier (기본 포맷터)
  - Thunder Client 또는 REST Client (API 테스트)
  - Live Server (로컬 테스트 서버)

---

## 기술 선택 근거

### TypeScript 선택 이유

TypeScript는 정적 타입 시스템으로 개발 단계에서 버그를 조기에 발견합니다. IDE 자동완성과 리팩토링 도구가 우수하여 개발 생산성을 높입니다. 대규모 프로젝트에서 코드 유지보수가 용이하고, 팀 협업 시 코드 가독성이 향상됩니다. Canvas API 같은 복잡한 DOM 조작을 할 때 타입 안전성이 특히 중요합니다.

### Vite 선택 이유

Vite는 ES 모듈을 활용한 매우 빠른 개발 서버를 제공합니다. HMR(Hot Module Replacement) 기능으로 코드 변경 시 즉시 반영되어 개발 효율이 높습니다. 빌드 시 Rollup을 사용하여 번들 크기를 최소화합니다. TypeScript를 별도 설정 없이 바로 지원합니다. 최신 웹 개발 트렌드를 반영한 도구입니다.

### Canvas API 선택 이유

Canvas API는 HTML5 표준 규격으로 모든 현대 브라우저에서 완벽히 지원됩니다. 2D 게임 렌더링에 최적화된 저수준 API로 매우 빠릅니다. 프레임워크의 오버헤드가 없어 높은 FPS를 유지할 수 있습니다. 게임처럼 초 단위로 많은 요소를 그려야 하는 경우 매우 효율적입니다. 간단한 스네이크 게임에 완벽한 선택입니다.

### Vitest 선택 이유

Vitest는 Vite 기반의 극도로 빠른 테스트 프레임워크입니다. TypeScript를 네이티브로 지원하여 별도 설정이 불필요합니다. Jest와 호환되는 API로 Jest 지식을 활용할 수 있습니다. 병렬 테스트 실행으로 전체 테스트 시간을 단축합니다. HMR 지원으로 테스트 코드 수정 시 즉시 반영됩니다.

### localStorage 선택 이유

localStorage는 웹 표준 API로 별도의 백엔드 서버가 필요 없습니다. 브라우저에서 데이터를 로컬에 저장하여 오프라인에서도 동작합니다. 최고 점수 같은 간단한 데이터 저장에 최적화되어 있습니다. 설정이 간단하고 추가 의존성이 없습니다.

---

## 빌드 및 배포 설정

### 개발 환경 실행

프로젝트 의존성을 설치한 후 Vite 개발 서버를 실행합니다. 터미널에서 npm install 또는 bun install을 실행하여 package.json에 정의된 모든 의존성을 설치합니다. npm run dev 또는 bun run dev를 실행하여 개발 서버를 시작합니다. 기본적으로 http://localhost:5173에서 게임에 접속할 수 있습니다.

### 프로덕션 빌드

npm run build 또는 bun run build를 실행하여 프로덕션 빌드를 생성합니다. 빌드된 파일은 dist/ 디렉토리에 생성되며, JavaScript는 최소화되고 CSS는 최적화됩니다. 빌드 크기는 일반적으로 50-100KB 범위입니다.

### 배포 옵션

**Vercel 배포** (권장):

Vercel은 Next.js 제작사에서 만들었으며 정적 사이트 배포에 최적화되어 있습니다. GitHub 연동으로 자동 배포 설정이 간단합니다. 무료 플랜으로도 충분합니다. 빠른 글로벌 CDN으로 로딩 속도가 빠릅니다.

배포 절차: GitHub에 프로젝트 푸시 → Vercel 사이트에서 프로젝트 import → 자동으로 배포 완료. 이후 커밋마다 자동 배포됩니다.

**GitHub Pages 배포**:

GitHub 리포지토리에 내장된 무료 호스팅 서비스입니다. 별도의 배포 플랫폼 회원가입이 불필요합니다.

배포 절차: package.json에서 build 스크립트 실행 → dist/ 폴더를 gh-pages 브랜치에 배포 → GitHub Pages 설정에서 gh-pages 브랜치 선택.

**Netlify 배포**:

개발자 친화적인 호스팅 플랫폼입니다. GitHub 연동으로 자동 배포가 쉽습니다. 무료 플랜으로도 충분합니다.

배포 절차: Netlify 계정 생성 → GitHub 리포지토리 연결 → 빌드 설정 (npm run build, dist/) 입력 → 자동 배포.

---

## 테스트 전략

### 단위 테스트

Vitest를 사용하여 각 모듈의 기능을 독립적으로 테스트합니다.

**Game.ts 테스트**: 게임 초기화, 상태 변화, 이벤트 처리를 테스트합니다.

**Snake.ts 테스트**: 스네이크 이동, 성장, 자기충돌 감지를 테스트합니다.

**Food.ts 테스트**: 먹이 생성, 위치 유효성을 테스트합니다.

**storage.ts 테스트**: localStorage 저장/로드 기능을 테스트합니다.

### 통합 테스트

게임의 전체 흐름을 테스트합니다. 게임 시작 → 스네이크 이동 → 먹이 획득 → 점수 증가 → 레벨 업 → 게임 오버까지의 전체 시나리오를 테스트합니다.

### 수동 테스트

자동화하기 어려운 부분을 수동으로 테스트합니다:

- Canvas 렌더링 정상 여부 (시각적 확인)
- 음향 효과 정상 여부 (청각적 확인)
- 반응형 디자인 (다양한 화면 크기)
- 브라우저 호환성 (각 브라우저)

### 테스트 커버리지 목표

최소 80% 이상의 코드 커버리지를 목표로 합니다. npm run test:coverage 명령으로 커버리지 리포트를 생성합니다.

---

## 성능 최적화

### 렌더링 최적화

Canvas 렌더링은 매 프레임마다 전체를 다시 그리는 방식입니다. requestAnimationFrame(rAF)을 사용하여 브라우저의 리페인트 주기와 동기화합니다. 이를 통해 60 FPS의 안정적인 프레임률을 유지합니다.

불필요한 계산을 제거합니다. 게임 로직 계산은 한 번만 수행하고, 그 결과를 렌더링에 사용합니다. 복잡한 계산은 사전에 처리합니다.

### 번들 최적화

Vite의 자동 코드 분할로 불필요한 코드 로딩을 방지합니다. 프로덕션 빌드 시 Tree Shaking으로 미사용 코드를 제거합니다. 이미지와 음향 파일은 필요한 것만 포함시킵니다.

### 메모리 최적화

게임 상태는 최소한의 데이터만 유지합니다. 매 프레임마다 새로운 객체 생성을 최소화하여 가비지 컬렉션 부담을 줍니다. 오래된 이벤트 리스너는 게임 종료 시 정리합니다.

---

## 개발 워크플로우

### 초기 설정

프로젝트 디렉토리에서 npm install 실행 후 npm run dev로 개발 서버 시작합니다. http://localhost:5173에서 게임을 브라우저로 확인합니다.

### 개발 사이클

코드 작성 → HMR로 즉시 반영 확인 → 테스트 작성 및 실행 → 린트 검사 수행 → 커밋.

npm run lint로 ESLint 검사를 실행합니다. npm run format으로 Prettier 자동 포맷팅을 실행합니다. npm run test로 모든 테스트를 실행합니다.

### CI/CD 파이프라인

GitHub에 푸시하면 자동으로 GitHub Actions 워크플로우가 실행됩니다. 테스트 실행, 린트 검사, 빌드 성공 여부를 확인합니다. 모든 검사를 통과하면 자동으로 Vercel 또는 GitHub Pages에 배포됩니다.

---

## 의존성 관리

### 주요 의존성

**개발 의존성** (devDependencies):
- typescript: 타입 검사
- vite: 빌드 및 개발 서버
- vitest: 테스트 프레임워크
- eslint: 코드 린팅
- prettier: 코드 포맷팅

**런타임 의존성** (dependencies):
- 게임 로직은 순수 JavaScript/TypeScript로 구현하여 외부 라이브러리 최소화

### 의존성 업데이트

npm outdated로 업데이트 가능한 패키지를 확인합니다. npm update로 마이너 및 패치 버전을 업데이트합니다. 메이저 버전 업데이트는 변경 사항을 검토 후 수동으로 진행합니다.

---

## 보안 고려사항

### localStorage 사용 주의점

localStorage는 XSS(Cross-Site Scripting) 공격에 취약합니다. 사용자 입력을 localStorage에 저장하기 전에 검증합니다. 민감한 정보(비밀번호, 토큰)는 localStorage에 저장하지 않습니다.

### 입력 검증

키보드 입력은 게임 로직에서만 처리하며, 악의적인 입력을 필터링합니다. Canvas API는 기본적으로 XSS 방지 기능이 있습니다.

### HTTPS 배포

프로덕션 환경에서는 반드시 HTTPS를 사용합니다. Vercel과 GitHub Pages는 자동으로 HTTPS를 지원합니다.

---

## 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| npm run dev | 개발 서버 시작 (http://localhost:5173) |
| npm run build | 프로덕션 빌드 생성 (dist/ 디렉토리) |
| npm run preview | 빌드 결과 미리보기 (로컬에서) |
| npm run test | 모든 테스트 실행 |
| npm run test:watch | 감시 모드 테스트 (파일 변경 시 자동 실행) |
| npm run test:coverage | 테스트 커버리지 리포트 생성 |
| npm run lint | ESLint 검사 실행 |
| npm run format | Prettier 자동 포맷팅 |
| npm run format:check | Prettier 포맷 검사 (수정 없음) |

---

## 환경 변수

**.env 파일** (선택사항):

프로젝트 루트에 .env 파일을 생성하여 환경별 설정을 관리합니다.

VITE_API_BASE_URL=http://localhost:3000
VITE_ENVIRONMENT=development

접두사 VITE_가 붙은 변수만 클라이언트 코드에서 접근 가능합니다. import.meta.env.VITE_API_BASE_URL로 접근합니다.

---

**최종 수정일**: 2026-03-04
**버전**: 1.0.0
