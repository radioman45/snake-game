import { Position, Direction } from '../utils/types'
import { BOARD_WIDTH, BOARD_HEIGHT, INITIAL_SNAKE_LENGTH } from '../utils/constants'

/** 반대 방향 맵핑 */
const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT
}

/** 스네이크 엔티티 - 이동, 성장, 충돌 감지 담당 */
export class Snake {
  private segments: Position[]
  private direction: Direction
  private nextDirection: Direction
  private growing: boolean = false

  constructor(
    segments?: Position[],
    direction: Direction = Direction.RIGHT
  ) {
    if (segments) {
      this.segments = [...segments.map(s => ({ ...s }))]
    } else {
      // 보드 중앙에 초기 스네이크 배치
      const centerX = Math.floor(BOARD_WIDTH / 2)
      const centerY = Math.floor(BOARD_HEIGHT / 2)
      this.segments = []
      for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        this.segments.push({ x: centerX - i, y: centerY })
      }
    }
    this.direction = direction
    this.nextDirection = direction
  }

  /** 다음 이동 방향 설정 (반대 방향 무시) */
  setNextDirection(dir: Direction): void {
    if (dir !== OPPOSITE_DIRECTION[this.direction]) {
      this.nextDirection = dir
    }
  }

  /** 버퍼된 방향 적용 */
  applyDirection(): void {
    this.direction = this.nextDirection
  }

  /** 현재 방향으로 1 셀 이동 */
  move(): void {
    const head = this.segments[0]
    const newHead = this.calculateNewHead(head)
    this.segments.unshift(newHead)

    if (!this.growing) {
      // 성장 중이 아니면 꼬리 제거
      this.segments.pop()
    } else {
      this.growing = false
    }
  }

  /** 다음 머리 위치 계산 */
  private calculateNewHead(head: Position): Position {
    switch (this.direction) {
      case Direction.UP:
        return { x: head.x, y: head.y - 1 }
      case Direction.DOWN:
        return { x: head.x, y: head.y + 1 }
      case Direction.LEFT:
        return { x: head.x - 1, y: head.y }
      case Direction.RIGHT:
        return { x: head.x + 1, y: head.y }
    }
  }

  /** 스네이크 성장 예약 */
  grow(): void {
    this.growing = true
  }

  /** 벽 충돌 검사 */
  checkWallCollision(): boolean {
    const head = this.segments[0]
    return head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT
  }

  /** 자기 충돌 검사 */
  checkSelfCollision(): boolean {
    const head = this.segments[0]
    return this.segments.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
  }

  /** 특정 위치가 스네이크 몸체에 포함되는지 확인 */
  occupies(pos: Position): boolean {
    return this.segments.some(seg => seg.x === pos.x && seg.y === pos.y)
  }

  getHead(): Position { return { ...this.segments[0] } }
  getSegments(): Position[] { return this.segments.map(s => ({ ...s })) }
  getDirection(): Direction { return this.direction }
  getNextDirection(): Direction { return this.nextDirection }
}
