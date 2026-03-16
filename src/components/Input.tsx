import React, { type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className={`input-wrapper ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <div className={`input-container ${error ? 'error' : ''}`}>
          {icon && <span className="input-icon">{icon}</span>}
          <input ref={ref} className="input-field" {...props} />
        </div>
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
