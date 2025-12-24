import * as Tone from 'tone';
import type { PresetName, PresetCategory, BassPreset } from '../types';

type PresetFactory = () => Tone.PolySynth;

export const PRESETS: Record<PresetName, PresetFactory> = {
  // Keys - distinct timbres
  grandPiano: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'custom', partials: [1, 0.8, 0.3, 0.15, 0.08, 0.04] }, envelope: { attack: 0.002, decay: 2.5, sustain: 0.1, release: 2.2 } }),
  electricPiano: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 6, modulationIndex: 12, envelope: { attack: 0.001, decay: 0.8, sustain: 0.02, release: 1.2 }, modulation: { type: 'sine' }, modulationEnvelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.8 } }),
  rhodesWarm: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1.5, modulationIndex: 1.2, envelope: { attack: 0.015, decay: 3, sustain: 0.3, release: 2.5 }, modulation: { type: 'triangle' }, modulationEnvelope: { attack: 0.02, decay: 1.5, sustain: 0.2, release: 2 } }),
  wurlitzer: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 3, envelope: { attack: 0.001, decay: 0.5, sustain: 0.15, release: 0.4 }, modulation: { type: 'square' } }),
  clavinet: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'pulse', width: 0.15 }, envelope: { attack: 0.001, decay: 0.08, sustain: 0.02, release: 0.05 } }),
  harpsichord: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 4, modulationIndex: 8, envelope: { attack: 0.001, decay: 0.6, sustain: 0, release: 0.4 }, modulation: { type: 'square' } }),
  celesta: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 8, modulationIndex: 3, envelope: { attack: 0.001, decay: 2, sustain: 0, release: 1.5 } }),
  musicBox: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 14, modulationIndex: 1.5, envelope: { attack: 0.001, decay: 3, sustain: 0, release: 2 } }),
  // Organ
  churchOrgan: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'custom', partials: [1, 0, 0.5, 0, 0.33, 0, 0.25, 0.2] }, envelope: { attack: 0.08, decay: 0.1, sustain: 1, release: 0.4 } }),
  hammondB3: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'custom', partials: [1, 0.8, 0.6, 0.4, 0.3, 0.2] }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.95, release: 0.08 } }),
  percOrgan: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 2, modulationIndex: 1, envelope: { attack: 0.001, decay: 0.3, sustain: 0.5, release: 0.2 } }),
  rockOrgan: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 15, count: 3 }, envelope: { attack: 0.005, decay: 0.15, sustain: 0.9, release: 0.15 } }),
  // Synth Lead
  sawLead: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 20, count: 2 }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.5 } }),
  squareLead: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsquare', spread: 15, count: 2 }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.3 } }),
  syncLead: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3.5, modulationIndex: 18, envelope: { attack: 0.005, decay: 0.1, sustain: 0.6, release: 0.3 } }),
  brightness: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 4, envelope: { attack: 0.005, decay: 0.2, sustain: 0.5, release: 0.6 }, modulation: { type: 'sawtooth' } }),
  analogLead: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 35, count: 3 }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.7 } }),
  // Synth Pad
  warmPad: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 50, count: 5 }, envelope: { attack: 0.8, decay: 0.5, sustain: 0.9, release: 3 } }),
  polyPad: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 1.5, envelope: { attack: 0.5, decay: 0.4, sustain: 0.8, release: 2.5 }, modulation: { type: 'sine' } }),
  spacePad: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1.5, modulationIndex: 5, envelope: { attack: 1.5, decay: 1.2, sustain: 0.75, release: 4 } }),
  choirPad: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsine', spread: 40, count: 6 }, envelope: { attack: 1.2, decay: 0.8, sustain: 0.8, release: 3 } }),
  bowedPad: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 1, envelope: { attack: 1.5, decay: 0.5, sustain: 0.95, release: 3 }, modulation: { type: 'triangle' } }),
  metallicPad: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 7, modulationIndex: 15, envelope: { attack: 0.8, decay: 0.8, sustain: 0.6, release: 3 } }),
  haloPad: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 2.5, modulationIndex: 4, envelope: { attack: 2.5, decay: 2, sustain: 0.65, release: 5 } }),
  // Strings
  strings: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 20, count: 5 }, envelope: { attack: 0.4, decay: 0.3, sustain: 0.9, release: 2 } }),
  slowStrings: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 30, count: 6 }, envelope: { attack: 2, decay: 0.6, sustain: 0.85, release: 3.5 } }),
  synthStrings: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 2.5, envelope: { attack: 0.3, decay: 0.3, sustain: 0.8, release: 1.5 }, modulation: { type: 'sawtooth' } }),
  orchestra: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 45, count: 7 }, envelope: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 1 } }),
  // Brass
  brass: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 15, count: 3 }, envelope: { attack: 0.08, decay: 0.2, sustain: 0.7, release: 0.4 } }),
  synthBrass: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1, modulationIndex: 6, envelope: { attack: 0.04, decay: 0.2, sustain: 0.75, release: 0.3 } }),
  trumpets: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 4, envelope: { attack: 0.06, decay: 0.15, sustain: 0.6, release: 0.25 }, modulation: { type: 'sawtooth' } }),
  // Bass
  synthBass: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 10, count: 2 }, envelope: { attack: 0.005, decay: 0.2, sustain: 0.55, release: 0.3 } }),
  reese: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', spread: 60, count: 2 }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.7, release: 0.8 } }),
  rubberBass: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 0.5, modulationIndex: 12, envelope: { attack: 0.008, decay: 0.5, sustain: 0.3, release: 0.35 } }),
  detunedBass: () => new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsquare', spread: 40, count: 2 }, envelope: { attack: 0.008, decay: 0.3, sustain: 0.6, release: 0.45 } }),
  // Pluck
  pluck: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 5, modulationIndex: 6, envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 0.5 } }),
  kalimba: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 10, modulationIndex: 3, envelope: { attack: 0.001, decay: 2.2, sustain: 0, release: 1 } }),
  marimba: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3.5, modulationIndex: 1, envelope: { attack: 0.001, decay: 1.5, sustain: 0, release: 0.8 } }),
  vibes: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 6, modulationIndex: 2, envelope: { attack: 0.001, decay: 3, sustain: 0.1, release: 2.5 } }),
  bells: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 13, modulationIndex: 20, envelope: { attack: 0.001, decay: 5, sustain: 0, release: 3 } }),
  // Atmosphere
  crystals: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 8, modulationIndex: 22, envelope: { attack: 0.8, decay: 1.5, sustain: 0.3, release: 4 } }),
  atmosphere: () => new Tone.PolySynth(Tone.AMSynth, { harmonicity: 1.5, envelope: { attack: 3, decay: 2, sustain: 0.5, release: 6 }, modulation: { type: 'sine' } }),
  sweepPad: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 2.5, modulationIndex: 8, envelope: { attack: 2.5, decay: 3, sustain: 0.4, release: 5 } }),
  iceRain: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 11, modulationIndex: 30, envelope: { attack: 0.5, decay: 2.5, sustain: 0.2, release: 3.5 } }),
  goblin: () => new Tone.PolySynth(Tone.FMSynth, { harmonicity: 0.2, modulationIndex: 45, envelope: { attack: 0.2, decay: 1.2, sustain: 0.4, release: 2.5 } }),
};

