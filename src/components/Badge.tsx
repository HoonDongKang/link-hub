import React from 'react';
import { X } from 'lucide-react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'var(--accent-primary)', onRemove }) => {
  return (
    <span 
      className="badge" 
      style={{ 
        backgroundColor: `${color}20`, 
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {children}
      {onRemove && (
        <button 
          className="badge-remove" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          style={{ color: color }}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default Badge;
