import { useEffect, useRef } from 'react';
import { WHITE_KEYS, BLACK_KEYS } from '../constants/music';
import './Keyboard.css';

interface KeyboardProps {
  octave: number;
  highlightedNotes: number[];  // Notes from the chord that's sounding
  pressedNotes?: number[];     // Keys physically pressed (keyboard/mouse)
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

export function Keyboard({ octave, highlightedNotes, pressedNotes = [], onNoteOn, onNoteOff }: KeyboardProps) {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const activeNotes = useRef<Set<number>>(new Set());
  const isMouseDown = useRef(false);

  const handleMouseDown = (note: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    isMouseDown.current = true;
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

  // Handle drag-to-play: when mouse enters a key while button is held
  const handleMouseEnter = (note: number) => (e: React.MouseEvent) => {
    if (isMouseDown.current && e.buttons === 1) {
      const midiNote = (octave + 1) * 12 + note;
      if (!activeNotes.current.has(midiNote)) {
        activeNotes.current.add(midiNote);
        onNoteOn(midiNote);
      }
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isMouseDown.current = false;
      activeNotes.current.forEach(note => onNoteOff(note));
      activeNotes.current.clear();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [onNoteOff]);

  const isHighlighted = (note: number) => {
    return highlightedNotes.some(n => n % 12 === note);
  };

  const isPressed = (note: number) => {
    return pressedNotes.some(n => n % 12 === note);
  };

  const getKeyClass = (baseClass: string, note: number) => {
    const classes = [baseClass];
    if (isHighlighted(note)) classes.push('highlighted');
    if (isPressed(note)) classes.push('pressed');
    return classes.join(' ');
  };

  // Black key positions relative to white keys
  const blackKeyIndices = [0, 1, 3, 4, 5];

  return (
    <div className="keyboard-section">
      <div className="keyboard" ref={keyboardRef}>
        {WHITE_KEYS.map((note) => (
          <div
            key={`white-${note}`}
            className={getKeyClass('white-key', note)}
            data-note={note}
            onMouseDown={handleMouseDown(note)}
            onMouseUp={handleMouseUp(note)}
            onMouseLeave={handleMouseLeave(note)}
            onMouseEnter={handleMouseEnter(note)}
          />
        ))}
        {BLACK_KEYS.map((note, i) => (
          <div
            key={`black-${note}`}
            className={getKeyClass('black-key', note)}
            data-note={note}
            style={{ left: `${(blackKeyIndices[i] + 0.7) * (100 / 7)}%` }}
            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(note)(e); }}
            onMouseUp={(e) => { e.stopPropagation(); handleMouseUp(note)(); }}
            onMouseLeave={handleMouseLeave(note)}
            onMouseEnter={(e) => { e.stopPropagation(); handleMouseEnter(note)(e); }}
          />
        ))}
      </div>
    </div>
  );
}

