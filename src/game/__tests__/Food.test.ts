import { describe, it, expect } from 'vitest'
import { Food } from '../Food'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../utils/constants'
import { Position } from '../../utils/types'

describe('Food', () => {
  describe('초기화', () => {
    it('보드 범위 내에 생성', () => {
      const food = new Food()
      const pos = food.getPosition()
      expect(pos.x).toBeGreaterThanOrEqual(0)
      expect(pos.x).toBeLessThan(BOARD_WIDTH)
      expect(pos.y).toBeGreaterThanOrEqual(0)
      expect(pos.y).toBeLessThan(BOARD_HEIGHT)
    })
  })

  describe('새 먹이 생성 (AC-006)', () => {
    it('스네이크 몸체 위에 생성되지 않음', () => {
      // 스네이크가 대부분 공간 차지하는 시나리오
      const snakeSegments: Position[] = []
      // 10x10 = 100개 세그먼트로 대부분 차지
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          snakeSegments.push({ x, y })
        }
      }

      const food = new Food()
      food.spawn(snakeSegments)
      const pos = food.getPosition()

      // 생성된 위치가 스네이크 세그먼트와 겹치지 않아야 함
      const isOnSnake = snakeSegments.some(seg => seg.x === pos.x && seg.y === pos.y)
      expect(isOnSnake).toBe(false)
    })

    it('보드 범위 내에 생성', () => {
      const food = new Food()
      food.spawn([])
      const pos = food.getPosition()
      expect(pos.x).toBeGreaterThanOrEqual(0)
      expect(pos.x).toBeLessThan(BOARD_WIDTH)
      expect(pos.y).toBeGreaterThanOrEqual(0)
      expect(pos.y).toBeLessThan(BOARD_HEIGHT)
    })

    it('특정 위치 제외하고 생성 (AC-006)', () => {
      const excludePositions: Position[] = [
        { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }
      ]
      const food = new Food()
      // 여러 번 생성해서 항상 제외 위치에 생성되지 않는지 확인
      for (let i = 0; i < 20; i++) {
        food.spawn(excludePositions)
        const pos = food.getPosition()
        const isExcluded = excludePositions.some(e => e.x === pos.x && e.y === pos.y)
        expect(isExcluded).toBe(false)
      }
    })

    it('수동 위치 설정', () => {
      const food = new Food()
      food.setPosition({ x: 5, y: 7 })
      expect(food.getPosition()).toEqual({ x: 5, y: 7 })
    })
  })
})
