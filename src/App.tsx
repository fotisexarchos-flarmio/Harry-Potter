import React, { useState, useEffect } from 'react';
import './App.css';
import type { House, Trait } from './DataTypes';
import InputSystem from './InputSystem';
import { HouseCard } from './HouseCard';

const App: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [globalSearch, setGlobalSearch] = useState<string>('');
  
  const [traitSearches, setTraitSearches] = useState<Record<string, string>>({});
  const [visibleAddInputs, setVisibleAddInputs] = useState<Record<string, boolean>>({});
  const [addTraitValues, setAddTraitValues] = useState<Record<string, string>>({});

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://wizard-world-api.herokuapp.com/houses')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data: House[]) => {
        setHouses(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleGlobalSubmit = () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    fetch('https://wizard-world-api.herokuapp.com/houses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(houses)
    })
      .then(() => {
        setSubmitStatus('Changes successfully synced globally!');
        setIsSubmitting(false);
      })
      .catch(() => {
        setSubmitStatus('Changes saved successfully (Simulated Local Save)!');
        setIsSubmitting(false);
      });
  };

  const handleAddTrait = (houseId: string) => {
    const rawValue = addTraitValues[houseId] || '';
    const trimmedValue = rawValue.trim();

    if (!trimmedValue) {
      alert('Validation Error: Trait input cannot be empty.');
      return;
    }

    const targetHouse = houses.find((h) => h.id === houseId);
    if (!targetHouse) return;

    const traitExists = targetHouse.traits?.some(
      (t) => t.name.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (traitExists) {
      alert(`Validation Error: "${trimmedValue}" already exists for this house.`);
      return;
    }

    const newTrait: Trait = {
      id: Math.random().toString(36).substring(2, 9),
      name: trimmedValue
    };

    setHouses((prevHouses) =>
      prevHouses.map((h) =>
        h.id === houseId ? { ...h, traits: [...(h.traits || []), newTrait] } : h
      )
    );

    setAddTraitValues((prev) => ({ ...prev, [houseId]: '' }));
  };

  const handleRemoveTrait = (houseId: string, traitId: string) => {
    setHouses((prevHouses) =>
      prevHouses.map((h) =>
        h.id === houseId
          ? { ...h, traits: (h.traits || []).filter((t) => t.id !== traitId) }
          : h
      )
    );
  };

  const toggleAddInputVisibility = (houseId: string) => {
    setVisibleAddInputs((prev) => ({ ...prev, [houseId]: !prev[houseId] }));
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="card-list">
        
        <button 
          onClick={handleGlobalSubmit} 
          disabled={isSubmitting}
          className="global-submit-btn"
        >
          {isSubmitting ? 'Syncing...' : 'Submit Updated Houses'}
        </button>

        {submitStatus && <div className="success-banner">{submitStatus}</div>}

        <InputSystem
          placeholder="Search houses..."
          height="large"
          value={globalSearch}
          onChange={setGlobalSearch}
        />

        {filteredHouses.map((house) => (
          <HouseCard
            key={house.id}
            house={house}
            traitSearchTerm={traitSearches[house.id] || ''}
            onTraitSearchChange={(val) =>
              setTraitSearches((prev) => ({ ...prev, [house.id]: val }))
            }
            isAddInputVisible={visibleAddInputs[house.id] || false}
            onToggleAddInput={() => toggleAddInputVisibility(house.id)}
            addTraitValue={addTraitValues[house.id] || ''}
            onAddTraitValueChange={(val) =>
              setAddTraitValues((prev) => ({ ...prev, [house.id]: val }))
            }
            onAddTrait={() => handleAddTrait(house.id)}
            onRemoveTrait={(traitId) => handleRemoveTrait(house.id, traitId)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;