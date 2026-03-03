# Snake Game - 아키텍처 개요

> **신규 프로젝트**: 아직 소스 코드가 없습니다. 개발이 시작되면 이 문서가 자동으로 업데이트됩니다.

## 프로젝트 목표

웹 브라우저에서 구동되는 클래식 스네이크 게임 구현.

## 계획된 아키텍처

```
Browser (HTML5 Canvas)
    │
    ├── Game Loop (requestAnimationFrame)
    │       ├── Input Handler (키보드 이벤트)
    │       ├── Game State Manager (실행/일시정지/게임오버)
    │       └── Renderer (Canvas 2D)
    │
    ├── 도메인 레이어
    │       ├── Snake (위치, 방향, 성장)
    │       ├── Food (랜덤 위치 생성)
    │       └── Collision Detector (충돌 감지)
    │
    └── 영속성 레이어
            └── localStorage (최고 점수 저장)
```

## 핵심 설계 원칙

- **단일 책임 원칙**: 각 클래스는 하나의 역할만 담당
- **불변성**: 게임 상태는 매 프레임마다 새로 계산
- **테스트 가능성**: 순수 함수와 클래스로 단위 테스트 용이

## 업데이트 예정

`/moai codemaps` 명령 실행 시 실제 코드 기반으로 이 문서가 업데이트됩니다.
