import React from 'react';
import styles from './PopulationTypeSelector.module.css';

interface PopulationTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const PopulationTypeSelector: React.FC<PopulationTypeSelectorProps> = ({ selectedType, onSelectType }) => {
  const populationTypes = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  return (
    <div>
      {populationTypes.map(type => (
        <button className={styles.population_button}
          key={type}
          onClick={() => onSelectType(type)}
          style={{ fontWeight: selectedType === type ? 'bold' : 'normal' }}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default PopulationTypeSelector;
