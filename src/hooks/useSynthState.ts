import { useState, useCallback } from 'react';
import type { ChordType, Extensions, BassMode, PerformMode, PresetName } from '../types';

export interface SynthStateValues {
  chordType: ChordType;
  extensions: Extensions;
  voicing: number;
  octave: number;
  bpm: number;
  keyMode: string | null;
  bassMode: BassMode;
  bassVoicing: number;
  performMode: PerformMode;
  engine: PresetName;
  masterVolume: number;
  polyMode: boolean;
}

export function useSynthState() {
  const [state, setState] = useState<SynthStateValues>({
    chordType: null,
    extensions: { '6': false, 'm7': false, 'M7': false, '9': false },
    voicing: 0,
    octave: 4,
    bpm: 120,
    keyMode: null,
    bassMode: 'off',
    bassVoicing: 0,
    performMode: 'chord',
    engine: 'grandPiano',
    masterVolume: 80,
    polyMode: false,
  });

  const setChordType = useCallback((type: ChordType) => {
    setState(s => ({ ...s, chordType: type }));
  }, []);

  const toggleExtension = useCallback((ext: keyof Extensions) => {
    setState(s => ({
      ...s,
      extensions: { ...s.extensions, [ext]: !s.extensions[ext] },
    }));
  }, []);

  const setExtension = useCallback((ext: keyof Extensions, value: boolean) => {
    setState(s => ({
      ...s,
      extensions: { ...s.extensions, [ext]: value },
    }));
  }, []);

  const setVoicing = useCallback((voicing: number) => {
    setState(s => ({ ...s, voicing: Math.max(-12, Math.min(12, voicing)) }));
  }, []);

  const setOctave = useCallback((octave: number) => {
    setState(s => ({ ...s, octave: Math.max(1, Math.min(7, octave)) }));
  }, []);

  const setBpm = useCallback((bpm: number) => {
    setState(s => ({ ...s, bpm: Math.max(40, Math.min(240, bpm)) }));
  }, []);

  const setKeyMode = useCallback((mode: string | null) => {
    setState(s => ({ ...s, keyMode: mode }));
  }, []);

  const setBassMode = useCallback((mode: BassMode) => {
    setState(s => ({ ...s, bassMode: mode }));
  }, []);

  const setBassVoicing = useCallback((voicing: number) => {
    setState(s => ({ ...s, bassVoicing: Math.max(0, Math.min(11, voicing)) }));
  }, []);

  const setPerformMode = useCallback((mode: PerformMode) => {
    setState(s => ({ ...s, performMode: mode }));
  }, []);

  const setEngine = useCallback((engine: PresetName) => {
    setState(s => ({ ...s, engine }));
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    setState(s => ({ ...s, masterVolume: volume }));
  }, []);

  const setPolyMode = useCallback((enabled: boolean) => {
    setState(s => ({ ...s, polyMode: enabled }));
  }, []);

  const togglePolyMode = useCallback(() => {
    setState(s => ({ ...s, polyMode: !s.polyMode }));
  }, []);

  return {
    ...state,
    setChordType,
    toggleExtension,
    setExtension,
    setVoicing,
    setOctave,
    setBpm,
    setKeyMode,
    setBassMode,
    setBassVoicing,
    setPerformMode,
    setEngine,
    setMasterVolume,
    setPolyMode,
    togglePolyMode,
  };
}

