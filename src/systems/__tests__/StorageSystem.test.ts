import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StorageSystem } from '../StorageSystem'

describe('StorageSystem', () => {
  beforeEach(() => {
    // localStorage Mock 초기화
    localStorage.clear()
  })

  describe('최고 점수 로드 (AC-013)', () => {
    it('저장된 최고 점수 로드', () => {
      localStorage.setItem('snake_high_score', '120')
      const storage = new StorageSystem()
      expect(storage.getHighScore()).toBe(120)
    })

    it('저장된 최고 점수 없을 때 0 반환', () => {
      const storage = new StorageSystem()
      expect(storage.getHighScore()).toBe(0)
    })

    it('잘못된 값 저장 시 0 반환', () => {
      localStorage.setItem('snake_high_score', 'invalid')
      const storage = new StorageSystem()
      expect(storage.getHighScore()).toBe(0)
    })
  })

  describe('최고 점수 저장 (AC-013)', () => {
    it('현재 점수가 최고 점수보다 높으면 저장', () => {
      localStorage.setItem('snake_high_score', '50')
      const storage = new StorageSystem()
      storage.updateHighScore(80)
      expect(storage.getHighScore()).toBe(80)
    })

    it('현재 점수가 최고 점수보다 낮으면 미저장', () => {
      localStorage.setItem('snake_high_score', '100')
      const storage = new StorageSystem()
      storage.updateHighScore(60)
      expect(storage.getHighScore()).toBe(100)
    })

    it('localStorage에 실제로 저장됨', () => {
      const storage = new StorageSystem()
      storage.updateHighScore(80)
      expect(localStorage.getItem('snake_high_score')).toBe('80')
    })
  })

  describe('localStorage 오류 처리', () => {
    it('localStorage 접근 실패 시 메모리 폴백', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable')
      })
      const storage = new StorageSystem()
      expect(storage.getHighScore()).toBe(0)
      getItemSpy.mockRestore()
    })
  })
})
