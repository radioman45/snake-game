import { describe, it, expect, beforeEach } from 'vitest'
import { ScoreSystem } from '../ScoreSystem'
import { BASE_SPEED, SPEED_MULTIPLIER } from '../../utils/constants'

describe('ScoreSystem', () => {
  let score: ScoreSystem

  beforeEach(() => {
    score = new ScoreSystem()
  })

  describe('점수 계산 (AC-010)', () => {
    it('초기 점수는 0', () => {
      expect(score.getScore()).toBe(0)
    })

    it('먹이 1개 획득 시 10점 증가', () => {
      score.addFood()
      expect(score.getScore()).toBe(10)
    })

    it('연속 획득 누적', () => {
      score.addFood()
      score.addFood()
      score.addFood()
      expect(score.getScore()).toBe(30)
    })
  })

  describe('레벨 진행 (AC-011)', () => {
    it('초기 레벨은 1', () => {
      expect(score.getLevel()).toBe(1)
    })

    it('먹이 4개로 레벨 2', () => {
      for (let i = 0; i < 4; i++) score.addFood()
      expect(score.getLevel()).toBe(2)
    })

    it('먹이 8개로 레벨 3', () => {
      for (let i = 0; i < 8; i++) score.addFood()
      expect(score.getLevel()).toBe(3)
    })

    it('먹이 3개는 여전히 레벨 1', () => {
      for (let i = 0; i < 3; i++) score.addFood()
      expect(score.getLevel()).toBe(1)
    })
  })

  describe('속도 계산 (AC-012)', () => {
    it('레벨 1 속도: BASE_SPEED / 1.15', () => {
      for (let i = 0; i < 4; i++) score.addFood()
      const expected = Math.round(BASE_SPEED / (1 + 1 * SPEED_MULTIPLIER))
      expect(score.getMoveInterval()).toBeCloseTo(expected, 0)
    })

    it('레벨 2 속도: BASE_SPEED / 1.30', () => {
      for (let i = 0; i < 8; i++) score.addFood()
      const expected = Math.round(BASE_SPEED / (1 + 2 * SPEED_MULTIPLIER))
      expect(score.getMoveInterval()).toBeCloseTo(expected, 0)
    })

    it('레벨 5 속도: BASE_SPEED / 1.75', () => {
      for (let i = 0; i < 20; i++) score.addFood()
      const expected = Math.round(BASE_SPEED / (1 + 5 * SPEED_MULTIPLIER))
      expect(score.getMoveInterval()).toBeCloseTo(expected, 0)
    })
  })

  describe('리셋', () => {
    it('reset() 후 초기 상태로', () => {
      score.addFood()
      score.addFood()
      score.reset()
      expect(score.getScore()).toBe(0)
      expect(score.getLevel()).toBe(1)
      expect(score.getFoodsEaten()).toBe(0)
    })
  })
})