export const PRESET_CATEGORIES: PresetCategory[] = [
  { name: 'Keys', presets: [
    { value: 'grandPiano', label: 'Grand Piano' },
    { value: 'electricPiano', label: 'Electric Piano' },
    { value: 'rhodesWarm', label: 'Warm Rhodes' },
    { value: 'wurlitzer', label: 'Wurlitzer' },
    { value: 'clavinet', label: 'Clavinet' },
    { value: 'harpsichord', label: 'Harpsichord' },
    { value: 'celesta', label: 'Celesta' },
    { value: 'musicBox', label: 'Music Box' },
  ]},
  { name: 'Organ', presets: [
    { value: 'churchOrgan', label: 'Church Organ' },
    { value: 'hammondB3', label: 'Hammond B3' },
    { value: 'percOrgan', label: 'Perc Organ' },
    { value: 'rockOrgan', label: 'Rock Organ' },
  ]},
  { name: 'Synth Lead', presets: [
    { value: 'sawLead', label: 'Saw Lead' },
    { value: 'squareLead', label: 'Square Lead' },
    { value: 'syncLead', label: 'Sync Lead' },
    { value: 'brightness', label: 'Brightness' },
    { value: 'analogLead', label: 'Analog Lead' },
  ]},
  { name: 'Synth Pad', presets: [
    { value: 'warmPad', label: 'Warm Pad' },
    { value: 'polyPad', label: 'Poly Pad' },
    { value: 'spacePad', label: 'Space Pad' },
    { value: 'choirPad', label: 'Choir Pad' },
    { value: 'bowedPad', label: 'Bowed Pad' },
    { value: 'metallicPad', label: 'Metallic Pad' },
    { value: 'haloPad', label: 'Halo Pad' },
  ]},
  { name: 'Strings', presets: [
    { value: 'strings', label: 'Strings' },
    { value: 'slowStrings', label: 'Slow Strings' },
    { value: 'synthStrings', label: 'Synth Strings' },
    { value: 'orchestra', label: 'Orchestra Hit' },
  ]},
  { name: 'Brass', presets: [
    { value: 'brass', label: 'Brass Section' },
    { value: 'synthBrass', label: 'Synth Brass' },
    { value: 'trumpets', label: 'Trumpets' },
  ]},
  { name: 'Bass', presets: [
    { value: 'synthBass', label: 'Synth Bass' },
    { value: 'reese', label: 'Reese Bass' },
    { value: 'rubberBass', label: 'Rubber Bass' },
    { value: 'detunedBass', label: 'Detuned Bass' },
  ]},
  { name: 'Pluck', presets: [
    { value: 'pluck', label: 'Pluck' },
    { value: 'kalimba', label: 'Kalimba' },
    { value: 'marimba', label: 'Marimba' },
    { value: 'vibes', label: 'Vibraphone' },
    { value: 'bells', label: 'Bells' },
  ]},
  { name: 'Atmosphere', presets: [
    { value: 'crystals', label: 'Crystals' },
    { value: 'atmosphere', label: 'Atmosphere' },
    { value: 'sweepPad', label: 'Sweep Pad' },
    { value: 'iceRain', label: 'Ice Rain' },
    { value: 'goblin', label: 'Goblin' },
  ]},
];

