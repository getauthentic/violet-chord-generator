import { useEffect, useRef } from 'react';
import { WHITE_KEYS, BLACK_KEYS } from '../constants/music';
import './Keyboard.css';

interface KeyboardProps {
  octave: number;
  highlightedNotes: number[];
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

export function Keyboard({ octave, highlightedNotes, onNoteOn, onNoteOff }: KeyboardProps) {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const activeNotes = useRef<Set<number>>(new Set());

  const handleMouseDown = (note: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const midiNote = (octave + 1) * 12 + note;
    activeNotes.current.add(midiNote);
    onNoteOn(midiNote);
  };

  const handleMouseUp = (note: number) => () => {
    const midiNote = (octave + 1) * 12 + note;
    if (activeNotes.current.has(midiNote)) {
      activeNotes.current.delete(midiNote);
      onNoteOff(midiNote);
    }
  };

  const handleMouseLeave = (note: number) => () => {
    const midiNote = (octave + 1) * 12 + note;
    if (activeNotes.current.has(midiNote)) {
      activeNotes.current.delete(midiNote);
      onNoteOff(midiNote);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      activeNotes.current.forEach(note => onNoteOff(note));
      activeNotes.current.clear();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [onNoteOff]);

  const isHighlighted = (note: number) => {
    return highlightedNotes.some(n => n % 12 === note);
  };

  // Black key positions relative to white keys
  const blackKeyIndices = [0, 1, 3, 4, 5];

  return (
    <div className="keyboard-section">
      <div className="keyboard" ref={keyboardRef}>
        {WHITE_KEYS.map((note) => (
          <div
            key={`white-${note}`}
            className={`white-key ${isHighlighted(note) ? 'highlighted' : ''}`}
            data-note={note}
            onMouseDown={handleMouseDown(note)}
            onMouseUp={handleMouseUp(note)}
            onMouseLeave={handleMouseLeave(note)}
          />
        ))}
        {BLACK_KEYS.map((note, i) => (
          <div
            key={`black-${note}`}
            className={`black-key ${isHighlighted(note) ? 'highlighted' : ''}`}
            data-note={note}
            style={{ left: `${(blackKeyIndices[i] + 0.7) * (100 / 7)}%` }}
            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(note)(e); }}
            onMouseUp={(e) => { e.stopPropagation(); handleMouseUp(note)(); }}
            onMouseLeave={handleMouseLeave(note)}
          />
        ))}
      </div>
    </div>
  );
}

