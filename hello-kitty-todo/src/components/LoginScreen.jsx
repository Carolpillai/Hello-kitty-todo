import React, { useState } from 'react';
import { Heart, UserPlus, Sparkles } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLogin(inputValue.trim());
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--hk-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Heart fill="var(--hk-primary)" color="var(--hk-primary)" size={48} className="animate-pop-in" />
          <Sparkles color="var(--hk-secondary)" size={24} style={{ position: 'absolute', top: -10, right: -10 }} />
        </div>
        
        <h2 style={{ color: 'var(--hk-primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          Welcome back! 🎀
        </h2>
        <p style={{ color: 'var(--hk-text-light)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Please sign in to view your tasks or join the fun as a guest!
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Enter your Name or Email..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="hk-input"
            style={{ width: '100%', padding: '12px 16px', fontSize: '1rem', textAlign: 'center' }}
          />

          <button 
            type="submit" 
            className="hk-button"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            disabled={!inputValue.trim()}
          >
            <UserPlus size={18} /> Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <hr style={{ position: 'absolute', width: '100%', border: 'none', borderTop: '1px solid var(--hk-border)', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 2, backgroundColor: 'white', padding: '0 12px', fontSize: '0.8rem', color: 'var(--hk-text-light)', fontWeight: 600 }}>OR</span>
        </div>

        <button 
          onClick={() => onLogin('Guest')}
          className="hk-button-outline"
          style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '16px' }}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
