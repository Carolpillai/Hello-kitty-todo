import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

const NotesWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('hk_quick_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('hk_quick_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      
      {/* Expanded Notes Panel */}
      {isOpen && (
        <div 
          className="glass-panel animate-pop-in" 
          style={{ 
            width: '300px', 
            maxHeight: '450px', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '4px solid white'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hk-primary)', fontSize: '1.1rem' }}>
              <StickyNote size={20} /> My Notes
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ color: 'var(--hk-text-light)' }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={addNote} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="hk-input" 
              placeholder="Quick reminder..." 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            />
            <button type="submit" className="hk-button" style={{ padding: '8px' }}>
              <Plus size={20} />
            </button>
          </form>

          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--hk-text-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No notes yet. Jot something down! 🌸
              </div>
            ) : (
              notes.map(note => (
                <div 
                  key={note.id} 
                  style={{ 
                    background: 'white', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-md)', 
                    boxShadow: '0 2px 8px var(--hk-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    position: 'relative',
                    border: '1px solid var(--hk-bg)'
                  }}
                >
                  <p style={{ fontSize: '0.95rem', color: 'var(--hk-text)', paddingRight: '24px', wordBreak: 'break-word' }}>{note.text}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--hk-text-light)' }}>{note.timestamp}</span>
                    <button 
                      onClick={() => deleteNote(note.id)} 
                      style={{ color: '#ff6b6b', opacity: 0.7 }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        className="hk-button animate-pop-in"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '24px', 
          padding: 0, 
          justifyContent: 'center',
          boxShadow: '0 8px 16px var(--hk-shadow)',
          border: '3px solid white',
          transform: isOpen ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.3s ease'
        }}
        title="Quick Notes"
      >
        <StickyNote size={28} />
      </button>
    </div>
  );
};

export default NotesWidget;
