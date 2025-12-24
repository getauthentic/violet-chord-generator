import { useState, useRef, useEffect } from 'react';
import { PRESET_CATEGORIES } from '../constants/presets';
import { KEY_OPTIONS, PERFORM_MODES, BASS_MODES } from '../constants/music';
import type { PresetName, PerformMode, BassMode, DrumPattern } from '../types';
import './ControlRow.css';

interface ControlRowProps {
  // Sound
  engine: PresetName;
  onEngineChange: (engine: PresetName) => void;
  // Perform
  performMode: PerformMode;
  onPerformModeChange: (mode: PerformMode) => void;
  // Effects
  effects: { reverb: number; delay: number; chorus: number; drive: number; master: number };
  onEffectChange: (effect: 'reverb' | 'delay' | 'chorus' | 'drive' | 'master', value: number) => void;
  // Key
  keyMode: string | null;
  onKeyModeChange: (mode: string | null) => void;
  // Bass
  bassMode: BassMode;
  onBassModeChange: (mode: BassMode) => void;
  // Drums
  drumsPlaying: boolean;
  drumPattern: number;
  drumPatterns: DrumPattern[];
  onDrumPatternSelect: (index: number) => void;
  onDrumsToggle: () => void;
  // BPM
  bpm: number;
  // MIDI
  midiInputs: { id: string; name: string }[];
  midiOutputs: { id: string; name: string }[];
  selectedMidiInput: string;
  selectedMidiOutput: string;
  onMidiInputChange: (id: string) => void;
  onMidiOutputChange: (id: string) => void;
  // Volume
  masterVolume: number;
  onMasterVolumeChange: (value: number) => void;
  // Options
  polyMode: boolean;
  onPolyModeChange: (enabled: boolean) => void;
  onShowHelp: () => void;
  // Chord display
  chordName: string;
  chordNotes: string;
  keyIndicator: string;
}

type MenuType = 'sound' | 'perform' | 'fx' | 'key' | 'bass' | 'drums' | 'midi' | 'options' | 'volume' | null;

