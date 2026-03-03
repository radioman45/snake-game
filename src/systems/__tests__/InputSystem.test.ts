import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InputSystem } from '../InputSystem'
import { Direction } from '../../utils/types'

describe('InputSystem', () => {
  let input: InputSystem

  beforeEach(() => {
    input = new InputSystem()
  })

  describe('방향 입력 (AC-007)', () => {
    it('ArrowUp 키로 UP 방향 설정', () => {
      // RIGHT로 이동 중이므로 UP 설정 가능
      input.handleKey('ArrowUp')
      expect(input.getQueuedDirection()).toBe(Direction.UP)
    })

    it('ArrowDown 키로 DOWN 방향 설정', () => {
      input.handleKey('ArrowDown')
      expect(input.getQueuedDirection()).toBe(Direction.DOWN)
    })

    it('ArrowLeft 키로 LEFT 방향 설정', () => {
      // 초기 방향이 RIGHT이면 LEFT는 반대방향 (InputSystem 레벨에서는 받고 Snake 레벨에서 무시)
      input.handleKey('ArrowLeft')
      expect(input.getQueuedDirection()).toBe(Direction.LEFT)
    })

    it('ArrowRight 키로 RIGHT 방향 설정', () => {
      input.handleKey('ArrowRight')
      expect(input.getQueuedDirection()).toBe(Direction.RIGHT)
    })
  })

  describe('일시정지 토글 (AC-009)', () => {
    it('Space 키 입력 감지', () => {
      const pauseHandler = vi.fn()
      input.onPauseToggle(pauseHandler)
      input.handleKey(' ')
      expect(pauseHandler).toHaveBeenCalledOnce()
    })

    it('P 키 입력 감지', () => {
      const pauseHandler = vi.fn()
      input.onPauseToggle(pauseHandler)
      input.handleKey('p')
      expect(pauseHandler).toHaveBeenCalledOnce()
    })
  })

  describe('게임 시작 키 (AC-017)', () => {
    it('Enter 키 입력 감지', () => {
      const startHandler = vi.fn()
      input.onStartGame(startHandler)
      input.handleKey('Enter')
      expect(startHandler).toHaveBeenCalledOnce()
    })
  })

  describe('방향 큐 소비', () => {
    it('getQueuedDirection() 호출 후 null 반환', () => {
      input.handleKey('ArrowUp')
      input.getQueuedDirection()
      expect(input.getQueuedDirection()).toBeNull()
    })
  })
})
