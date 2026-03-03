import { HIGH_SCORE_KEY } from '../utils/constants'

/** localStorage 기반 최고 점수 관리 시스템 */
export class StorageSystem {
  private highScore: number = 0

  constructor() {
    this.highScore = this.loadHighScore()
  }

  /** localStorage에서 최고 점수 로드 */
  private loadHighScore(): number {
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY)
      if (stored === null) return 0
      const parsed = parseInt(stored, 10)
      return isNaN(parsed) ? 0 : parsed
    } catch {
      // localStorage 접근 불가 시 0 반환
      return 0
    }
  }

  /** 최고 점수 업데이트 (더 높을 때만 저장) */
  updateHighScore(score: number): void {
    if (score > this.highScore) {
      this.highScore = score
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(score))
      } catch {
        // localStorage 저장 실패 시 메모리만 업데이트
      }
    }
  }

  getHighScore(): number { return this.highScore }
}
