import { ACTION_LABELS, ACTION_GROUPS } from '../hooks/useMidiMapping';
import type { MidiMappableAction, MidiMapping } from '../types';
import './MidiMappingModal.css';

interface MidiMappingModalProps {
  visible: boolean;
  enabled: boolean;
  learnMode: MidiMappableAction | null;
  lastMidiNote: { note: number; deviceId?: string } | null;
  getMappingForAction: (action: MidiMappableAction) => MidiMapping | undefined;
  getNoteLabel: (note: number) => string;
  onStartLearn: (action: MidiMappableAction) => void;
  onCancelLearn: () => void;
  onRemoveMapping: (action: MidiMappableAction) => void;
  onClearAll: () => void;
  onSetEnabled: (enabled: boolean) => void;
  onClose: () => void;
}

export function MidiMappingModal({
  visible,
  enabled,
  learnMode,
  lastMidiNote,
  getMappingForAction,
  getNoteLabel,
  onStartLearn,
  onCancelLearn,
  onRemoveMapping,
  onClearAll,
  onSetEnabled,
  onClose,
}: MidiMappingModalProps) {
  if (!visible) return null;

  return (
    <div className="midi-mapping-overlay" onClick={onClose}>
      <div className="midi-mapping-modal" onClick={e => e.stopPropagation()}>
        <div className="midi-mapping-header">
          <h2>MIDI Pad Mapping</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="midi-mapping-description">
          Map MIDI pads or notes to control chord types and extensions. 
          Use with drum pads, a second controller, or any MIDI device.
        </p>

        <div className="midi-mapping-toggle">
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => onSetEnabled(e.target.checked)}
            />
            <span>Enable MIDI Mappings</span>
          </label>
        </div>

        {learnMode && (
          <div className="learn-mode-banner">
            <div className="learn-pulse" />
            <span>
              Waiting for MIDI input for <strong>{ACTION_LABELS[learnMode]}</strong>...
            </span>
            {lastMidiNote && (
              <span className="last-note">Last: {getNoteLabel(lastMidiNote.note)}</span>
            )}
            <button onClick={onCancelLearn}>Cancel</button>
          </div>
        )}

        <div className="midi-mapping-groups">
          {ACTION_GROUPS.map(group => (
            <div key={group.name} className="mapping-group">
              <h3>{group.name}</h3>
              <div className="mapping-items">
                {group.actions.map(action => {
                  const mapping = getMappingForAction(action);
                  const isLearning = learnMode === action;
                  
                  return (
                    <div 
                      key={action} 
                      className={`mapping-item ${isLearning ? 'learning' : ''} ${mapping ? 'mapped' : ''}`}
                    >
                      <span className="action-label">{ACTION_LABELS[action]}</span>
                      <span className="mapping-value">
                        {mapping ? getNoteLabel(mapping.note) : '—'}
                      </span>
                      <div className="mapping-actions">
                        <button 
                          className={`learn-btn ${isLearning ? 'active' : ''}`}
                          onClick={() => isLearning ? onCancelLearn() : onStartLearn(action)}
                          disabled={learnMode !== null && !isLearning}
                        >
                          {isLearning ? 'Cancel' : 'Learn'}
                        </button>
                        {mapping && (
                          <button 
                            className="clear-btn"
                            onClick={() => onRemoveMapping(action)}
                            disabled={learnMode !== null}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="midi-mapping-footer">
          <button className="clear-all-btn" onClick={onClearAll} disabled={learnMode !== null}>
            Clear All Mappings
          </button>
        </div>
      </div>
    </div>
  );
}

