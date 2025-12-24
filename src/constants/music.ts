export const SCALES: Record<string, number[]> = {
  maj: [0, 2, 4, 5, 7, 9, 11],
  min: [0, 2, 3, 5, 7, 8, 10],
};

export const CHORD_INTERVALS: Record<number, number[]> = {
  0: [0, 3, 6],  // dim
  1: [0, 3, 7],  // min
  2: [0, 4, 7],  // maj
  3: [0, 5, 7],  // sus
};

export const EXTENSION_INTERVALS: Record<string, number> = {
  '6': 9,
  'm7': 10,
  'M7': 11,
  '9': 14,
};

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const KEYBOARD_MAP: Record<string, number> = {
  a: 0, s: 2, d: 4, f: 5, g: 7, h: 9, j: 11,
  w: 1, e: 3, t: 6, y: 8, u: 10,
};

export const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
export const BLACK_KEYS = [1, 3, 6, 8, 10];

export const KEY_OPTIONS = [
  { value: '', label: 'Off' },
  { value: 'C-maj', label: 'C Major' },
  { value: 'C-min', label: 'C Minor' },
  { value: 'C#-maj', label: 'C# Major' },
  { value: 'C#-min', label: 'C# Minor' },
  { value: 'D-maj', label: 'D Major' },
  { value: 'D-min', label: 'D Minor' },
  { value: 'D#-maj', label: 'D# Major' },
  { value: 'D#-min', label: 'D# Minor' },
  { value: 'E-maj', label: 'E Major' },
  { value: 'E-min', label: 'E Minor' },
  { value: 'F-maj', label: 'F Major' },
  { value: 'F-min', label: 'F Minor' },
  { value: 'F#-maj', label: 'F# Major' },
  { value: 'F#-min', label: 'F# Minor' },
  { value: 'G-maj', label: 'G Major' },
  { value: 'G-min', label: 'G Minor' },
  { value: 'G#-maj', label: 'G# Major' },
  { value: 'G#-min', label: 'G# Minor' },
  { value: 'A-maj', label: 'A Major' },
  { value: 'A-min', label: 'A Minor' },
  { value: 'A#-maj', label: 'A# Major' },
  { value: 'A#-min', label: 'A# Minor' },
  { value: 'B-maj', label: 'B Major' },
  { value: 'B-min', label: 'B Minor' },
];

export const PERFORM_MODES = [
  { value: 'chord', label: 'Chord' },
  { value: 'strum', label: 'Strum' },
  { value: 'strum2oct', label: 'Strum 2 Oct' },
  { value: 'slop', label: 'Slop' },
  { value: 'arpUp', label: 'Arp Up' },
  { value: 'arpDown', label: 'Arp Down' },
  { value: 'arpUpDown', label: 'Arp Up/Down' },
  { value: 'harp', label: 'Harp' },
] as const;

export const BASS_MODES = [
  { value: 'off', label: 'Off' },
  { value: 'unison', label: 'Unison' },
  { value: 'single', label: 'Single' },
  { value: 'solo', label: 'Solo' },
] as const;

