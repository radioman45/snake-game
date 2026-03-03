import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InputSystem } from '../InputSystem'
import { Direction } from '../../utils/types'

describe('InputSystem', () => {
  let input: InputSystem

  beforeEach(() => {
    vi.restoreAllMocks()
    input = new InputSystem()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Arrow key mapping', () => {
    it('maps ArrowUp to UP', () => {
      input.handleKey('ArrowUp')
      expect(input.getQueuedDirection()).toBe(Direction.UP)
    })

    it('maps ArrowDown to DOWN', () => {
      input.handleKey('ArrowDown')
      expect(input.getQueuedDirection()).toBe(Direction.DOWN)
    })

    it('maps ArrowLeft to LEFT', () => {
      input.handleKey('ArrowLeft')
      expect(input.getQueuedDirection()).toBe(Direction.LEFT)
    })

    it('maps ArrowRight to RIGHT', () => {
      input.handleKey('ArrowRight')
      expect(input.getQueuedDirection()).toBe(Direction.RIGHT)
    })
  })

  describe('Pause action', () => {
    it('fires pause handler on Space', () => {
      const pauseHandler = vi.fn()
      input.onPauseToggle(pauseHandler)
      input.handleKey(' ')
      expect(pauseHandler).toHaveBeenCalledOnce()
    })

    it('fires pause handler on P', () => {
      const pauseHandler = vi.fn()
      input.onPauseToggle(pauseHandler)
      input.handleKey('p')
      expect(pauseHandler).toHaveBeenCalledOnce()
    })
  })

  describe('Start action', () => {
    it('fires start handler on Enter', () => {
      const startHandler = vi.fn()
      input.onStartGame(startHandler)
      input.handleKey('Enter')
      expect(startHandler).toHaveBeenCalledOnce()
    })
  })

  describe('Direction queue', () => {
    it('returns null after consuming queued direction', () => {
      input.handleKey('ArrowUp')
      input.getQueuedDirection()
      expect(input.getQueuedDirection()).toBeNull()
    })
  })

  describe('Tap and swipe', () => {
    it('fires tap handler for quick minimal movement', () => {
      const tapHandler = vi.fn()
      input.onTap(tapHandler)

      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1030)

      input.handleTouchStart({
        changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)
      input.handleTouchEnd({
        changedTouches: [{ clientX: 104, clientY: 104 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)

      expect(tapHandler).toHaveBeenCalledOnce()
    })

    it('ignores long press as tap within handler list', () => {
      const tapHandler = vi.fn()
      input.onTap(tapHandler)

      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1300)

      input.handleTouchStart({
        changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)
      input.handleTouchEnd({
        changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)

      expect(tapHandler).not.toHaveBeenCalled()
      expect(input.getQueuedDirection()).toBeNull()
    })

    it('maps horizontal swipe to RIGHT direction', () => {
      input.handleTouchStart({
        changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)
      input.handleTouchEnd({
        changedTouches: [{ clientX: 140, clientY: 100 } as Touch],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent)
      expect(input.getQueuedDirection()).toBe(Direction.RIGHT)
    })
  })
})
