// Spatial Web Audio API Engine
// Synthesizes dynamic stereo-panned cyber soundscapes based on cursor X position

class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private panner: StereoPannerNode | null = null;
  private masterGain: GainNode | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Initialized on first user interaction to comply with browser autoplay policies
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15; // Safe comfortable ambient volume

      if (this.panner) {
        this.panner.connect(this.masterGain);
      }
      this.masterGain.connect(this.ctx.destination);
      this.isEnabled = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public setPan(xRatio: number) {
    // xRatio from -1 (far left) to +1 (far right)
    if (!this.panner || !this.ctx) return;
    const clamped = Math.max(-1, Math.min(1, xRatio));
    this.panner.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public playCardHover(panX: number = 0, freq: number = 520) {
    this.init();
    if (!this.ctx || !this.masterGain || this.ctx.state === "suspended") {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }

    try {
      this.setPan(panX);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      if (this.panner) {
        osc.connect(gain);
        gain.connect(this.panner);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  }

  public playLaserPulse(panX: number = 0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.setPan(panX);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      if (this.panner) {
        osc.connect(gain);
        gain.connect(this.panner);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {
      // ignore
    }
  }
}

export const spatialAudio = new SpatialAudioEngine();
