import { describe, it, expect, beforeEach } from 'vitest'
import { Snake } from '../Snake'
import { Direction } from '../../utils/types'
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../utils/constants'

describe('Snake', () => {
  let snake: Snake

  beforeEach(() => {
    snake = new Snake()
  })

  describe('초기화 (AC-001)', () => {
    it('보드 중앙에 3개 세그먼트로 초기화', () => {
      const segments = snake.getSegments()
      expect(segments).toHaveLength(3)
      // 보드 중앙 계산: Math.floor(BOARD_WIDTH / 2), Math.floor(BOARD_HEIGHT / 2)
      const centerX = Math.floor(BOARD_WIDTH / 2)
      const centerY = Math.floor(BOARD_HEIGHT / 2)
      expect(segments[0]).toEqual({ x: centerX, y: centerY })
    })

    it('초기 방향은 RIGHT', () => {
      expect(snake.getDirection()).toBe(Direction.RIGHT)
    })
  })

  describe('이동 (AC-002)', () => {
    it('RIGHT 방향으로 1 셀 이동', () => {
      const before = snake.getHead()
      snake.move()
      const after = snake.getHead()
      expect(after.x).toBe(before.x + 1)
      expect(after.y).toBe(before.y)
    })

    it('UP 방향으로 1 셀 이동', () => {
      snake.setNextDirection(Direction.UP)
      snake.applyDirection()
      const before = snake.getHead()
      snake.move()
      const after = snake.getHead()
      expect(after.x).toBe(before.x)
      expect(after.y).toBe(before.y - 1)
    })

    it('DOWN 방향으로 1 셀 이동', () => {
      snake.setNextDirection(Direction.DOWN)
      snake.applyDirection()
      const before = snake.getHead()
      snake.move()
      const after = snake.getHead()
      expect(after.x).toBe(before.x)
      expect(after.y).toBe(before.y + 1)
    })

    it('LEFT 방향으로 1 셀 이동', () => {
      // UP 먼저 적용해야 LEFT가 가능 (RIGHT의 반대방향인 LEFT는 무시되므로)
      const snakeForLeft = new Snake()
      snakeForLeft.setNextDirection(Direction.UP)
      snakeForLeft.applyDirection()
      snakeForLeft.setNextDirection(Direction.LEFT)
      snakeForLeft.applyDirection()
      const before = snakeForLeft.getHead()
      snakeForLeft.move()
      const after = snakeForLeft.getHead()
      expect(after.x).toBe(before.x - 1)
      expect(after.y).toBe(before.y)
    })

    it('이동 후 꼬리 세그먼트 제거 (길이 유지)', () => {
      const before = snake.getSegments().length
      snake.move()
      expect(snake.getSegments().length).toBe(before)
    })
  })

  describe('성장 (AC-003)', () => {
    it('grow() 호출 시 길이 1 증가', () => {
      const before = snake.getSegments().length
      snake.grow()
      expect(snake.getSegments().length).toBe(before + 1)
    })
  })

  describe('벽 충돌 (AC-004)', () => {
    it('오른쪽 벽 충돌 감지', () => {
      // 오른쪽 벽으로 이동
      const segments = [
        { x: BOARD_WIDTH - 1, y: 10 },
        { x: BOARD_WIDTH - 2, y: 10 },
        { x: BOARD_WIDTH - 3, y: 10 }
      ]
      const snakeAtWall = new Snake(segments, Direction.RIGHT)
      snakeAtWall.move()
      expect(snakeAtWall.checkWallCollision()).toBe(true)
    })

    it('상단 벽 충돌 감지', () => {
      const segments = [
        { x: 10, y: 0 },
        { x: 10, y: 1 },
        { x: 10, y: 2 }
      ]
      const snakeAtWall = new Snake(segments, Direction.UP)
      snakeAtWall.move()
      expect(snakeAtWall.checkWallCollision()).toBe(true)
    })

    it('하단 벽 충돌 감지', () => {
      const segments = [
        { x: 10, y: BOARD_HEIGHT - 1 },
        { x: 10, y: BOARD_HEIGHT - 2 },
        { x: 10, y: BOARD_HEIGHT - 3 }
      ]
      const snakeAtWall = new Snake(segments, Direction.DOWN)
      snakeAtWall.move()
      expect(snakeAtWall.checkWallCollision()).toBe(true)
    })

    it('왼쪽 벽 충돌 감지', () => {
      const segments = [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 2, y: 10 }
      ]
      const snakeAtWall = new Snake(segments, Direction.LEFT)
      snakeAtWall.move()
      expect(snakeAtWall.checkWallCollision()).toBe(true)
    })

    it('벽 안쪽은 충돌 없음', () => {
      expect(snake.checkWallCollision()).toBe(false)
    })
  })

  describe('자기 충돌 (AC-005)', () => {
    it('머리가 몸체와 충돌하면 true 반환', () => {
      // 충돌하는 시나리오: [(5,5), (4,5), (4,6), (5,6)] 방향 DOWN
      const segments = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 4, y: 6 },
        { x: 5, y: 6 }
      ]
      const snakeSelf = new Snake(segments, Direction.DOWN)
      snakeSelf.move()
      expect(snakeSelf.checkSelfCollision()).toBe(true)
    })

    it('정상 이동 시 자기 충돌 없음', () => {
      snake.move()
      expect(snake.checkSelfCollision()).toBe(false)
    })
  })

  describe('반대 방향 전환 방지 (AC-008)', () => {
    it('RIGHT 이동 중 LEFT 설정 무시', () => {
      expect(snake.getDirection()).toBe(Direction.RIGHT)
      snake.setNextDirection(Direction.LEFT)
      snake.applyDirection()
      expect(snake.getDirection()).toBe(Direction.RIGHT)
    })

    it('UP 이동 중 DOWN 설정 무시', () => {
      snake.setNextDirection(Direction.UP)
      snake.applyDirection()
      snake.setNextDirection(Direction.DOWN)
      snake.applyDirection()
      expect(snake.getDirection()).toBe(Direction.UP)
    })
  })
})
