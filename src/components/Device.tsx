import { useMemo } from 'react';
import { ControlRow } from './ControlRow';
import { ChordButtons } from './ChordButtons';
import { Knobs } from './Knobs';
import { Keyboard } from './Keyboard';
import type { ChordType, Extensions, PresetName, PerformMode, BassMode, DrumPattern } from '../types';
import './Device.css';

interface DeviceProps {
  // State
  chordType: ChordType;
  extensions: Extensions;
  voicing: number;
  bassVoicing: number;
  octave: number;
  bpm: number;
  engine: PresetName;
  performMode: PerformMode;
  keyMode: string | null;
  bassMode: BassMode;
  masterVolume: number;
  polyMode: boolean;
  // Effects
  effects: { reverb: number; delay: number; chorus: number; drive: number; master: number };
  // Drums
  drumsPlaying: boolean;
  drumPattern: number;
  drumPatterns: DrumPattern[];
  // MIDI
  midiInputs: { id: string; name: string }[];
  midiOutputs: { id: string; name: string }[];
  selectedMidiInput: string;
  selectedMidiOutput: string;
  // Audio state
  highlightedNotes: number[];
  chordName: string;
  chordNotes: string;
  // Callbacks
  onChordTypeChange: (type: ChordType) => void;
  onExtensionToggle: (ext: keyof Extensions) => void;
  onVoicingChange: (value: number) => void;
  onBassVoicingChange: (value: number) => void;
  onEngineChange: (engine: PresetName) => void;
  onPerformModeChange: (mode: PerformMode) => void;
  onKeyModeChange: (mode: string | null) => void;
  onBassModeChange: (mode: BassMode) => void;
  onEffectChange: (effect: 'reverb' | 'delay' | 'chorus' | 'drive' | 'master', value: number) => void;
  onMasterVolumeChange: (value: number) => void;
  onPolyModeChange: (enabled: boolean) => void;
  onDrumPatternSelect: (index: number) => void;
  onDrumsToggle: () => void;
  onMidiInputChange: (id: string) => void;
  onMidiOutputChange: (id: string) => void;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
  onShowHelp: () => void;
}

export function Device(props: DeviceProps) {
  // Generate speaker grille slots
  const grilleSlots = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  const keyIndicator = props.keyMode 
    ? `Key: ${props.keyMode.split('-')[0]} ${props.keyMode.split('-')[1] === 'maj' ? 'Major' : 'Minor'}`
    : '';

  return (
    <div className="device">
      <div className="speaker-section">
        <div className="speaker-grille">
          {grilleSlots.map(i => <div key={`l-${i}`} className="slot" />)}
        </div>
        <div style={{ flex: 1 }} />
        <div className="speaker-grille">
          {grilleSlots.map(i => <div key={`r-${i}`} className="slot" />)}
        </div>
      </div>

      <div className="main-panel">
        <div className="device-brand">Violet</div>
        
        <ControlRow
          engine={props.engine}
          onEngineChange={props.onEngineChange}
          performMode={props.performMode}
          onPerformModeChange={props.onPerformModeChange}
          effects={props.effects}
          onEffectChange={props.onEffectChange}
          keyMode={props.keyMode}
          onKeyModeChange={props.onKeyModeChange}
          bassMode={props.bassMode}
          onBassModeChange={props.onBassModeChange}
          drumsPlaying={props.drumsPlaying}
          drumPattern={props.drumPattern}
          drumPatterns={props.drumPatterns}
          onDrumPatternSelect={props.onDrumPatternSelect}
          onDrumsToggle={props.onDrumsToggle}
          bpm={props.bpm}
          midiInputs={props.midiInputs}
          midiOutputs={props.midiOutputs}
          selectedMidiInput={props.selectedMidiInput}
          selectedMidiOutput={props.selectedMidiOutput}
          onMidiInputChange={props.onMidiInputChange}
          onMidiOutputChange={props.onMidiOutputChange}
          masterVolume={props.masterVolume}
          onMasterVolumeChange={props.onMasterVolumeChange}
          polyMode={props.polyMode}
          onPolyModeChange={props.onPolyModeChange}
          onShowHelp={props.onShowHelp}
          chordName={props.chordName}
          chordNotes={props.chordNotes}
          keyIndicator={keyIndicator}
        />

        <div className="panel-shelf" />

        <div className="bottom-section">
          <ChordButtons
            chordType={props.chordType}
            extensions={props.extensions}
            onChordTypeChange={props.onChordTypeChange}
            onExtensionToggle={props.onExtensionToggle}
          />

          <Knobs
            voicing={props.voicing}
            bassVoicing={props.bassVoicing}
            onVoicingChange={props.onVoicingChange}
            onBassVoicingChange={props.onBassVoicingChange}
          />

          <Keyboard
            octave={props.octave}
            highlightedNotes={props.highlightedNotes}
            onNoteOn={props.onNoteOn}
            onNoteOff={props.onNoteOff}
          />
        </div>
      </div>
    </div>
  );
}

