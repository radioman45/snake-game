import { Direction, GameState, Position } from './utils/types'
import { BOARD_HEIGHT, BOARD_WIDTH, GRID_SIZE, POINTS_PER_FOOD } from './utils/constants'
import { Snake } from './game/Snake'
import { Food } from './game/Food'
import { InputSystem } from './systems/InputSystem'
import { ScoreSystem } from './systems/ScoreSystem'
import { StorageSystem } from './systems/StorageSystem'
import { SoundManager } from './audio/SoundManager'

const UI_HEIGHT = 58
const LEVEL_UP_MESSAGE_DURATION_MS = 1000

class SnakeGame {
  private readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D
  private readonly input: InputSystem
  private readonly scoreSystem: ScoreSystem
  private readonly storageSystem: StorageSystem
  private readonly soundManager: SoundManager
  private readonly handleBeforeUnload: () => void
  private readonly statusElement: HTMLElement | null
  private snake: Snake
  private food: Food
  private state: GameState
  private highScore: number

  private lastFrameTime = 0
  private moveAccumulator = 0
  private animationId: number | null = null
  private levelUpMessage: string | null = null
  private levelUpMessageRemaining = 0

  constructor() {
    const canvasEl = document.getElementById('gameCanvas')
    if (!(canvasEl instanceof HTMLCanvasElement)) {
      throw new Error('gameCanvas element not found')
    }

    this.canvas = canvasEl
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to create canvas context')
    }
    this.context = ctx

    this.canvas.width = BOARD_WIDTH * GRID_SIZE
    this.canvas.height = BOARD_HEIGHT * GRID_SIZE + UI_HEIGHT
    this.canvas.setAttribute('tabindex', '0')
    this.canvas.setAttribute('aria-describedby', 'gameInstructions gameStatus')

    this.storageSystem = new StorageSystem()
    this.scoreSystem = new ScoreSystem()
    this.input = new InputSystem()
    this.soundManager = new SoundManager()
    this.statusElement = document.getElementById('gameStatus')
    this.highScore = this.storageSystem.getHighScore()
    this.state = GameState.MENU
    this.snake = new Snake()
    this.food = new Food()
    this.food.spawn(this.snake.getSegments())
    this.handleBeforeUnload = () => this.destroy()

    this.bindInputs()
    this.startLoop()
    this.render()
    this.announceStatus()
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  private bindInputs(): void {
    this.input.onPauseToggle(() => this.togglePause())
    this.input.onStartGame(() => this.startOrRestart())
    this.input.onSoundToggle(() => this.toggleSound())
    this.input.onTap(() => this.startOrRestart())
  }

