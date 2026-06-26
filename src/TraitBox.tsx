import React from 'react';

interface TraitBoxProps {
  name: string;
  onRemove: () => void;
}

const TraitBox: React.FC<TraitBoxProps> = ({ name, onRemove }) => {
  return (
    <span 
      className="trait-badge-dark"
      onClick={onRemove}
      title="Click to remove trait"
    >
      {name}
      <span className="remove-cross">×</span>
    </span>
  );
};

export default TraitBox;