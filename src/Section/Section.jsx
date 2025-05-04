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
  } = props;

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
    </div>
  );
}