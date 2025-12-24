import { useState, useEffect, useCallback, useRef } from 'react';
import { Device } from './components/Device';
import { StartOverlay, AboutModal, HelpModal, RotateOverlay } from './components/Modals';
import { useAudio } from './hooks/useAudio';
import { useDrums } from './hooks/useDrums';
import { useMidi } from './hooks/useMidi';
import { useSynthState } from './hooks/useSynthState';
import { KEYBOARD_MAP } from './constants/music';
import type { ChordType, Extension } from './types';
import './App.css';

export default function App() {
  const [showStart, setShowStart] = useState(true);
  const [isStartReopened, setIsStartReopened] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [effects, setEffects] = useState({ reverb: 0, delay: 0, chorus: 0, drive: 0, master: 80 });
  
  const heldNotes = useRef<Set<string>>(new Set());
  const heldModifiers = useRef<Set<string>>(new Set());
  const voicingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const synthState = useSynthState();
  const audio = useAudio();
  const drums = useDrums();
  
  const handleNoteOn = useCallback((note: number, velocity?: number) => {
    const result = audio.playChord(
      note,
      synthState.chordType,
      synthState.extensions,
      synthState.voicing,
      synthState.performMode,
      synthState.bassMode,
      synthState.bpm,
      synthState.keyMode,
      velocity ?? 0.8,
      (n, v, on) => on ? midi.sendNoteOn(n, v) : midi.sendNoteOff(n),
      synthState.polyMode
    );
    setChordDisplay(result);
  }, [synthState, audio]);

  const handleNoteOff = useCallback((note: number) => {
    const remainingNotes = audio.releaseChord(note, (n, _, on) => on ? midi.sendNoteOn(n, 0) : midi.sendNoteOff(n), synthState.polyMode);
    // Always update display with remaining notes (empty array clears display)
    setChordDisplay({ notes: remainingNotes, name: '' });
  }, [audio, synthState.polyMode]);

  const midi = useMidi(handleNoteOn, handleNoteOff);

  const [chordDisplay, setChordDisplay] = useState<{ notes: number[]; name: string }>({ notes: [], name: '' });

  const handleStart = useCallback(async () => {
    await audio.initialize();
    drums.initialize();
    await midi.initialize();
    setShowStart(false);
  }, [audio, drums, midi]);

  const handleEffectChange = useCallback((effect: 'reverb' | 'delay' | 'chorus' | 'drive' | 'master', value: number) => {
    setEffects(prev => ({ ...prev, [effect]: value }));
    audio.setEffect(effect, value);
  }, [audio]);

  const handleDrumsToggle = useCallback(() => {
    if (drums.isPlaying) {
      drums.stop();
    }
  }, [drums]);

  const handleDrumPatternSelect = useCallback((index: number) => {
    drums.selectPattern(index);
    drums.startLoop(synthState.bpm, index);
  }, [drums, synthState.bpm]);

  const handleEngineChange = useCallback((engine: typeof synthState.engine) => {
    synthState.setEngine(engine);
    audio.switchEngine(engine);
  }, [synthState, audio]);

  const handleBassVoicingChange = useCallback((voicing: number) => {
    synthState.setBassVoicing(voicing);
    audio.updateBassSynth(voicing);
  }, [synthState, audio]);

  const handleMasterVolumeChange = useCallback((value: number) => {
    synthState.setMasterVolume(value);
    audio.setEffect('master', value);
    setEffects(prev => ({ ...prev, master: value }));
  }, [synthState, audio]);

  const handleShowHelp = useCallback(() => {
    setShowStart(true);
    setIsStartReopened(true);
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      // Note keys
      if (KEYBOARD_MAP[key] !== undefined) {
        const note = (synthState.octave + 1) * 12 + KEYBOARD_MAP[key];
        if (!heldNotes.current.has(key)) {
          heldNotes.current.add(key);
          handleNoteOn(note);
        }
        return;
      }

      // Chord type modifiers
      if (['1', '2', '3', '4'].includes(e.key)) {
        heldModifiers.current.add(e.key);
        synthState.setChordType((parseInt(e.key) - 1) as ChordType);
        return;
      }

      // Extension modifiers
      const extMap: Record<string, Extension> = { '5': '6', '6': 'm7', '7': 'M7', '8': '9' };
      if (extMap[e.key]) {
        heldModifiers.current.add(e.key);
        synthState.setExtension(extMap[e.key], true);
        return;
      }

      // Voicing
      if (key === 'x' && !voicingInterval.current) {
        const stepUp = () => synthState.setVoicing(synthState.voicing + 1);
        stepUp();
        voicingInterval.current = setInterval(stepUp, 1000);
        return;
      }
      if (key === 'z' && !voicingInterval.current) {
        const stepDown = () => synthState.setVoicing(synthState.voicing - 1);
        stepDown();
        voicingInterval.current = setInterval(stepDown, 1000);
        return;
      }

      // Octave
      if (e.key === '[') { synthState.setOctave(synthState.octave - 1); return; }
      if (e.key === ']') { synthState.setOctave(synthState.octave + 1); return; }

      // BPM
      if (e.key === '-') {
        synthState.setBpm(synthState.bpm - 5);
        audio.setBpm(synthState.bpm - 5);
        if (drums.isPlaying) drums.startLoop(synthState.bpm - 5);
        return;
      }
      if (e.key === '=') {
        synthState.setBpm(synthState.bpm + 5);
        audio.setBpm(synthState.bpm + 5);
        if (drums.isPlaying) drums.startLoop(synthState.bpm + 5);
        return;
      }

      // Loop
      if (key === 'l') {
        if (drums.isPlaying) {
          drums.stop();
        } else {
          // Would show drum panel, but for keyboard just start with current pattern
          drums.startLoop(synthState.bpm);
        }
        return;
      }

      // Drum patterns
      if (key === ',') { drums.cyclePattern(-1); return; }
      if (key === '.') { drums.cyclePattern(1); return; }

      // Panic
      if (e.key === ' ') {
        e.preventDefault();
        audio.panic();
        drums.stop();
        setChordDisplay({ notes: [], name: '' });
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Note keys
      if (KEYBOARD_MAP[key] !== undefined) {
        heldNotes.current.delete(key);
        handleNoteOff((synthState.octave + 1) * 12 + KEYBOARD_MAP[key]);
        return;
      }

      // Chord type modifiers
      if (['1', '2', '3', '4'].includes(e.key)) {
        heldModifiers.current.delete(e.key);
        const heldChordTypes = ['1', '2', '3', '4'].filter(k => heldModifiers.current.has(k));
        if (heldChordTypes.length > 0) {
          synthState.setChordType((parseInt(heldChordTypes[heldChordTypes.length - 1]) - 1) as ChordType);
        } else {
          synthState.setChordType(null);
        }
        return;
      }

      // Extension modifiers
      const extMap: Record<string, Extension> = { '5': '6', '6': 'm7', '7': 'M7', '8': '9' };
      if (extMap[e.key]) {
        heldModifiers.current.delete(e.key);
        synthState.setExtension(extMap[e.key], false);
        return;
      }

      // Voicing
      if (key === 'z' || key === 'x') {
        if (voicingInterval.current) {
          clearInterval(voicingInterval.current);
          voicingInterval.current = null;
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [synthState, audio, drums, handleNoteOn, handleNoteOff]);

  const chordNotesDisplay = chordDisplay.notes.map(n => audio.midiToNoteName(n)).join(' · ');

  return (
    <>
      <RotateOverlay />
      
      <div className="top-header">
        <a href="https://getauthentic.com" target="_blank" rel="noopener noreferrer">
          <img src="/Logo.png" alt="Logo" className="logo" style={{ width: 170, height: 'auto', opacity: 0.4 }} />
        </a>
        {!showStart && (
          <button className="info-btn" onClick={() => setShowAbout(true)}>What is this?</button>
        )}
      </div>

      <StartOverlay
        visible={showStart}
        isReopened={isStartReopened}
        onStart={handleStart}
        onClose={() => { setShowStart(false); setIsStartReopened(false); }}
      />

      <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} />
      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />

      <Device
        chordType={synthState.chordType}
        extensions={synthState.extensions}
        voicing={synthState.voicing}
        bassVoicing={synthState.bassVoicing}
        octave={synthState.octave}
        bpm={synthState.bpm}
        engine={synthState.engine}
        performMode={synthState.performMode}
        keyMode={synthState.keyMode}
        bassMode={synthState.bassMode}
        masterVolume={synthState.masterVolume}
        effects={effects}
        drumsPlaying={drums.isPlaying}
        drumPattern={drums.currentPattern}
        drumPatterns={drums.patterns}
        midiInputs={midi.inputs}
        midiOutputs={midi.outputs}
        selectedMidiInput={midi.selectedInput}
        selectedMidiOutput={midi.selectedOutput}
        highlightedNotes={chordDisplay.notes}
        chordName={chordDisplay.name}
        chordNotes={chordNotesDisplay}
        onChordTypeChange={synthState.setChordType}
        onExtensionToggle={synthState.toggleExtension}
        onVoicingChange={synthState.setVoicing}
        onBassVoicingChange={handleBassVoicingChange}
        onEngineChange={handleEngineChange}
        onPerformModeChange={synthState.setPerformMode}
        onKeyModeChange={synthState.setKeyMode}
        onBassModeChange={synthState.setBassMode}
        onEffectChange={handleEffectChange}
        onMasterVolumeChange={handleMasterVolumeChange}
        polyMode={synthState.polyMode}
        onPolyModeChange={synthState.setPolyMode}
        onDrumPatternSelect={handleDrumPatternSelect}
        onDrumsToggle={handleDrumsToggle}
        onMidiInputChange={midi.selectInput}
        onMidiOutputChange={midi.selectOutput}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
        onShowHelp={handleShowHelp}
      />

      <div className="info-bar">
        <div className="info-item">
          <span className={`status-dot ${audio.isInitialized ? 'active' : ''}`} />
          Audio
        </div>
        <div className="info-item">
          <span className={`status-dot ${midi.inputConnected ? 'active' : ''}`} />
          MIDI In
        </div>
        <div className="info-item">
          <span className={`status-dot ${midi.outputConnected ? 'active' : ''}`} />
          MIDI Out
        </div>
        <div className="info-item">{synthState.bpm} BPM</div>
        <div className="info-item">Oct {synthState.octave}</div>
        <button className="info-item controls-btn" onClick={() => setShowHelp(true)}>? Controls</button>
      </div>

      <div className="github-cta">
        <span className="github-cta-text">Want to contribute?</span>
        <a href="https://github.com/getauthentic/violet-chord-generator" target="_blank" rel="noopener noreferrer" className="github-btn">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Violet on GitHub
        </a>
      </div>
    </>
  );
}

