import React, { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Tag, AlertCircle, Users, Check, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TaskInput = ({ onAddTask, categories, knownFriends }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('low');
  
  const [showCollab, setShowCollab] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [addedFriends, setAddedFriends] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      categoryId: categoryId || 'cat_personal',
      priority,
      status: 'todo',
      createdAt: new Date().toISOString(),
      completed: false,
      collaborators: addedFriends
    };

    onAddTask(newTask);
    setTitle('');
    setShowCollab(false);
    setSelectedFriend('');
    setNewEmail('');
    setAddedFriends([]);
  };

  const handleAddCollab = () => {
    if (selectedFriend === 'new' && newEmail.trim()) {
      if (!addedFriends.includes(newEmail.trim())) {
        setAddedFriends([...addedFriends, newEmail.trim()]);
      }
      setNewEmail('');
      setSelectedFriend('');
    } else if (selectedFriend && selectedFriend !== 'new') {
      if (!addedFriends.includes(selectedFriend)) {
        setAddedFriends([...addedFriends, selectedFriend]);
      }
      setSelectedFriend('');
    }
  };

  const removeFriend = (f) => {
    setAddedFriends(addedFriends.filter(item => item !== f));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input
        type="text"
        className="hk-input"
        placeholder="What cute task needs doing today?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ fontSize: '1.2rem', padding: '16px' }}
      />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="hk-input" 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }}
          >
            <option value="" disabled>Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select 
            className="hk-input" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button 
            type="button" 
            className="hk-button-outline"
            onClick={() => setShowCollab(!showCollab)}
            style={{ padding: '8px 12px', border: showCollab ? '2px solid var(--hk-primary)' : '2px dashed var(--hk-primary)' }}
          >
            <Users size={16} /> Connect Friend
          </button>
        </div>

        <button type="submit" className="hk-button" disabled={!title.trim()}>
          <PlusCircle size={20} />
          Add Task
        </button>
      </div>

      {showCollab && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--hk-bg)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Collab with:</span>
            <select 
              className="hk-input" 
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="">-- Choose Friend --</option>
              {knownFriends.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
              <option value="new">+ Add New Email</option>
            </select>

            {selectedFriend === 'new' && (
              <input 
                type="text" 
                placeholder="friend@mail.com" 
                className="hk-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ padding: '8px 12px', width: '200px' }}
              />
            )}

            {(selectedFriend || newEmail) && (
              <button type="button" className="hk-button" onClick={handleAddCollab} style={{ padding: '8px 16px' }}>
                <Check size={16} /> Add
              </button>
            )}
          </div>

          {addedFriends.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {addedFriends.map(f => (
                <span key={f} style={{ 
                  background: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', 
                  fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px',
                  boxShadow: '0 2px 4px var(--hk-shadow)'
                }}>
                  {f}
                  <button type="button" onClick={() => removeFriend(f)} style={{ color: 'var(--hk-text-light)', display: 'flex', alignItems: 'center' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default TaskInput;
