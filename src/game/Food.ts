import { Position } from '../utils/types'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/constants'

/** 먹이 엔티티 - 생성 및 위치 관리 */
export class Food {
  private position: Position

  constructor() {
    // 초기 위치는 임시로 설정 (spawn 호출 전)
    this.position = { x: 0, y: 0 }
    this.spawn([])
  }

  /** 스네이크 세그먼트를 피해 빈 셀에 랜덤 생성 */
  spawn(snakeSegments: Position[]): void {
    // 빈 셀 목록 생성
    const emptyCells: Position[] = []
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const isOccupied = snakeSegments.some(seg => seg.x === x && seg.y === y)
        if (!isOccupied) {
          emptyCells.push({ x, y })
        }
      }
    }

    if (emptyCells.length === 0) {
      // 빈 셀이 없는 경우 (게임 완료 상태)
      return
    }

    // 랜덤 빈 셀 선택
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    this.position = emptyCells[randomIndex]
  }

  /** 위치 수동 설정 (테스트용) */
  setPosition(pos: Position): void {
    this.position = { ...pos }
  }

  /** 현재 위치 반환 */
  getPosition(): Position {
    return { ...this.position }
  }
}