  private startOrRestart(): void {
    if (this.state === GameState.GAME_OVER || this.state === GameState.MENU) {
      this.resetMatch()
      this.state = GameState.PLAYING
      this.lastFrameTime = 0
      this.moveAccumulator = 0
      this.clearLevelMessage()
      void this.canvas.focus()
      this.soundManager.resume()
      this.soundManager.startBackground()
      this.announceStatus()
      return
    }

    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING
      this.lastFrameTime = 0
      this.moveAccumulator = 0
      void this.canvas.focus()
      this.soundManager.startBackground()
      this.announceStatus()
    }
  }

  private togglePause(): void {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED
      this.clearLevelMessage()
      this.soundManager.stopBackground()
      this.announceStatus()
      return
    }

    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING
      this.soundManager.startBackground()
      this.announceStatus()
    }
  }

  private toggleSound(): void {
    const isMuted = this.soundManager.toggleMute()
    if (isMuted) {
      this.soundManager.stopBackground()
    } else if (this.state === GameState.PLAYING) {
      this.soundManager.startBackground()
    }
    this.render()
    this.announceStatus()
  }

  private resetMatch(): void {
    this.scoreSystem.reset()
    this.snake = new Snake()
    this.food = new Food()
    this.food.spawn(this.snake.getSegments())
    this.highScore = this.storageSystem.getHighScore()
    this.moveAccumulator = 0
    this.lastFrameTime = 0
    this.clearLevelMessage()
  }

  private clearLevelMessage(): void {
    this.levelUpMessage = null
    this.levelUpMessageRemaining = 0
  }

  private getNextPosition(): Position {
    const direction = this.snake.getNextDirection()
    const head = this.snake.getHead()

    switch (direction) {
      case Direction.UP:
        return { x: head.x, y: head.y - 1 }
      case Direction.DOWN:
        return { x: head.x, y: head.y + 1 }
      case Direction.LEFT:
        return { x: head.x - 1, y: head.y }
      case Direction.RIGHT:
      default:
        return { x: head.x + 1, y: head.y }
    }
  }

  private advanceGame(): void {
    if (this.state !== GameState.PLAYING) {
      return
    }

    const queuedDirection = this.input.getQueuedDirection()
    if (queuedDirection !== null) {
      this.snake.setNextDirection(queuedDirection)
    }

    const nextPosition = this.getNextPosition()
    const isFoodHit = this.isSamePos(nextPosition, this.food.getPosition())

    if (isFoodHit) {
      this.snake.grow()
    }

    this.snake.applyDirection()
    this.snake.move()

    if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
      this.endMatch()
      return
    }

    if (isFoodHit) {
      const previousLevel = this.scoreSystem.getLevel()
      this.scoreSystem.addFood()
      const currentLevel = this.scoreSystem.getLevel()

      if (currentLevel > previousLevel) {
        this.levelUpMessage = `LEVEL ${currentLevel}`
        this.levelUpMessageRemaining = LEVEL_UP_MESSAGE_DURATION_MS
        this.soundManager.playLevelUp()
      }

      this.soundManager.playEat()
      this.storageSystem.updateHighScore(this.scoreSystem.getScore())
      this.highScore = this.storageSystem.getHighScore()
      this.food.spawn(this.snake.getSegments())
      this.announceStatus()
    }
  }

  private endMatch(): void {
    this.state = GameState.GAME_OVER
    this.clearLevelMessage()
    this.storageSystem.updateHighScore(this.scoreSystem.getScore())
    this.highScore = this.storageSystem.getHighScore()
    this.soundManager.playGameOver()
    this.soundManager.stopBackground()
    this.announceStatus()
  }

  private startLoop(): void {
    const tick = (now: number) => {
      if (!this.lastFrameTime) {
        this.lastFrameTime = now
      }
      const delta = now - this.lastFrameTime
      this.lastFrameTime = now

      if (this.state === GameState.PLAYING) {
        this.moveAccumulator += delta
        const interval = this.scoreSystem.getMoveInterval()
        while (this.moveAccumulator >= interval) {
          this.advanceGame()
          this.moveAccumulator -= interval
          if (this.state !== GameState.PLAYING) {
            break
          }
        }

        if (this.levelUpMessageRemaining > 0) {
          this.levelUpMessageRemaining = Math.max(0, this.levelUpMessageRemaining - delta)
          if (this.levelUpMessageRemaining === 0) {
            this.levelUpMessage = null
          }
        }
      }

      this.render()
      this.animationId = requestAnimationFrame(tick)
    }

    this.animationId = requestAnimationFrame(tick)
  }

  private render(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.fillStyle = '#05070d'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.renderUI()
    this.renderBoard()
    this.renderStateOverlay()
    this.renderLevelUpOverlay()
  }

  private renderUI(): void {
    this.context.fillStyle = '#39ff14'
    this.context.font = 'bold 16px "Courier New", monospace'
    this.context.textBaseline = 'top'

    this.context.fillText(`SCORE ${this.scoreSystem.getScore()}`, 10, 8)
    this.context.fillText(`LEVEL ${this.scoreSystem.getLevel()}`, 160, 8)
    this.context.fillText(`BEST ${this.highScore}`, 250, 8)
    this.context.fillText(`NEXT +${POINTS_PER_FOOD}`, 10, 30)

    const status = this.getStatusText()
    this.context.fillText(status, 130, 30)

    const audioText = this.soundManager.isMuted() ? 'SOUND OFF' : 'SOUND ON'
    this.context.fillText(audioText, this.canvas.width - 96, 30)
  }

  private renderBoard(): void {
    this.context.save()
    this.context.translate(0, UI_HEIGHT)
    this.context.fillStyle = '#111827'
    this.context.fillRect(0, 0, BOARD_WIDTH * GRID_SIZE, BOARD_HEIGHT * GRID_SIZE)

    this.context.strokeStyle = 'rgba(57, 255, 20, 0.22)'
    this.context.lineWidth = 1
    for (let x = 0; x <= BOARD_WIDTH; x += 1) {
      const px = x * GRID_SIZE
      this.context.beginPath()
      this.context.moveTo(px, 0)
      this.context.lineTo(px, BOARD_HEIGHT * GRID_SIZE)
      this.context.stroke()
    }
    for (let y = 0; y <= BOARD_HEIGHT; y += 1) {
      const py = y * GRID_SIZE
      this.context.beginPath()
      this.context.moveTo(0, py)
      this.context.lineTo(BOARD_WIDTH * GRID_SIZE, py)
      this.context.stroke()
    }

    const segments = this.snake.getSegments()
    segments.forEach((segment, index) => {
      this.context.fillStyle = index === 0 ? '#00ff9d' : '#2ecc71'
      this.fillCell(segment.x, segment.y)
    })

    const food = this.food.getPosition()
    this.context.fillStyle = '#ff3b3b'
    this.fillCell(food.x, food.y)

    this.context.restore()
  }

  private fillCell(x: number, y: number): void {
    const size = GRID_SIZE - 2
    this.context.fillRect(x * GRID_SIZE + 1, y * GRID_SIZE + 1, size, size)
  }

  private renderStateOverlay(): void {
    if (this.state === GameState.PLAYING) {
      return
    }

    const lines: string[] = []
    if (this.state === GameState.MENU) {
      lines.push('SNAKE GAME')
      lines.push('Press Enter or Tap to Start')
      lines.push('Press M to Toggle Sound')
    }
    if (this.state === GameState.PAUSED) {
      lines.push('PAUSED')
      lines.push('Press Space / P or Tap to Resume')
    }
    if (this.state === GameState.GAME_OVER) {
      lines.push('GAME OVER')
      lines.push(`Score ${this.scoreSystem.getScore()}`)
      lines.push(`Best ${this.highScore}`)
      lines.push('Press Enter or Tap to Restart')
    }

    this.renderCenteredBanner(lines)
  }

  private renderLevelUpOverlay(): void {
    if (this.state !== GameState.PLAYING || !this.levelUpMessage) {
      return
    }
    if (this.levelUpMessageRemaining <= 0) {
      this.levelUpMessage = null
      return
    }
    this.renderCenteredBanner([this.levelUpMessage, 'Speed increased'])
  }

  private renderCenteredBanner(lines: string[]): void {
    if (lines.length === 0) {
      return
    }

    const boardX = 0
    const boardY = UI_HEIGHT
    const boardWidth = BOARD_WIDTH * GRID_SIZE
    const boardHeight = BOARD_HEIGHT * GRID_SIZE
    const lineHeight = 24

    const widths = lines.map((line, index) => {
      const isTitle = index === 0 && lines.length > 1
      const font = isTitle ? 'bold 20px "Courier New", monospace' : '15px "Courier New", monospace'
      this.context.font = font
      return this.context.measureText(line).width
    })

    const maxLineWidth = Math.max(...widths, 0)
    const paddingX = 24
    const paddingY = 16
    const boxWidth = Math.max(220, maxLineWidth + paddingX)
    const boxHeight = lines.length * lineHeight + paddingY
    const x = boardX + boardWidth / 2 - boxWidth / 2
    const y = boardY + boardHeight / 2 - boxHeight / 2

    this.context.save()
    this.context.fillStyle = 'rgba(5, 7, 13, 0.78)'
    this.context.fillRect(x, y, boxWidth, boxHeight)
    this.context.strokeStyle = 'rgba(57, 255, 20, 0.65)'
    this.context.lineWidth = 2
    this.context.strokeRect(x, y, boxWidth, boxHeight)

    this.context.textAlign = 'center'
    this.context.textBaseline = 'top'
    this.context.fillStyle = '#39ff14'

    lines.forEach((line, index) => {
      const isTitle = index === 0 && lines.length > 1
      this.context.font = isTitle ? 'bold 20px "Courier New", monospace' : '15px "Courier New", monospace'
      const top = y + 8 + index * lineHeight
      this.context.fillText(line, boardX + boardWidth / 2, top)
    })

    this.context.restore()
  }

  private getStatusText(): string {
    if (this.state === GameState.MENU) {
      return 'Press Enter or tap to start'
    }
    if (this.state === GameState.PAUSED) {
      return 'Press Space/P or tap to resume'
    }
    if (this.state === GameState.GAME_OVER) {
      return 'Game Over - Press Enter or tap'
    }
    return 'Press Space/P to Pause'
  }

  private isSamePos(a: Position, b: Position): boolean {
    return a.x === b.x && a.y === b.y
  }

  private announceStatus(): void {
    if (!this.statusElement) {
      return
    }
    const muteText = this.soundManager.isMuted() ? 'off' : 'on'
    this.statusElement.textContent = `Score ${this.scoreSystem.getScore()}, Level ${this.scoreSystem.getLevel()}, Best ${this.highScore}. ${this.getStatusText()}. Audio ${muteText}.`
  }

  private destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.input.destroy()
    this.soundManager.stopBackground()
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }
}

new SnakeGame()
