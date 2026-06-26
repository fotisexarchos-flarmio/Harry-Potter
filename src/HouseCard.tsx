import React from 'react';
import InputSystem from './InputSystem';
import TraitBox from './TraitBox';
import type { House } from './DataTypes';
import { getHouseGradient } from './ColorSystem';

interface HouseCardProps {
  house: House;
  traitSearchTerm: string;
  onTraitSearchChange: (value: string) => void;
  isAddInputVisible: boolean;
  onToggleAddInput: () => void;
  addTraitValue: string;
  onAddTraitValueChange: (value: string) => void;
  onAddTrait: () => void;
  onRemoveTrait: (traitId: string) => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({
  house,
  traitSearchTerm,
  onTraitSearchChange,
  isAddInputVisible,
  onToggleAddInput,
  addTraitValue,
  onAddTraitValueChange,
  onAddTrait,
  onRemoveTrait,
}) => {
  const filteredTraits = (house.traits || []).filter((trait) =>
    trait.name.toLowerCase().includes(traitSearchTerm.toLowerCase())
  );

  return (
    <div className="house-card">
      <div className="card-header">
        <h2 className="house-name">{house.name}</h2>
        <span className="house-animal">{house.animal || 'Unknown'}</span>
      </div>
      
      <div 
        className="gradient-bar" 
        style={{ background: getHouseGradient(house.houseColours) }}
      />
      
      <div className="card-footer">
        <p className="house-founder">
          Founder: <strong>{house.founder || 'Unknown'}</strong>
        </p>
      </div>

      <div className="traits-section">
        <div className="action-row">
          <InputSystem
            placeholder="Search house traits..."
            height="small"
            value={traitSearchTerm}
            onChange={onTraitSearchChange}
          />
          <button 
            type="button"
            onClick={onToggleAddInput}
            className={`circle-add-btn ${isAddInputVisible ? 'active' : ''}`}
            title="Toggle add trait input"
          >
            +
          </button>
        </div>

        {isAddInputVisible && (
          <div className="add-trait-wrapper">
            <InputSystem
              placeholder="Type new trait and press Enter..."
              height="small"
              value={addTraitValue}
              onChange={onAddTraitValueChange}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  onAddTrait();
                }
              }}
            />
          </div>
        )}
        
        <div className="traits-container">
          {filteredTraits.length > 0 ? (
            filteredTraits.map((trait) => (
              <TraitBox
                key={trait.id}
                name={trait.name}
                onRemove={() => onRemoveTrait(trait.id)}
              />
            ))
          ) : (
            <span className="no-traits">
              {traitSearchTerm ? 'No matching traits' : 'No traits listed'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};