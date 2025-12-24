import type { ChordType, Extensions } from '../types';
import './ChordButtons.css';

interface ChordButtonsProps {
  chordType: ChordType;
  extensions: Extensions;
  onChordTypeChange: (type: ChordType) => void;
  onExtensionToggle: (ext: keyof Extensions) => void;
}

const CHORD_TYPES: { type: ChordType; label: string }[] = [
  { type: 0, label: 'Dim' },
  { type: 1, label: 'Min' },
  { type: 2, label: 'Maj' },
  { type: 3, label: 'Sus' },
];

const EXTENSIONS: { ext: keyof Extensions; label: string }[] = [
  { ext: '6', label: '6' },
  { ext: 'm7', label: 'm7' },
  { ext: 'M7', label: 'M7' },
  { ext: '9', label: '9' },
];

export function ChordButtons({ chordType, extensions, onChordTypeChange, onExtensionToggle }: ChordButtonsProps) {
  return (
    <div className="chord-section">
      <div className="chord-buttons">
        {CHORD_TYPES.map(({ type, label }) => (
          <button
            key={type}
            className={`chord-btn ${chordType === type ? 'active' : ''}`}
            onClick={() => onChordTypeChange(chordType === type ? null : type)}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="chord-buttons">
        {EXTENSIONS.map(({ ext, label }) => (
          <button
            key={ext}
            className={`chord-btn ${extensions[ext] ? 'active' : ''}`}
            onClick={() => onExtensionToggle(ext)}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

