import { useCallback, useRef, useState } from 'react';
import * as Tone from 'tone';
import { PRESETS, BASS_PRESETS } from '../constants/presets';
import { SCALES, CHORD_INTERVALS, EXTENSION_INTERVALS, NOTE_NAMES } from '../constants/music';
import type { ChordType, Extensions, PresetName, BassMode, PerformMode } from '../types';

interface AudioRefs {
  synth: Tone.PolySynth | null;
  bassSynth: Tone.MonoSynth | null;
  reverb: Tone.Reverb | null;
  delay: Tone.PingPongDelay | null;
  chorus: Tone.Chorus | null;
  drive: Tone.Distortion | null;
  master: Tone.Gain | null;
  arpInterval: ReturnType<typeof setInterval> | null;
}

interface AudioState {
  isInitialized: boolean;
  currentRoot: number | null;
  currentChordNotes: number[];
  activeChords: Map<number, number[]>; // root -> notes for poly mode
  engine: PresetName;
}

export function useAudio() {
  const refs = useRef<AudioRefs>({
    synth: null,
    bassSynth: null,
    reverb: null,
    delay: null,
    chorus: null,
    drive: null,
    master: null,
    arpInterval: null,
  });

  const arpState = useRef({
    index: 0,
    direction: 1,
  });

  // Sync ref for active chords (used for immediate return values)
  const activeChordsRef = useRef<Map<number, number[]>>(new Map());

  const [state, setState] = useState<AudioState>({
    isInitialized: false,
    currentRoot: null,
    currentChordNotes: [],
    activeChords: new Map(),
    engine: 'grandPiano',
  });

  const initialize = useCallback(async () => {
    await Tone.start();
    
    const limiter = new Tone.Limiter(-3).toDestination();
    refs.current.reverb = new Tone.Reverb({ decay: 2.5, wet: 0 }).connect(limiter);
    const delayFilter = new Tone.Filter({ frequency: 2000, type: 'lowpass' }).connect(refs.current.reverb);
    refs.current.delay = new Tone.PingPongDelay({ delayTime: 0.375, feedback: 0.4, wet: 0 }).connect(delayFilter);
    refs.current.chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0 }).connect(refs.current.delay);
    refs.current.chorus.start();
    refs.current.drive = new Tone.Distortion({ distortion: 0.4, wet: 0 }).connect(refs.current.chorus);
    refs.current.master = new Tone.Gain(0.5).connect(refs.current.drive);
    
    refs.current.synth = PRESETS.grandPiano();
    refs.current.synth.connect(refs.current.master);
    
    refs.current.bassSynth = new Tone.MonoSynth(BASS_PRESETS[0].config as Tone.MonoSynthOptions).connect(refs.current.master);
    
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
    
    setState(s => ({ ...s, isInitialized: true }));
  }, []);

  const switchEngine = useCallback((preset: PresetName) => {
    if (!refs.current.master) return;
    if (refs.current.synth) refs.current.synth.disconnect();
    refs.current.synth = PRESETS[preset]();
    refs.current.synth.connect(refs.current.master);
    setState(s => ({ ...s, engine: preset }));
  }, []);

  const updateBassSynth = useCallback((voicing: number) => {
    if (refs.current.bassSynth) {
      refs.current.bassSynth.set(BASS_PRESETS[voicing].config as Tone.MonoSynthOptions);
    }
  }, []);

  const quantizeToScale = useCallback((note: number, root: string, scaleType: string): number => {
    const scale = SCALES[scaleType];
    if (!scale) return note;
    const noteInOctave = note % 12;
    const octave = Math.floor(note / 12);
    const rootNum = NOTE_NAMES.indexOf(root);
    let minDist = 12;
    let nearest = noteInOctave;
    for (const degree of scale) {
      const scaleTone = (rootNum + degree) % 12;
      const dist = Math.min(Math.abs(noteInOctave - scaleTone), 12 - Math.abs(noteInOctave - scaleTone));
      if (dist < minDist) {
        minDist = dist;
        nearest = scaleTone;
      }
    }
    return octave * 12 + nearest;
  }, []);

  const generateChord = useCallback((
    rootMidi: number,
    chordType: ChordType,
    extensions: Extensions,
    voicing: number
  ): number[] => {
    if (chordType === null) return [rootMidi];
    
    const intervals = [...CHORD_INTERVALS[chordType]];
    for (const [ext, active] of Object.entries(extensions)) {
      if (active) intervals.push(EXTENSION_INTERVALS[ext]);
    }
    intervals.sort((a, b) => a - b);
    
    let notes = intervals.map(i => rootMidi + i);
    
    for (let i = 0; i < Math.abs(voicing); i++) {
      if (voicing > 0 && notes.length > 0) {
        notes.push(notes.shift()! + 12);
      } else if (voicing < 0 && notes.length > 0) {
        notes.unshift(notes.pop()! - 12);
      }
    }
    
    return notes;
  }, []);

  const getChordName = useCallback((rootMidi: number, chordType: ChordType, extensions: Extensions): string => {
    const rootName = NOTE_NAMES[rootMidi % 12];
    if (chordType === null) return rootName;
    
    const typeNames = ['dim', 'm', '', 'sus'];
    let name = rootName + typeNames[chordType];
    
    const activeExts = Object.entries(extensions).filter(([, v]) => v).map(([k]) => k);
    if (activeExts.length === 0) return name;
    // Like the real Orchid: too many extensions = ???
    if (activeExts.length === 4) return '???';
    if (activeExts.length >= 3) return `${name}<sup>JAZZ</sup>`;
    if (chordType === 2 && activeExts.includes('m7') && activeExts.length === 1) return `${name}<sup>7</sup>`;
    
    let extStr = '';
    if (activeExts.includes('6')) extStr += '6';
    if (activeExts.includes('M7')) extStr += 'M7';
    else if (activeExts.includes('m7')) extStr += 'm7';
    if (activeExts.includes('9')) extStr += '9';
    
    return `${name}<sup>${extStr}</sup>`;
  }, []);

  const midiToNoteName = useCallback((midi: number): string => {
    return NOTE_NAMES[midi % 12] + Math.floor(midi / 12 - 1);
  }, []);

  const stopArp = useCallback(() => {
    if (refs.current.arpInterval) {
      clearInterval(refs.current.arpInterval);
      refs.current.arpInterval = null;
    }
  }, []);

  const stopCurrentChord = useCallback(() => {
    stopArp();
    if (refs.current.synth && state.currentChordNotes.length > 0) {
      refs.current.synth.triggerRelease(
        state.currentChordNotes.map(n => Tone.Frequency(n, 'midi').toNote())
      );
    }
    if (refs.current.bassSynth) {
      refs.current.bassSynth.triggerRelease();
    }
  }, [state.currentChordNotes, stopArp]);

  const playChord = useCallback((
    rootMidi: number,
    chordType: ChordType,
    extensions: Extensions,
    voicing: number,
    performMode: PerformMode,
    bassMode: BassMode,
    bpm: number,
    keyMode: string | null,
    velocity = 0.8,
    midiOutputCallback?: (note: number, velocity: number, isOn: boolean) => void,
    polyMode = false
  ) => {
    if (!refs.current.synth) return { notes: [], name: '' };
    
    let adjustedRoot = rootMidi;
    if (keyMode) {
      const [root, type] = keyMode.split('-');
      adjustedRoot = quantizeToScale(rootMidi, root, type);
    }
    
    // In poly mode, don't stop existing chords
    if (!polyMode) {
      stopCurrentChord();
    }
    
    const notes = generateChord(adjustedRoot, chordType, extensions, voicing);
    const name = getChordName(adjustedRoot, chordType, extensions);
    
    // Store under ORIGINAL rootMidi (not adjustedRoot) so release can find it
    // Update active chords ref synchronously for immediate return
    if (polyMode) {
      activeChordsRef.current.set(rootMidi, notes);
    } else {
      activeChordsRef.current.clear();
      activeChordsRef.current.set(rootMidi, notes);
    }
    
    // Get all active notes for display
    const allActiveNotes = Array.from(activeChordsRef.current.values()).flat();
    
    // Update state based on poly mode (use rootMidi as key for consistent lookup)
    setState(s => {
      if (polyMode) {
        const newActiveChords = new Map(s.activeChords);
        newActiveChords.set(rootMidi, notes);
        return { ...s, currentRoot: rootMidi, currentChordNotes: allActiveNotes, activeChords: newActiveChords };
      }
      return { ...s, currentRoot: rootMidi, currentChordNotes: notes, activeChords: new Map([[rootMidi, notes]]) };
    });
    
    const playChords = bassMode !== 'solo';
    
    if (playChords) {
      switch (performMode) {
        case 'chord':
          refs.current.synth.triggerAttack(
            notes.map(n => Tone.Frequency(n, 'midi').toNote()),
            Tone.now(),
            velocity
          );
          notes.forEach(n => midiOutputCallback?.(n, Math.round(velocity * 127), true));
          break;
          
        case 'strum':
        case 'slop':
          notes.forEach((note, i) => {
            let time = i * 30;
            if (performMode === 'slop') time += (Math.random() - 0.5) * 15;
            setTimeout(() => {
              refs.current.synth?.triggerAttack(Tone.Frequency(note, 'midi').toNote(), Tone.now(), velocity);
              midiOutputCallback?.(note, Math.round(velocity * 127), true);
            }, time);
          });
          break;
          
        case 'strum2oct':
          const twoOctaveNotes = [...notes, ...notes.map(n => n + 12)];
          twoOctaveNotes.forEach((note, i) => {
            setTimeout(() => {
              refs.current.synth?.triggerAttack(
                Tone.Frequency(note, 'midi').toNote(),
                Tone.now(),
                velocity * (i < notes.length ? 1 : 0.85)
              );
              midiOutputCallback?.(note, Math.round(velocity * 127), true);
            }, i * 25);
          });
          break;
          
        case 'arpUp':
        case 'arpDown':
        case 'arpUpDown':
          stopArp();
          arpState.current = { index: 0, direction: 1 };
          const intervalMs = (60 / bpm) * 1000 / 2;
          
          const playArpNote = () => {
            if (notes.length === 0) return;
            const note = notes[arpState.current.index];
            refs.current.synth?.triggerAttackRelease(
              Tone.Frequency(note, 'midi').toNote(),
              '16n',
              Tone.now(),
              velocity
            );
            midiOutputCallback?.(note, Math.round(velocity * 127), true);
            setTimeout(() => midiOutputCallback?.(note, 0, false), intervalMs * 0.9);
            
            if (performMode === 'arpUp') {
              arpState.current.index = (arpState.current.index + 1) % notes.length;
            } else if (performMode === 'arpDown') {
              arpState.current.index--;
              if (arpState.current.index < 0) arpState.current.index = notes.length - 1;
            } else {
              arpState.current.index += arpState.current.direction;
              if (arpState.current.index >= notes.length - 1) arpState.current.direction = -1;
              if (arpState.current.index <= 0) arpState.current.direction = 1;
            }
          };
          
          playArpNote();
          refs.current.arpInterval = setInterval(playArpNote, intervalMs);
          break;
          
        case 'harp':
          const extendedNotes: number[] = [];
          notes.forEach(n => { extendedNotes.push(n, n + 12, n + 24); });
          extendedNotes.sort((a, b) => a - b);
          extendedNotes.forEach((note, i) => {
            setTimeout(() => {
              refs.current.synth?.triggerAttackRelease(
                Tone.Frequency(note, 'midi').toNote(),
                '8n',
                Tone.now(),
                velocity * 0.7
              );
              midiOutputCallback?.(note, Math.round(velocity * 0.7 * 127), true);
              setTimeout(() => midiOutputCallback?.(note, 0, false), 200);
            }, i * 25);
          });
          break;
      }
    }
    
    if (bassMode !== 'off') {
      const bassNote = adjustedRoot - 24;
      if (bassMode === 'single') {
        refs.current.bassSynth?.triggerAttackRelease(
          Tone.Frequency(bassNote, 'midi').toNote(),
          '8n',
          Tone.now(),
          0.8
        );
      } else {
        refs.current.bassSynth?.triggerAttack(
          Tone.Frequency(bassNote, 'midi').toNote(),
          Tone.now(),
          0.8
        );
      }
    }
    
    // Return all active notes when in poly mode for display
    // Include active chord count for "WTF" display when 2+ chords layered
    const activeChordCount = activeChordsRef.current.size;
    return { notes: polyMode ? allActiveNotes : notes, name, activeChordCount };
  }, [stopCurrentChord, quantizeToScale, generateChord, getChordName, stopArp]);

  const releaseChord = useCallback((rootMidi: number, midiOutputCallback?: (note: number, velocity: number, isOn: boolean) => void, polyMode = false): number[] => {
    if (polyMode) {
      // In poly mode, only release the specific chord for this root
      const chordNotes = activeChordsRef.current.get(rootMidi);
      if (chordNotes && refs.current.synth) {
        chordNotes.forEach(n => midiOutputCallback?.(n, 0, false));
        refs.current.synth.triggerRelease(
          chordNotes.map(n => Tone.Frequency(n, 'midi').toNote())
        );
        // Update ref synchronously
        activeChordsRef.current.delete(rootMidi);
        const remainingNotes = Array.from(activeChordsRef.current.values()).flat();
        
        setState(s => {
          const newActiveChords = new Map(s.activeChords);
          newActiveChords.delete(rootMidi);
          const newRoot = newActiveChords.size > 0 ? Array.from(newActiveChords.keys())[newActiveChords.size - 1] : null;
          return { ...s, currentRoot: newRoot, currentChordNotes: remainingNotes, activeChords: newActiveChords };
        });
        return remainingNotes;
      }
      return Array.from(activeChordsRef.current.values()).flat();
    } else {
      // Non-poly mode: check ref synchronously instead of async state
      const chordNotes = activeChordsRef.current.get(rootMidi);
      if (chordNotes) {
        chordNotes.forEach(n => midiOutputCallback?.(n, 0, false));
        stopCurrentChord();
        activeChordsRef.current.clear();
        setState(s => ({ ...s, currentRoot: null, currentChordNotes: [], activeChords: new Map() }));
      }
    }
    return [];
  }, [stopCurrentChord]);

  const panic = useCallback(() => {
    stopArp();
    refs.current.synth?.releaseAll();
    refs.current.bassSynth?.triggerRelease();
    activeChordsRef.current.clear();
    setState(s => ({ ...s, currentRoot: null, currentChordNotes: [], activeChords: new Map() }));
  }, [stopArp]);

  const setEffect = useCallback((effect: 'reverb' | 'delay' | 'chorus' | 'drive' | 'master', value: number) => {
    const wet = value / 100;
    switch (effect) {
      case 'reverb':
        if (refs.current.reverb) refs.current.reverb.wet.value = wet;
        break;
      case 'delay':
        if (refs.current.delay) refs.current.delay.wet.value = wet;
        break;
      case 'chorus':
        if (refs.current.chorus) refs.current.chorus.wet.value = wet;
        break;
      case 'drive':
        if (refs.current.drive) refs.current.drive.wet.value = wet;
        break;
      case 'master':
        if (refs.current.master) refs.current.master.gain.value = wet;
        break;
    }
  }, []);

  const setBpm = useCallback((bpm: number) => {
    Tone.Transport.bpm.value = bpm;
  }, []);

  // Get the count of active chords (for poly mode display)
  const getActiveChordCount = useCallback(() => {
    return activeChordsRef.current.size;
  }, []);

  return {
    isInitialized: state.isInitialized,
    currentRoot: state.currentRoot,
    currentChordNotes: state.currentChordNotes,
    engine: state.engine,
    initialize,
    switchEngine,
    updateBassSynth,
    playChord,
    releaseChord,
    panic,
    setEffect,
    setBpm,
    midiToNoteName,
    getChordName,
    generateChord,
    stopArp,
    getActiveChordCount,
  };
}

