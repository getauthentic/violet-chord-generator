import { useCallback, useState, useEffect } from 'react';
import type { MidiMapping, MidiMappableAction, MidiMappingConfig } from '../types';

const STORAGE_KEY = 'violet-midi-mappings';

const DEFAULT_CONFIG: MidiMappingConfig = {
  mappings: [],
  enabled: true,
};

// Human-readable labels for actions
export const ACTION_LABELS: Record<MidiMappableAction, string> = {
  chordMaj: 'Major (1)',
  chordMin: 'Minor (2)',
  chordDim: 'Diminished (3)',
  chordAug: 'Augmented (4)',
  ext6: 'Add 6th',
  extm7: 'Add m7',
  extM7: 'Add M7',
  ext9: 'Add 9th',
  octaveUp: 'Octave Up',
  octaveDown: 'Octave Down',
  voicingUp: 'Voicing Up',
  voicingDown: 'Voicing Down',
};

// Group actions for UI
export const ACTION_GROUPS = [
  {
    name: 'Chord Types',
    actions: ['chordMaj', 'chordMin', 'chordDim', 'chordAug'] as MidiMappableAction[],
  },
  {
    name: 'Extensions',
    actions: ['ext6', 'extm7', 'extM7', 'ext9'] as MidiMappableAction[],
  },
  {
    name: 'Navigation',
    actions: ['octaveUp', 'octaveDown', 'voicingUp', 'voicingDown'] as MidiMappableAction[],
  },
];

export function useMidiMapping() {
  const [config, setConfig] = useState<MidiMappingConfig>(DEFAULT_CONFIG);
  const [learnMode, setLearnMode] = useState<MidiMappableAction | null>(null);
  const [lastMidiNote, setLastMidiNote] = useState<{ note: number; deviceId?: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as MidiMappingConfig;
        setConfig(parsed);
      }
    } catch (e) {
      console.warn('Failed to load MIDI mappings:', e);
    }
  }, []);

  // Save to localStorage when config changes
  const saveConfig = useCallback((newConfig: MidiMappingConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save MIDI mappings:', e);
    }
  }, []);

  // Start learning a mapping
  const startLearn = useCallback((action: MidiMappableAction) => {
    setLearnMode(action);
    setLastMidiNote(null);
  }, []);

  // Cancel learning
  const cancelLearn = useCallback(() => {
    setLearnMode(null);
    setLastMidiNote(null);
  }, []);

  // Process incoming MIDI note (call this from useMidi)
  const processMidiForLearn = useCallback((note: number, deviceId?: string) => {
    setLastMidiNote({ note, deviceId });
    
    if (learnMode) {
      // Remove any existing mapping for this action
      const newMappings = config.mappings.filter(m => m.action !== learnMode);
      
      // Add the new mapping
      newMappings.push({
        note,
        action: learnMode,
        deviceId,
      });
      
      saveConfig({ ...config, mappings: newMappings });
      setLearnMode(null);
      return true; // Consumed for learning
    }
    
    return false; // Not in learn mode
  }, [learnMode, config, saveConfig]);

  // Get action for a MIDI note (returns action if mapped, null otherwise)
  const getActionForNote = useCallback((note: number, deviceId?: string): MidiMappableAction | null => {
    if (!config.enabled) return null;
    
    const mapping = config.mappings.find(m => {
      if (m.note !== note) return false;
      // If mapping has a specific device, check it matches
      if (m.deviceId && deviceId && m.deviceId !== deviceId) return false;
      return true;
    });
    
    return mapping?.action ?? null;
  }, [config]);

  // Remove a mapping
  const removeMapping = useCallback((action: MidiMappableAction) => {
    const newMappings = config.mappings.filter(m => m.action !== action);
    saveConfig({ ...config, mappings: newMappings });
  }, [config, saveConfig]);

  // Clear all mappings
  const clearAllMappings = useCallback(() => {
    saveConfig({ ...config, mappings: [] });
  }, [config, saveConfig]);

  // Toggle enabled state
  const setEnabled = useCallback((enabled: boolean) => {
    saveConfig({ ...config, enabled });
  }, [config, saveConfig]);

  // Get mapping for an action
  const getMappingForAction = useCallback((action: MidiMappableAction): MidiMapping | undefined => {
    return config.mappings.find(m => m.action === action);
  }, [config]);

  // Get note name for display
  const getNoteLabel = useCallback((note: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(note / 12) - 1;
    const noteName = noteNames[note % 12];
    return `${noteName}${octave} (${note})`;
  }, []);

  return {
    config,
    learnMode,
    lastMidiNote,
    startLearn,
    cancelLearn,
    processMidiForLearn,
    getActionForNote,
    removeMapping,
    clearAllMappings,
    setEnabled,
    getMappingForAction,
    getNoteLabel,
  };
}

