import { useState, useRef, useEffect } from 'react';
import { BASS_PRESETS } from '../constants/presets';
import './Knobs.css';

interface KnobsProps {
  voicing: number;
  bassVoicing: number;
  onVoicingChange: (value: number) => void;
  onBassVoicingChange: (value: number) => void;
}

export function Knobs({ voicing, bassVoicing, onVoicingChange, onBassVoicingChange }: KnobsProps) {
  const [modalOpen, setModalOpen] = useState<'voicing' | 'bass' | null>(null);
  const activeKnob = useRef<'voicing' | 'bass' | null>(null);
  const startY = useRef(0);
  const startValue = useRef(0);

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const handleMouseDown = (knob: 'voicing' | 'bass', value: number) => (e: React.MouseEvent) => {
    if (isTouchDevice()) return;
    activeKnob.current = knob;
    startY.current = e.clientY;
    startValue.current = value;
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleClick = (knob: 'voicing' | 'bass') => () => {
    if (isTouchDevice()) {
      setModalOpen(knob);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeKnob.current) return;
      const deltaY = startY.current - e.clientY;
      
      if (activeKnob.current === 'voicing') {
        const newValue = Math.max(-12, Math.min(12, Math.round(startValue.current + deltaY / 10)));
        onVoicingChange(newValue);
      } else {
        const newValue = Math.max(0, Math.min(11, Math.round(startValue.current + deltaY / 15)));
        onBassVoicingChange(newValue);
      }
    };

    const handleMouseUp = () => {
      activeKnob.current = null;
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onVoicingChange, onBassVoicingChange]);

  const voicingRotation = (voicing / 12) * 135;
  const bassRotation = -135 + (bassVoicing / 11) * 270;

  return (
    <>
      <div className="knobs-section">
        <div className="knob-row">
          <div className="knob-label">Chord<br />Voice</div>
          <div 
            className="knob"
            onClick={handleClick('voicing')}
            onMouseDown={handleMouseDown('voicing', voicing)}
          >
            <div className="knob-indicator" style={{ transform: `rotate(${voicingRotation}deg)` }} />
          </div>
        </div>
        <div className="knob-value">{voicing}</div>
        <div className="knob-row">
          <div className="knob-label">Bass<br />Voice</div>
          <div 
            className="knob small"
            onClick={handleClick('bass')}
            onMouseDown={handleMouseDown('bass', bassVoicing)}
          >
            <div className="knob-indicator" style={{ transform: `rotate(${bassRotation}deg)` }} />
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="knob-modal visible">
          <div className="knob-modal-title">
            {modalOpen === 'voicing' ? 'Chord Voicing' : 'Bass Voice'}
          </div>
          <div className="knob-modal-value">
            {modalOpen === 'voicing' ? voicing : BASS_PRESETS[bassVoicing].name}
          </div>
          <input
            type="range"
            className="knob-modal-slider"
            min={modalOpen === 'voicing' ? -12 : 0}
            max={modalOpen === 'voicing' ? 12 : 11}
            value={modalOpen === 'voicing' ? voicing : bassVoicing}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (modalOpen === 'voicing') {
                onVoicingChange(val);
              } else {
                onBassVoicingChange(val);
              }
            }}
          />
          <button className="knob-modal-close" onClick={() => setModalOpen(null)}>
            Done
          </button>
        </div>
      )}
    </>
  );
}

