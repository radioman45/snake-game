import { Direction } from '../utils/types'

type PauseHandler = () => void
type StartHandler = () => void
type SoundToggleHandler = () => void
type TapHandler = () => void

type TouchPoint = {
  x: number
  y: number
  timestamp: number
}

// Keep keyboard and touch control handling in one place.
export class InputSystem {
  private queuedDirection: Direction | null = null
  private pauseHandlers: PauseHandler[] = []
  private startHandlers: StartHandler[] = []
  private soundToggleHandlers: SoundToggleHandler[] = []
  private tapHandlers: TapHandler[] = []
  private boundKeyHandler: (e: KeyboardEvent) => void
  private boundTouchStartHandler: (e: TouchEvent) => void
  private boundTouchEndHandler: (e: TouchEvent) => void
  private boundTouchCancelHandler: () => void
  private touchStartPoint: TouchPoint | null = null
  private readonly swipeThreshold = 24
  private readonly tapWindowMs = 280

  constructor() {
    this.boundKeyHandler = (e: KeyboardEvent) => {
      e.preventDefault()
      this.handleKey(e.key)
    }
    this.boundTouchStartHandler = (e: TouchEvent) => {
      this.handleTouchStart(e)
    }
    this.boundTouchEndHandler = (e: TouchEvent) => {
      this.handleTouchEnd(e)
    }
    this.boundTouchCancelHandler = () => {
      this.touchStartPoint = null
    }

    window.addEventListener('keydown', this.boundKeyHandler)
    window.addEventListener('touchstart', this.boundTouchStartHandler, { passive: false })
    window.addEventListener('touchend', this.boundTouchEndHandler, { passive: false })
    window.addEventListener('touchcancel', this.boundTouchCancelHandler, { passive: false })
  }

  // Keyboard control routing.
  handleKey(key: string): void {
    switch (key) {
      case 'ArrowUp':
        this.queuedDirection = Direction.UP
        break
      case 'ArrowDown':
        this.queuedDirection = Direction.DOWN
        break
      case 'ArrowLeft':
        this.queuedDirection = Direction.LEFT
        break
      case 'ArrowRight':
        this.queuedDirection = Direction.RIGHT
        break
      case ' ':
        this.pauseHandlers.forEach(h => h())
        break
      case 'p':
      case 'P':
        this.pauseHandlers.forEach(h => h())
        break
      case 'm':
      case 'M':
        this.soundToggleHandlers.forEach(h => h())
        break
      case 'Enter':
        this.startHandlers.forEach(h => h())
        break
      default:
        break
    }
  }

  handleTouchStart(event: TouchEvent): void {
    if (event.changedTouches.length === 0) {
      return
    }

    event.preventDefault()
    const touch = event.changedTouches[0]
    this.touchStartPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: performance.now(),
    }
  }

  // Swipe controls direction, small and quick movement is treated as tap.
  handleTouchEnd(event: TouchEvent): void {
    if (!this.touchStartPoint || event.changedTouches.length === 0) {
      return
    }

    event.preventDefault()
    const touch = event.changedTouches[0]
    const dx = touch.clientX - this.touchStartPoint.x
    const dy = touch.clientY - this.touchStartPoint.y
    const elapsedMs = performance.now() - this.touchStartPoint.timestamp

    this.touchStartPoint = null

    if (Math.abs(dx) < this.swipeThreshold && Math.abs(dy) < this.swipeThreshold) {
      if (elapsedMs <= this.tapWindowMs) {
        this.tapHandlers.forEach(h => h())
      }
      return
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.queuedDirection = dx > 0 ? Direction.RIGHT : Direction.LEFT
    } else if (Math.abs(dy) > 0) {
      this.queuedDirection = dy > 0 ? Direction.DOWN : Direction.UP
    }
  }

  getQueuedDirection(): Direction | null {
    const dir = this.queuedDirection
    this.queuedDirection = null
    return dir
  }

  onPauseToggle(handler: PauseHandler): void {
    this.pauseHandlers.push(handler)
  }

  onStartGame(handler: StartHandler): void {
    this.startHandlers.push(handler)
  }

  onSoundToggle(handler: SoundToggleHandler): void {
    this.soundToggleHandlers.push(handler)
  }

  onTap(handler: TapHandler): void {
    this.tapHandlers.push(handler)
  }

  destroy(): void {
    window.removeEventListener('keydown', this.boundKeyHandler)
    window.removeEventListener('touchstart', this.boundTouchStartHandler)
    window.removeEventListener('touchend', this.boundTouchEndHandler)
    window.removeEventListener('touchcancel', this.boundTouchCancelHandler)
    this.pauseHandlers = []
    this.startHandlers = []
    this.soundToggleHandlers = []
    this.tapHandlers = []
    this.touchStartPoint = null
  }
}
