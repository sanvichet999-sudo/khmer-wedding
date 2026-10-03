// Web Audio API Synthesizer for Authentic Wedding Ambient Chimes
// Pentatonic notes creating a serene, traditional royal Cambodian celebration melody

class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  // Traditional Khmer pentatonic scale frequencies (tuned warmly in Eb / C minor pentatonic)
  // C4, Eb4, F4, G4, Bb4, C5, Eb5, F5, G5
  private scale = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25, 622.25, 698.46, 783.99];

  // A graceful melodic arpeggio sequence reminiscent of gentle wedding bells & harp
  private melodyIndex = 0;
  private pattern = [
    0, 2, 3, 5, 4, 3, 2, 0,
    1, 3, 4, 6, 5, 4, 3, 1,
    2, 4, 5, 7, 6, 5, 4, 2,
    3, 5, 6, 8, 7, 5, 4, 2
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.melodyIndex = 0;
    this.scheduleNextNote();
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const noteIdx = this.pattern[this.melodyIndex % this.pattern.length];
    const freq = this.scale[noteIdx];
    this.playChimeNote(freq);

    this.melodyIndex++;
    // Pace between notes: 380ms - 520ms for dreamy, ambient flow
    const nextInterval = 440;
    this.timerId = window.setTimeout(this.scheduleNextNote, nextInterval);
  };

  private playChimeNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Main chime oscillator (sine)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm overtone oscillator (triangle with subtle detune)
    const overtone = this.ctx.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);
    overtone.detune.setValueAtTime(4, now);

    // Note envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);

    noteGain.connect(this.masterGain);
    overtoneGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);

    osc.stop(now + 1.25);
    overtone.stop(now + 0.85);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioPlayer();
