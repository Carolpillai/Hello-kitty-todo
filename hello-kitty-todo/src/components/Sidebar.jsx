import React, { useState } from 'react';
import { List, LayoutDashboard, Calendar as CalendarIcon, Tag, Star, Plus } from 'lucide-react';

const Sidebar = ({ view, setView, categories, activeCategory, setActiveCategory, onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  };
  const navItems = [
    { id: 'list', label: 'List View', icon: <List size={18} /> },
    { id: 'kanban', label: 'Kanban Board', icon: <LayoutDashboard size={18} /> }
  ];

  return (
    <aside className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--hk-text-light)', marginBottom: '16px', letterSpacing: '1px' }}>Views</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: 'var(--radius-lg)', width: '100%', textAlign: 'left',
                backgroundColor: view === item.id ? 'var(--hk-primary)' : 'transparent',
                color: view === item.id ? 'white' : 'var(--hk-text)',
                fontWeight: view === item.id ? 700 : 600,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, color: 'var(--hk-text-light)', marginBottom: '16px', letterSpacing: '1px' }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px',
              borderRadius: 'var(--radius-lg)', width: '100%', textAlign: 'left',
              backgroundColor: activeCategory === null ? 'rgba(255, 77, 133, 0.1)' : 'transparent',
              color: activeCategory === null ? 'var(--hk-primary)' : 'var(--hk-text)',
              fontWeight: activeCategory === null ? 700 : 600,
            }}
          >
            <Star size={16} color={activeCategory === null ? 'var(--hk-primary)' : 'var(--hk-text-light)'} />
            All Tasks
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px',
                borderRadius: 'var(--radius-lg)', width: '100%', textAlign: 'left',
                backgroundColor: activeCategory === cat.id ? 'rgba(255, 77, 133, 0.1)' : 'transparent',
                color: activeCategory === cat.id ? 'var(--hk-primary)' : 'var(--hk-text)',
                fontWeight: activeCategory === cat.id ? 700 : 600,
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }}></div>
              {cat.name}
            </button>
          ))}
          
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input 
              type="text" 
              placeholder="New category..." 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-full)', 
                border: '1px solid var(--hk-border)', fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button type="submit" disabled={!newCategoryName.trim()} style={{
              background: 'var(--hk-primary)', color: 'white', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              opacity: newCategoryName.trim() ? 1 : 0.5
            }}>
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
