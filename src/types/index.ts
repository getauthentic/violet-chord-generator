export type ChordType = 0 | 1 | 2 | 3 | null; // dim, min, maj, sus

export type Extension = '6' | 'm7' | 'M7' | '9';

export type Extensions = Record<Extension, boolean>;

export type BassMode = 'off' | 'unison' | 'single' | 'solo';

export type PerformMode = 'chord' | 'strum' | 'strum2oct' | 'slop' | 'arpUp' | 'arpDown' | 'arpUpDown' | 'harp';

export type PresetName = 
  // Keys
  | 'grandPiano' | 'electricPiano' | 'rhodesWarm' | 'wurlitzer' | 'clavinet' | 'harpsichord' | 'celesta' | 'musicBox'
  // Organ
  | 'churchOrgan' | 'hammondB3' | 'percOrgan' | 'rockOrgan'
  // Synth Lead
  | 'sawLead' | 'squareLead' | 'syncLead' | 'brightness' | 'analogLead'
  // Synth Pad
  | 'warmPad' | 'polyPad' | 'spacePad' | 'choirPad' | 'bowedPad' | 'metallicPad' | 'haloPad'
  // Strings
  | 'strings' | 'slowStrings' | 'synthStrings' | 'orchestra'
  // Brass
  | 'brass' | 'synthBrass' | 'trumpets'
  // Bass
  | 'synthBass' | 'reese' | 'rubberBass' | 'detunedBass'
  // Pluck
  | 'pluck' | 'kalimba' | 'marimba' | 'vibes' | 'bells'
  // Atmosphere
  | 'crystals' | 'atmosphere' | 'sweepPad' | 'iceRain' | 'goblin';

export interface SynthState {
  chordType: ChordType;
  extensions: Extensions;
  voicing: number;
  octave: number;
  bpm: number;
  keyMode: string | null;
  bassMode: BassMode;
  bassVoicing: number;
  currentRoot: number | null;
  currentChordNotes: number[];
  heldNotes: Set<string>;
  heldModifiers: Set<string>;
  engine: PresetName;
  performMode: PerformMode;
  drumsPlaying: boolean;
  drumPattern: number;
}

export interface DrumPattern {
  name: string;
  pattern: [number, DrumType][];
}

export type DrumType = 'k' | 's' | 'h' | 'o' | 'r'; // kick, snare, hi-hat, open hi-hat, rimshot

export interface BassPreset {
  name: string;
  config: {
    oscillator: { type: string };
    envelope: { attack: number; decay: number; sustain: number; release: number };
    filterEnvelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
      baseFrequency: number;
      octaves: number;
    };
  };
}

export interface PresetCategory {
  name: string;
  presets: { value: PresetName; label: string }[];
}

