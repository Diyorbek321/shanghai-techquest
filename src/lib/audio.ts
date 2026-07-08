class AudioManager {
  private ctx: AudioContext | null = null;
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playHover() {
    this.playTone(400, 'sine', 0.05, 0.1);
  }

  playClick() {
    this.playTone(600, 'square', 0.1, 0.15);
  }

  playNotification() {
    this.playTone(800, 'sine', 0.1, 0.3);
    setTimeout(() => this.playTone(1200, 'sine', 0.1, 0.5), 100);
  }

  playLevelUp() {
    this.playTone(440, 'triangle', 0.1, 0.3);
    setTimeout(() => this.playTone(554, 'triangle', 0.1, 0.3), 150);
    setTimeout(() => this.playTone(659, 'triangle', 0.1, 0.5), 300);
  }

  private playTone(frequency: number, type: OscillatorType, volume: number, duration: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  }
}

export const audioManager = new AudioManager();
