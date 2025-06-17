import * as Tone from 'tone';

class AudioManager {
  private static instance: AudioManager;
  private initialized: boolean = false;
  private masterVolume: number = -12; // Reduced from -20 for 20-30% perceived volume
  private enabled: boolean = true;
  private reverb: Tone.Reverb | null = null;

  private constructor() {
    // Check if user has interacted with the page
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('audioEnabled') !== 'false';
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || !this.enabled) return;

    try {
      await Tone.start();
      Tone.Destination.volume.value = this.masterVolume;
      
      // Initialize shared reverb for luxurious spatial sound
      this.reverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0.2,
        preDelay: 0.01
      }).toDestination();
      await this.reverb.generate();
      
      this.initialized = true;
    } catch (error) {
      console.log('Audio initialization deferred until user interaction');
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioEnabled', enabled.toString());
    }
    
    if (!enabled) {
      Tone.Destination.mute = true;
    } else {
      Tone.Destination.mute = false;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    Tone.Destination.volume.value = volume;
  }

  // Elegant hover sound - subtle frequency shift
  async playHoverSound(frequency: number = 440, duration: string = '16n'): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0,
        release: 0.3
      }
    });

    if (this.reverb) {
      synth.connect(this.reverb);
    } else {
      synth.toDestination();
    }

    synth.volume.value = -18;
    // Play a perfect 5th interval for richness
    synth.triggerAttackRelease([frequency, frequency * 1.5], duration);
    
    setTimeout(() => synth.dispose(), 2000);
  }

  // Luxurious click sound - like a high-end mechanical keyboard
  async playClickSound(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.03,
        sustain: 0,
        release: 0.08
      }
    });

    if (this.reverb) {
      synth.connect(this.reverb);
    } else {
      synth.toDestination();
    }

    synth.volume.value = -15;
    // Play a chord for richness: C6, E6, G6 (C major triad)
    synth.triggerAttackRelease(['C6', 'E6', 'G6'], '32n');
    
    setTimeout(() => synth.dispose(), 1000);
  }

  // Success sound - for form submissions
  async playSuccessSound(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.2,
        release: 0.5
      }
    });

    if (this.reverb) {
      synth.connect(this.reverb);
    } else {
      synth.toDestination();
    }

    synth.volume.value = -14;
    // Ascending major chord progression
    synth.triggerAttackRelease(['C5', 'E5', 'G5'], '8n');
    setTimeout(() => {
      synth.triggerAttackRelease(['E5', 'G5', 'C6'], '8n');
    }, 150);
    
    setTimeout(() => synth.dispose(), 2000);
  }

  // Transition sound - for section reveals
  async playTransitionSound(): Promise<void> {
    if (!this.enabled) return;
    await this.initialize();

    const filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
      rolloff: -24
    });

    const synth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0,
        release: 0.8
      }
    });

    if (this.reverb) {
      synth.chain(filter, this.reverb);
    } else {
      synth.chain(filter, Tone.Destination);
    }

    synth.volume.value = -20;
    
    // Sweep the filter for a subtle whoosh effect
    filter.frequency.rampTo(100, 0.8);
    synth.triggerAttackRelease('C2', '4n');
    
    setTimeout(() => {
      synth.dispose();
      filter.dispose();
    }, 2000);
  }

  // Ambient background sound - removed as it can be cheesy
  async startAmbientSound(): Promise<Tone.Synth | null> {
    // Keeping this for compatibility but making it very subtle
    if (!this.enabled) return null;
    await this.initialize();

    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 4,
        decay: 2,
        sustain: 0.1,
        release: 4
      }
    });

    if (this.reverb) {
      synth.connect(this.reverb);
    } else {
      synth.toDestination();
    }

    synth.volume.value = -35; // Very quiet
    synth.triggerAttack('C1');

    return synth;
  }

  stopAmbientSound(synth: Tone.Synth | null): void {
    if (synth) {
      synth.triggerRelease('+2');
      setTimeout(() => synth.dispose(), 5000);
    }
  }
}

export default AudioManager.getInstance();