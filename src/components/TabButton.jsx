import React from 'react';

function TabButton({ config, active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: `${config.font_size * 0.75}px ${config.font_size * 1.5}px`,
        border: 'none',
        background: 'transparent',
        fontSize: `${config.font_size}px`,
        fontWeight: 600,
        cursor: 'pointer',
        color: active ? config.primary_action_color : config.text_color,
        opacity: active ? 1 : 0.6,
        borderBottom: `3px solid ${active ? config.primary_action_color : 'transparent'}`,
        whiteSpace: 'nowrap'
      }}
    >
      <i className={icon}></i> {text}
    </button>
  );
}

export default TabButton;