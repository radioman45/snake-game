import { Direction } from '../utils/types'

type PauseHandler = () => void
type StartHandler = () => void

/** 키보드 입력 처리 시스템 */
export class InputSystem {
  private queuedDirection: Direction | null = null
  private pauseHandlers: PauseHandler[] = []
  private startHandlers: StartHandler[] = []
  private boundKeyHandler: (e: KeyboardEvent) => void

  constructor() {
    this.boundKeyHandler = (e: KeyboardEvent) => {
      e.preventDefault()
      this.handleKey(e.key)
    }
    window.addEventListener('keydown', this.boundKeyHandler)
  }

  /** 키 입력 처리 (테스트에서 직접 호출 가능) */
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
        // Space 키: 일시정지 토글
        this.pauseHandlers.forEach(h => h())
        break
      case 'p':
      case 'P':
        // P 키: 일시정지 토글
        this.pauseHandlers.forEach(h => h())
        break
      case 'Enter':
        // Enter 키: 게임 시작
        this.startHandlers.forEach(h => h())
        break
    }
  }

  /** 다음 방향 큐 소비 (1회 소비 후 null) */
  getQueuedDirection(): Direction | null {
    const dir = this.queuedDirection
    this.queuedDirection = null
    return dir
  }

  /** 일시정지 핸들러 등록 */
  onPauseToggle(handler: PauseHandler): void {
    this.pauseHandlers.push(handler)
  }

  /** 게임 시작 핸들러 등록 */
  onStartGame(handler: StartHandler): void {
    this.startHandlers.push(handler)
  }

  /** 이벤트 리스너 정리 */
  destroy(): void {
    window.removeEventListener('keydown', this.boundKeyHandler)
    this.pauseHandlers = []
    this.startHandlers = []
  }
}
