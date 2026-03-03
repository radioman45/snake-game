type OscillatorConfig = {
  frequency: number
  durationMs: number
  gain: number
}

/** 간단한 Web Audio 기반 효과음/배경음 제어기 */
export class SoundManager {
  private readonly preferredMuted = false
  private muted = false
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private backgroundOscillator: OscillatorNode | null = null
  private backgroundLfo: OscillatorNode | null = null
  private readonly uiGain = 0.08

  constructor() {
    this.muted = this.preferredMuted
  }

  setMuted(isMuted: boolean): void {
    this.muted = isMuted
    if (this.masterGain) {
      this.masterGain.gain.value = isMuted ? 0 : this.uiGain
    }
    if (isMuted) {
      this.stopBackground()
    }
  }

  isMuted(): boolean {
    return this.muted
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  resume(): void {
    const context = this.ensureContext()
    if (!context) {
      return
    }
    if (context.state === 'suspended') {
      void context.resume()
    }
  }

  playEat(): void {
    if (this.muted) {
      return
    }
    this.playTone({ frequency: 880, durationMs: 70, gain: 0.22 })
  }

  playLevelUp(): void {
    if (this.muted) {
      return
    }
    this.playTone({ frequency: 520, durationMs: 110, gain: 0.16 })
    this.playTone({ frequency: 700, durationMs: 110, gain: 0.16 })
  }

  playGameOver(): void {
    if (this.muted) {
      return
    }
    this.playTone({ frequency: 180, durationMs: 200, gain: 0.2 })
  }

  startBackground(): void {
    if (this.muted) {
      return
    }
    if (this.backgroundOscillator) {
      return
    }

    const context = this.ensureContext()
    if (!context || !this.masterGain) {
      return
    }

    const osc = context.createOscillator()
    const lfo = context.createOscillator()
    const lfoGain = context.createGain()

    osc.type = 'triangle'
    osc.frequency.value = 110

    lfo.type = 'sine'
    lfo.frequency.value = 0.4
    lfoGain.gain.value = 4
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    lfo.start()

    osc.connect(this.masterGain)
    osc.start()
    this.backgroundOscillator = osc
    this.backgroundLfo = lfo
  }

  stopBackground(): void {
    if (this.backgroundOscillator) {
      this.backgroundOscillator.stop()
      this.backgroundOscillator.disconnect()
      this.backgroundOscillator = null
    }
    if (this.backgroundLfo) {
      this.backgroundLfo.stop()
      this.backgroundLfo.disconnect()
      this.backgroundLfo = null
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.audioContext) {
      const Ctor = globalThis.AudioContext || (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) {
        return null
      }
      const context = new Ctor()
      const master = context.createGain()
      master.gain.value = this.uiGain
      master.connect(context.destination)
      this.audioContext = context
      this.masterGain = master
    }
    return this.audioContext
  }

  private playTone(config: OscillatorConfig): void {
    const context = this.ensureContext()
    if (!context || !this.masterGain) {
      return
    }

    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = 'square'
    osc.frequency.value = config.frequency
    gain.gain.value = config.gain

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + config.durationMs / 1000)
    osc.stop(context.currentTime + config.durationMs / 1000)

    osc.addEventListener('ended', () => {
      osc.disconnect()
      gain.disconnect()
    })
  }
}
