import { LogOut } from 'lucide-react';
import React from 'react';

const Header = ({ currentUser, onLogout }) => {
  return (
    <header
      style={{
        position: 'relative',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        overflow: 'hidden',
        padding: '0 24px',
        // Make the header background very pale pink, similar to the image's background
        backgroundColor: '#fbf0f4',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 4px 15px rgba(255, 77, 133, 0.1)'
      }}
    >
      <img
        src="/header.jpg"
        alt="Header Banner"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill', // Strictly stretches it to the absolute top, bottom, and sides
          borderRadius: 'inherit', // Forces the image to perfectly curve its sides to match the header container!
          zIndex: 1,
          mixBlendMode: 'darken', // This magically removes the "box" edge by blending the pale background
          opacity: 0.95
        }}
      />

      <div style={{ flex: 1, zIndex: 5 }}></div>

      {/* Absolute positioned small profile tag at top right */}
      <div style={{ zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 16px', borderRadius: '20px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--hk-text-light)' }}>
          Playing as: <span style={{ color: 'var(--hk-primary)' }}>{currentUser}</span>
        </span>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--hk-text-light)' }} title="Log out">
          <LogOut size={16} />
        </button>
      </div>

    </header>
  );
};

export default Header;
