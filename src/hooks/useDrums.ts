import { useCallback, useRef, useState } from 'react';
import * as Tone from 'tone';
import { DRUM_PATTERNS } from '../constants/drums';
import type { DrumType } from '../types';

interface DrumRefs {
  kick: Tone.MembraneSynth | null;
  snare: Tone.NoiseSynth | null;
  hihat: Tone.MetalSynth | null;
  hihatOpen: Tone.MetalSynth | null;
  rimshot: Tone.NoiseSynth | null;
  beatInterval: ReturnType<typeof setInterval> | null;
}

export function useDrums() {
  const refs = useRef<DrumRefs>({
    kick: null,
    snare: null,
    hihat: null,
    hihatOpen: null,
    rimshot: null,
    beatInterval: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(0);

  const initialize = useCallback(() => {
    const drumGain = new Tone.Gain(0.5).toDestination();
    
    refs.current.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 },
    }).connect(drumGain);
    
    refs.current.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    }).connect(drumGain);
    
    refs.current.hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(new Tone.Gain(0.15).connect(drumGain));
    
    refs.current.hihatOpen = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.2, release: 0.05 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(new Tone.Gain(0.12).connect(drumGain));
    
    refs.current.rimshot = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.03 },
    }).connect(new Tone.Gain(0.3).connect(drumGain));
  }, []);

  const playHit = useCallback((type: DrumType) => {
    switch (type) {
      case 'k':
        refs.current.kick?.triggerAttackRelease('C1', '8n');
        break;
      case 's':
        refs.current.snare?.triggerAttackRelease('8n');
        break;
      case 'h':
        refs.current.hihat?.triggerAttackRelease('C6', '32n');
        break;
      case 'o':
        refs.current.hihatOpen?.triggerAttackRelease('C6', '16n');
        break;
      case 'r':
        refs.current.rimshot?.triggerAttackRelease('32n');
        break;
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (refs.current.beatInterval) {
      clearInterval(refs.current.beatInterval);
      refs.current.beatInterval = null;
    }
  }, []);

  const startLoop = useCallback((bpm: number, patternIndex?: number) => {
    stopLoop();
    
    const pattern = DRUM_PATTERNS[patternIndex ?? currentPattern];
    const beatDuration = (60 / bpm) * 1000;
    const sixteenthNote = beatDuration / 4;
    let currentBeat = 1;

    const playDrumsForBeat = (beat: number) => {
      pattern.pattern.forEach(([b, type]) => {
        if (Math.abs(b - beat) < 0.05) playHit(type);
      });
    };

    playDrumsForBeat(currentBeat);

    refs.current.beatInterval = setInterval(() => {
      currentBeat += 0.25;
      if (currentBeat > 4.75) currentBeat = 1;
      playDrumsForBeat(currentBeat);
    }, sixteenthNote);

    setIsPlaying(true);
  }, [currentPattern, playHit, stopLoop]);

  const stop = useCallback(() => {
    stopLoop();
    setIsPlaying(false);
  }, [stopLoop]);

  const cyclePattern = useCallback((direction: 1 | -1) => {
    setCurrentPattern(prev => {
      const next = (prev + direction + DRUM_PATTERNS.length) % DRUM_PATTERNS.length;
      return next;
    });
  }, []);

  const selectPattern = useCallback((index: number) => {
    setCurrentPattern(index);
  }, []);

  const getPatternName = useCallback((index?: number) => {
    return DRUM_PATTERNS[index ?? currentPattern]?.name ?? '';
  }, [currentPattern]);

  return {
    isPlaying,
    currentPattern,
    patterns: DRUM_PATTERNS,
    initialize,
    startLoop,
    stop,
    cyclePattern,
    selectPattern,
    getPatternName,
  };
}

