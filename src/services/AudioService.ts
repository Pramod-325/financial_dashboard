// src/services/AudioService.ts
export class AudioService {
  private static instance: AudioService;
  private sounds: Map<string, HTMLAudioElement>;

  private constructor() {
    this.sounds = new Map();
    this.initializeSounds();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initializeSounds() {
    this.loadSound('click', '../public/assets/audio/click_sound.mp3');
    this.loadSound('addMoney', '../public/assets/audio/add_money.mp3');
    this.loadSound('expense', '../public/assets/audio/expenditure_sound.mp3');
    this.loadSound('profit', '../public/assets/audio/profit_sound.mp3');
    this.loadSound('loss', '../public/assets/audio/negative_balance_sound.mp3');
    this.loadSound('laugh', '../public/assets/audio/happy_laugh.mp3');
    this.loadSound('pageFlip', '../public/assets/audio/page_flip_sound.mp3');
  }

  private loadSound(key: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto'; // Force browser to load it early
    this.sounds.set(key, audio);
  }

  public play(key: string) {
    const sound = this.sounds.get(key);
    if (sound) {
      // Clone the node so rapid clicks don't interrupt the previous sound
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.volume = 0.6; 
      
      // The promise catch prevents browser crash errors if interaction policy blocks it
      clone.play().catch(e => {
        console.warn(`Audio blocked by browser. User must click the page first. Error:`, e);
      });
    }
  }
}