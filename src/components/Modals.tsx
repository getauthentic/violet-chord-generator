import './Modals.css';

interface StartOverlayProps {
  visible: boolean;
  isReopened: boolean;
  onStart: () => void;
  onClose: () => void;
}

export function StartOverlay({ visible, isReopened, onStart, onClose }: StartOverlayProps) {
  if (!visible) return null;

  return (
    <div className={`start-overlay ${isReopened ? 'reopened' : ''}`}>
      {isReopened && (
        <button className="tutorial-close" onClick={onClose}>×</button>
      )}
      <h1>Violet</h1>
      
      <div className="tutorial-container">
        {/* Chord Types & Extensions */}
        <div className="tutorial-section">
          <div className="tutorial-section-title">Hold to modify chords</div>
          <div className="modifier-row">
            <div className="modifier-group">
              {['1', '2', '3', '4'].map((key, i) => (
                <div key={key} className="mod-key">
                  <div className="mod-key-cap">{key}</div>
                  <div className="mod-key-label">{['Dim', 'Min', 'Maj', 'Sus'][i]}</div>
                </div>
              ))}
            </div>
            <div className="modifier-group">
              {['5', '6', '7', '8'].map((key, i) => (
                <div key={key} className="mod-key">
                  <div className="mod-key-cap">{key}</div>
                  <div className="mod-key-label">{['6th', 'm7', 'M7', '9th'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="tutorial-section">
          <div className="tutorial-section-title">Play notes</div>
          <div className="piano-visual">
            <div className="piano-container">
              {[['A', 'C'], ['S', 'D'], ['D', 'E'], ['F', 'F'], ['G', 'G'], ['H', 'A'], ['J', 'B']].map(([comp, note]) => (
                <div key={comp} className="piano-white-key">
                  <span className="key-computer">{comp}</span>
                  <span className="key-note">{note}</span>
                </div>
              ))}
              {[['W', 'C#', 34], ['E', 'D#', 86], ['T', 'F#', 190], ['Y', 'G#', 242], ['U', 'A#', 294]].map(([comp, note, left]) => (
                <div key={comp as string} className="piano-black-key" style={{ left: `${left}px` }}>
                  <span className="key-computer">{comp}</span>
                  <span className="key-note">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Controls */}
        <div className="tutorial-section">
          <div className="tutorial-section-title">Other Controls</div>
          <div className="controls-grid">
            {[
              { keys: ['Z', 'X'], label: 'Voicing' },
              { keys: ['[', ']'], label: 'Octave' },
              { keys: ['-', '='], label: 'BPM' },
              { keys: ['L'], label: 'Loop' },
              { keys: [',', '.'], label: 'Drum Pattern' },
              { keys: ['Space'], label: 'Panic', wide: true },
              { keys: ['Esc'], label: 'Close Menus' },
            ].map(({ keys, label, wide }) => (
              <div key={label} className="control-item">
                <div className="control-keys">
                  {keys.map(k => (
                    <span key={k} className={`ctrl-key ${wide ? 'wide' : ''}`}>{k}</span>
                  ))}
                </div>
                <span className="control-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drum Machine */}
        <div className="tutorial-section">
          <div className="tutorial-section-title">Drum Machine (20 Patterns)</div>
          <div style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#e8a832' }}>1.</strong> Press <strong style={{ color: '#fff' }}>L</strong> or click Loop to open the drum pattern selector</p>
            <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#e8a832' }}>2.</strong> Choose from 20 patterns: Rock, Funk, Hip-Hop, Jazz, EDM, Trap, and more</p>
            <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#e8a832' }}>3.</strong> Use <strong style={{ color: '#fff' }}>, .</strong> keys to cycle through patterns while playing</p>
            <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>Press <strong>L</strong> again to stop drums. Use <strong>Metronome</strong> for a simple click track.</p>
          </div>
        </div>
      </div>

      {!isReopened && (
        <button className="start-btn" onClick={onStart}>Click to Start</button>
      )}
    </div>
  );
}

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <div className={`about-modal ${visible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="about-content">
        <button className="about-close" onClick={onClose}>×</button>
        <h2>About Violet</h2>
        <p>I discovered the incredible <strong><a href="https://telepathicinstruments.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>Telepathic Instruments Orchid</a></strong> and immediately fell in love with its design and concept. Unfortunately, I found out about it too late—they were sold out, and I couldn't get my hands on one.</p>
        <p>Rather than wait idly for the next batch, I decided to build Violet as a web-based tribute. I tried to capture as much of the Orchid's magic as possible: the chord generation, the performance modes, the beautiful interface design, and that special feeling of creative flow.</p>
        <p>This project is a labor of love and deep admiration for what the team at <a href="https://telepathicinstruments.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>Telepathic Instruments</a> has created. I'm a huge fan of their work and would be absolutely thrilled to collaborate or chat about music technology sometime.</p>
        <p><em>(And I really hope you're not mad at me for making this! I'm just trying to spread the joy while I wait for the next sale. 🙏)</em></p>
        <div className="signature">— Built with respect and admiration, <a href="https://natesiggard.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e8a832', textDecoration: 'none' }}>@natesiggard</a></div>
        <div style={{ marginTop: 16, fontSize: '0.75rem', color: '#666' }}>© 2025 <a href="https://getauthentic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>Authentic Creative</a></div>
      </div>
    </div>
  );
}

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <div className={`modal-overlay ${visible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Keyboard Controls</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-section">
          <h3>Play Notes</h3>
          <ul>
            <li><kbd>A-J</kbd> White keys (C D E F G A B)</li>
            <li><kbd>W E T Y U</kbd> Black keys</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Chord Types (hold)</h3>
          <ul>
            <li><kbd>1</kbd> Dim &nbsp; <kbd>2</kbd> Min &nbsp; <kbd>3</kbd> Maj &nbsp; <kbd>4</kbd> Sus</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Extensions (hold)</h3>
          <ul>
            <li><kbd>5</kbd> 6th &nbsp; <kbd>6</kbd> m7 &nbsp; <kbd>7</kbd> M7 &nbsp; <kbd>8</kbd> 9th</li>
          </ul>
        </div>
        <div className="modal-section">
          <h3>Controls</h3>
          <ul>
            <li><kbd>Z X</kbd> Voicing (0-60)</li>
            <li><kbd>[ ]</kbd> Octave</li>
            <li><kbd>- =</kbd> BPM</li>
            <li><kbd>L</kbd> Toggle Loop</li>
            <li><kbd>, .</kbd> Drum Pattern</li>
            <li><kbd>Space</kbd> Panic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RotateOverlay() {
  return (
    <div className="rotate-overlay active">
      <div className="rotate-icon">📱</div>
      <h2>Rotate Your Device</h2>
      <p>Violet works best in landscape mode. Please rotate your phone for the full experience.</p>
    </div>
  );
}

