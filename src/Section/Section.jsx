import './Section.css';
import { useState } from 'react';

export const Section = (props) => {

  const {
    name,
    sectionNo,
    color,
    cells,
    currentSettingSection,
    setCurrentSections,
    setCellsToValue,
  } = props;

  const [currentValue, setCurrentValue] = useState(sectionNo + 1);

  return (
    <div
      key={sectionNo}
      className='section'
      style={{
        backgroundColor: color,
      }}
    >
      <span>{name}</span>
      {currentSettingSection == null &&
        <button
          onClick={() => {
            console.log(sectionNo)
            setCurrentSections(sectionNo);
          }}
        >Edit</button>
      }
      {currentSettingSection === sectionNo &&
        <button
          onClick={() => {
            setCurrentSections(null);
          }}
        >Done</button>
      }
      {currentSettingSection == null &&
        <>
          <input
            type='number'
            min='1'
            max='9'
            defaultValue={currentValue}
            onChange={(e) => {
              setCurrentValue(e.target.value)
            }} />
          <button onClick={() => {

            setCellsToValue(cells, currentValue)
          }}>
            Set
          </button>
        </>
      }
    </div>
  );
}