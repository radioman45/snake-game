import { BASE_SPEED, SPEED_MULTIPLIER, POINTS_PER_FOOD, FOODS_PER_LEVEL } from '../utils/constants'

/** 점수, 레벨, 속도 관리 시스템 */
export class ScoreSystem {
  private score: number = 0
  private level: number = 1
  private foodsEaten: number = 0

  /** 먹이 획득: 점수 추가 및 레벨 업데이트 */
  addFood(): void {
    this.score += POINTS_PER_FOOD
    this.foodsEaten++
    // 먹이 N개마다 레벨업
    this.level = Math.floor(this.foodsEaten / FOODS_PER_LEVEL) + 1
  }

  /** 레벨에 따른 이동 간격 계산 (밀리초) */
  getMoveInterval(): number {
    return BASE_SPEED / (1 + (this.level - 1) * SPEED_MULTIPLIER)
  }

  /** 시스템 초기화 */
  reset(): void {
    this.score = 0
    this.level = 1
    this.foodsEaten = 0
  }

  getScore(): number { return this.score }
  getLevel(): number { return this.level }
  getFoodsEaten(): number { return this.foodsEaten }
}
