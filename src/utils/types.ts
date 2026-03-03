/** 그리드 좌표 */
export interface Position {
  x: number
  y: number
}

/** 이동 방향 열거형 */
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

/** 게임 상태 열거형 */
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

/** 스네이크 데이터 구조 */
export interface SnakeData {
  segments: Position[]
  direction: Direction
  nextDirection: Direction
}

/** 게임 전체 상태 */
export interface GameData {
  snake: SnakeData
  food: Position
  state: GameState
  score: number
  level: number
  highScore: number
  foodsEaten: number
}
