import { useCallback, useRef, useState, useEffect } from 'react';

interface MidiDevice {
  id: string;
  name: string;
}

export function useMidi(onNoteOn?: (note: number, velocity: number) => void, onNoteOff?: (note: number) => void) {
  const [inputs, setInputs] = useState<MidiDevice[]>([]);
  const [outputs, setOutputs] = useState<MidiDevice[]>([]);
  const [selectedInput, setSelectedInput] = useState<string>('');
  const [selectedOutput, setSelectedOutput] = useState<string>('');
  const [inputConnected, setInputConnected] = useState(false);
  const [outputConnected, setOutputConnected] = useState(false);

  const accessRef = useRef<MIDIAccess | null>(null);
  const outputRef = useRef<MIDIOutput | null>(null);

  const handleMidiMessage = useCallback((event: MIDIMessageEvent) => {
    const [status, note, velocity] = event.data || [];
    const command = status >> 4;
    
    if (command === 9 && velocity > 0) {
      onNoteOn?.(note, velocity / 127);
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      onNoteOff?.(note);
    }
  }, [onNoteOn, onNoteOff]);

  const initialize = useCallback(async () => {
    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      accessRef.current = access;

      const inputDevices: MidiDevice[] = [];
      const outputDevices: MidiDevice[] = [];

      for (const input of access.inputs.values()) {
        inputDevices.push({ id: input.id, name: input.name || 'Unknown' });
      }
      for (const output of access.outputs.values()) {
        outputDevices.push({ id: output.id, name: output.name || 'Unknown' });
      }

      setInputs(inputDevices);
      setOutputs(outputDevices);
    } catch (err) {
      console.log('MIDI not available:', err);
    }
  }, []);

  const selectInput = useCallback((id: string) => {
    if (!accessRef.current) return;

    // Clear existing listeners
    for (const input of accessRef.current.inputs.values()) {
      input.onmidimessage = null;
    }
    setInputConnected(false);

    if (id) {
      const input = accessRef.current.inputs.get(id);
      if (input) {
        input.onmidimessage = handleMidiMessage;
        setInputConnected(true);
      }
    }
    setSelectedInput(id);
  }, [handleMidiMessage]);

  const selectOutput = useCallback((id: string) => {
    if (!accessRef.current) return;

    setOutputConnected(false);
    outputRef.current = null;

    if (id) {
      const output = accessRef.current.outputs.get(id);
      if (output) {
        outputRef.current = output;
        setOutputConnected(true);
      }
    }
    setSelectedOutput(id);
  }, []);

  const sendNoteOn = useCallback((note: number, velocity = 100) => {
    outputRef.current?.send([0x90, note, velocity]);
  }, []);

  const sendNoteOff = useCallback((note: number) => {
    outputRef.current?.send([0x80, note, 0]);
  }, []);

  useEffect(() => {
    return () => {
      if (accessRef.current) {
        for (const input of accessRef.current.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, []);

  return {
    inputs,
    outputs,
    selectedInput,
    selectedOutput,
    inputConnected,
    outputConnected,
    initialize,
    selectInput,
    selectOutput,
    sendNoteOn,
    sendNoteOff,
  };
}

