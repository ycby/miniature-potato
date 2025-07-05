import './Section.css';
import {useState} from 'react';

export const Section = (props) => {

    const {
        sectionNo,
        section,
        mode,
        currentSettingSection,
        setCurrentSections,
        setCellsToValue,
        onRemove
    } = props;

    const [currentValue, setCurrentValue] = useState(section.initialValue);

    return (
        <div
            key={sectionNo}
            className='section'
            style={{
                backgroundColor: section.color,
            }}
        >
            <span className='section-number'>#{sectionNo + 1}</span>
            <div className='controls'>
                {mode === 'SETUP' && currentSettingSection == null &&
                    <button
                        onClick={() => setCurrentSections(sectionNo)}
                    >Edit</button>
                }
                {mode === 'SETUP' && currentSettingSection === sectionNo &&
                    <button
                        onClick={() => setCurrentSections(null)}
                    >Done</button>
                }
                {mode === 'SETUP' && currentSettingSection == null &&
                    <>
                        <input
                            type='number'
                            min='1'
                            max='9'
                            defaultValue={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)} />
                        <button onClick={() => setCellsToValue(section, currentValue)}>Set</button>
                    </>
                }
                {mode === 'SETUP' && currentSettingSection == null  &&
                    <button onClick={() => onRemove(sectionNo)}>Remove</button>
                }
            </div>
        </div>
    );
}