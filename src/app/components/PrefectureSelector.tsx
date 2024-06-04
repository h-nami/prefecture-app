import React from "react";
import styles from './PopulationTypeSelector.module.css';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  selectedPrefCodes: number[];
  onCheckboxChange: (prefCode: number) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefCodes,
  onCheckboxChange
}) => {
  return (
    <div className="flex-container">
      {prefectures.map((pref) => (
        <div key={pref.prefCode} className="flex-item">
          <label className={styles.prefecture_box}>
            <input
              type="checkbox"
              name={`pref-${pref.prefCode}`}
              value={pref.prefCode}
              checked={selectedPrefCodes.includes(pref.prefCode)}
              onChange={() => onCheckboxChange(pref.prefCode)}
            />
            {pref.prefName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PrefectureSelector;
