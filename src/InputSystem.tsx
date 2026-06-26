import React from 'react';

interface InputProps {
  placeholder: string;
  height: 'small' | 'large';
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputSystem: React.FC<InputProps> = ({ placeholder, height, value, onChange, onKeyDown }) => {
  const heightClass = height === 'small' ? 'input-small' : 'input-large';
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`custom-input ${heightClass}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default InputSystem;