export const BASS_PRESETS: BassPreset[] = [
  { name: 'Sub', config: { oscillator: { type: 'sine' }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.6, release: 0.8 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5, baseFrequency: 60, octaves: 1 } }},
  { name: 'Round', config: { oscillator: { type: 'triangle' }, envelope: { attack: 0.02, decay: 0.4, sustain: 0.5, release: 0.6 }, filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.4, baseFrequency: 80, octaves: 2 } }},
  { name: 'Warm', config: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5, baseFrequency: 100, octaves: 2.5 } }},
  { name: 'Pluck', config: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.3 }, filterEnvelope: { attack: 0.001, decay: 0.15, sustain: 0.1, release: 0.2, baseFrequency: 200, octaves: 3 } }},
  { name: 'Growl', config: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 }, filterEnvelope: { attack: 0.02, decay: 0.3, sustain: 0.3, release: 0.4, baseFrequency: 150, octaves: 3 } }},
  { name: 'Wobble', config: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.4 }, filterEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.3, baseFrequency: 80, octaves: 4 } }},
  { name: 'Punch', config: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0.2, release: 0.2 }, filterEnvelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.15, baseFrequency: 120, octaves: 2.5 } }},
  { name: 'Soft', config: { oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.4, sustain: 0.5, release: 1.0 }, filterEnvelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.6, baseFrequency: 50, octaves: 1.5 } }},
  { name: 'Acid', config: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0.3, release: 0.3 }, filterEnvelope: { attack: 0.001, decay: 0.4, sustain: 0.1, release: 0.2, baseFrequency: 300, octaves: 4 } }},
  { name: 'Thump', config: { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.25, sustain: 0.15, release: 0.4 }, filterEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.3, baseFrequency: 100, octaves: 2 } }},
  { name: 'Deep', config: { oscillator: { type: 'sine' }, envelope: { attack: 0.03, decay: 0.5, sustain: 0.4, release: 1.2 }, filterEnvelope: { attack: 0.02, decay: 0.4, sustain: 0.3, release: 0.8, baseFrequency: 40, octaves: 1.5 } }},
  { name: 'Buzz', config: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.3 }, filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.25, baseFrequency: 180, octaves: 3.5 } }},
];

