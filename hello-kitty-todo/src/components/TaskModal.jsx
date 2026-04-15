import React, { useState } from 'react';
import { X, Users, MessageSquare, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TaskModal = ({ task, categories, onClose, onUpdate, currentUser }) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const category = categories.find(c => c.id === task.categoryId) || categories[0];
  const collaborators = task.collaborators || [];
  const comments = task.comments || [];

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (!collaboratorEmail.trim()) return;
    
    onUpdate({
      ...task,
      collaborators: [...collaborators, collaboratorEmail.trim()]
    });
    setCollaboratorEmail('');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: uuidv4(),
      text: newComment.trim(),
      author: currentUser || 'Me',
      timestamp: new Date().toISOString()
    };

    onUpdate({
      ...task,
      comments: [...comments, commentObj]
    });
    setNewComment('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto',
        padding: '32px', position: 'relative', background: 'white'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--hk-text-light)' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', paddingRight: '32px' }}>{task.title}</h2>
        <span className="badge" style={{ backgroundColor: category.color + '33', color: category.color, display: 'inline-block', marginBottom: '24px' }}>
          {category.name}
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Collaborators Section */}
          <div style={{ borderTop: '2px solid var(--hk-bg)', paddingTop: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
              <Users size={18} color="var(--hk-primary)"/> Collaborators
            </h3>
            
            <form onSubmit={handleAddCollaborator} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="colleague@example.com"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                className="hk-input"
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <button type="submit" className="hk-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Invite</button>
            </form>

            {collaborators.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {collaborators.map((email, idx) => (
                  <span key={idx} style={{ background: 'var(--hk-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {email}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--hk-text-light)' }}>No collaborators yet.</p>
            )}
          </div>

          {/* Comments Section */}
          <div style={{ borderTop: '2px solid var(--hk-bg)', paddingTop: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
              <MessageSquare size={18} color="var(--hk-primary)"/> Notes & Comments
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
              {comments.length > 0 ? comments.map(comment => (
                <div key={comment.id} style={{ background: 'var(--hk-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{comment.author}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--hk-text-light)' }}>
                      {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>{comment.text}</p>
                </div>
              )) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--hk-text-light)' }}>Write down some notes for this task!</p>
              )}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add a comment or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="hk-input"
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ background: 'var(--hk-primary)', border: 'none', color: 'white', borderRadius: 'var(--radius-md)', padding: '0 16px' }}>
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskModal;