export function ControlRow(props: ControlRowProps) {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = (menu: MenuType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="control-row" ref={menuRef}>
      {/* Left button group */}
      <div className="btn-group">
        {/* Sound */}
        <div className="btn-with-label">
          <button className="menu-btn yellow" onClick={toggleMenu('sound')} />
          <span className="btn-label">Sound</span>
          <div className="tooltip">50+ synth presets</div>
          {openMenu === 'sound' && (
            <div className="dropdown-menu sound-menu visible">
              {PRESET_CATEGORIES.map(category => (
                <div key={category.name}>
                  <div className="dropdown-category">{category.name}</div>
                  {category.presets.map(preset => (
                    <div
                      key={preset.value}
                      className={`dropdown-item ${props.engine === preset.value ? 'active' : ''}`}
                      onClick={() => { props.onEngineChange(preset.value); setOpenMenu(null); }}
                    >
                      {preset.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Perform */}
        <div className="btn-with-label">
          <button className="menu-btn yellow" onClick={toggleMenu('perform')} />
          <span className="btn-label">Perform</span>
          <div className="tooltip">Performance mode</div>
          {openMenu === 'perform' && (
            <div className="dropdown-menu visible">
              {PERFORM_MODES.map(mode => (
                <div
                  key={mode.value}
                  className={`dropdown-item ${props.performMode === mode.value ? 'active' : ''}`}
                  onClick={() => { props.onPerformModeChange(mode.value as PerformMode); setOpenMenu(null); }}
                >
                  {mode.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FX */}
        <div className="btn-with-label">
          <button className="menu-btn yellow" onClick={toggleMenu('fx')} />
          <span className="btn-label">FX</span>
          <div className="tooltip">Effects</div>
          {openMenu === 'fx' && (
            <div className="effects-panel visible">
              {(['reverb', 'delay', 'chorus', 'drive', 'master'] as const).map(effect => (
                <div key={effect} className="effect-row">
                  <span className="effect-label">{effect === 'delay' ? 'Tape' : effect.charAt(0).toUpperCase() + effect.slice(1)}</span>
                  <input
                    type="range"
                    className="effect-slider"
                    min="0"
                    max="100"
                    value={props.effects[effect]}
                    onChange={(e) => props.onEffectChange(effect, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key */}
        <div className="btn-with-label">
          <button className={`menu-btn yellow ${props.keyMode ? 'active' : ''}`} onClick={toggleMenu('key')} />
          <span className="btn-label">Key</span>
          <div className="tooltip">Scale lock</div>
          {openMenu === 'key' && (
            <div className="dropdown-menu visible">
              {KEY_OPTIONS.map(option => (
                <div
                  key={option.value}
                  className={`dropdown-item ${props.keyMode === (option.value || null) ? 'active' : ''}`}
                  onClick={() => { props.onKeyModeChange(option.value || null); setOpenMenu(null); }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="spacer" />

      {/* Right button group */}
      <div className="btn-group">
        {/* Bass */}
        <div className="btn-with-label">
          <button className={`menu-btn dark ${props.bassMode !== 'off' ? 'active' : ''}`} onClick={toggleMenu('bass')}>
            <span className={`bass-light ${props.bassMode !== 'off' ? 'active' : ''}`} />
          </button>
          <span className="btn-label">Bass</span>
          <div className="tooltip">Bass mode</div>
          {openMenu === 'bass' && (
            <div className="dropdown-menu visible">
              {BASS_MODES.map(mode => (
                <div
                  key={mode.value}
                  className={`dropdown-item ${props.bassMode === mode.value ? 'active' : ''}`}
                  onClick={() => { props.onBassModeChange(mode.value as BassMode); setOpenMenu(null); }}
                >
                  {mode.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loop/Drums */}
        <div className="btn-with-label">
          <button 
            className={`menu-btn red ${props.drumsPlaying ? 'recording' : ''}`} 
            onClick={(e) => { 
              e.stopPropagation();
              if (props.drumsPlaying) {
                props.onDrumsToggle();
              } else {
                toggleMenu('drums')(e);
              }
            }} 
          />
          <span className="btn-label">Loop</span>
          <div className="tooltip">Record loop (L)</div>
          {openMenu === 'drums' && (
            <div className="drum-panel visible">
              <div className="drum-panel-title">Select Drum Pattern</div>
              <div className="drum-grid">
                {props.drumPatterns.map((pattern, i) => (
                  <div
                    key={i}
                    className={`drum-item ${props.drumPattern === i ? 'active' : ''}`}
                    onClick={() => { props.onDrumPatternSelect(i); setOpenMenu(null); }}
                  >
                    {pattern.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BPM */}
        <div className="btn-with-label">
          <button className="menu-btn dark" />
          <span className="btn-label">BPM</span>
          <div className="tooltip">Tempo (- / =)</div>
        </div>

        {/* MIDI */}
        <div className="btn-with-label">
          <button className="menu-btn dark" onClick={toggleMenu('midi')} />
          <span className="btn-label">MIDI</span>
          <div className="tooltip">MIDI Settings</div>
          {openMenu === 'midi' && (
            <div className="effects-panel visible" style={{ minWidth: 220 }}>
              <div className="effect-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <span className="effect-label">MIDI Input</span>
                <select
                  value={props.selectedMidiInput}
                  onChange={(e) => props.onMidiInputChange(e.target.value)}
                  className="midi-select"
                >
                  <option value="">None</option>
                  {props.midiInputs.map(input => (
                    <option key={input.id} value={input.id}>{input.name}</option>
                  ))}
                </select>
              </div>
              <div className="effect-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, marginTop: 12 }}>
                <span className="effect-label">MIDI Output</span>
                <select
                  value={props.selectedMidiOutput}
                  onChange={(e) => props.onMidiOutputChange(e.target.value)}
                  className="midi-select"
                >
                  <option value="">None</option>
                  {props.midiOutputs.map(output => (
                    <option key={output.id} value={output.id}>{output.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="btn-with-label">
          <button className={`menu-btn dark ${props.polyMode ? 'active' : ''}`} onClick={toggleMenu('options')} />
          <span className="btn-label">Options</span>
          <div className="tooltip">Settings</div>
          {openMenu === 'options' && (
            <div className="effects-panel visible" style={{ minWidth: 200 }}>
              <div className="option-row">
                <span className="option-label">Layered Chords</span>
                <button 
                  className={`option-toggle ${props.polyMode ? 'active' : ''}`}
                  onClick={() => props.onPolyModeChange(!props.polyMode)}
                >
                  {props.polyMode ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="option-hint">
                Play multiple chords simultaneously by holding multiple keys
              </div>
              <div className="option-divider" />
              <div 
                className="dropdown-item" 
                style={{ padding: '10px 0', textAlign: 'center' }}
                onClick={() => { props.onShowHelp(); setOpenMenu(null); }}
              >
                Show Tutorial
              </div>
            </div>
          )}
        </div>

        {/* Volume */}
        <div className="btn-with-label">
          <button className="menu-btn dark" onClick={toggleMenu('volume')} />
          <span className="btn-label">Volume</span>
          <div className="tooltip">Master volume</div>
          {openMenu === 'volume' && (
            <div className="effects-panel volume-panel visible">
              <div className="effect-row">
                <span className="effect-label">Volume</span>
                <input
                  type="range"
                  className="effect-slider"
                  min="0"
                  max="100"
                  value={props.masterVolume}
                  onChange={(e) => props.onMasterVolumeChange(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loop indicator */}
      {props.drumsPlaying && (
        <div className="loop-indicator visible">
          {props.drumPatterns[props.drumPattern]?.name}
        </div>
      )}

      {/* Chord display */}
      <div className="chord-display">
        <div className="chord-name" dangerouslySetInnerHTML={{ __html: props.chordName || '—' }} />
        <div className="chord-notes">{props.chordNotes}</div>
        {props.keyIndicator && (
          <div className="key-indicator active">{props.keyIndicator}</div>
        )}
      </div>
    </div>
  );
}

