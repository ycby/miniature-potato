import { useState } from 'react';
import './Cell.css';

export const Cell = (props) => {

  const {
    x = 0,
    y = 0,
    isYellow = false,
    isBlack = false,
    number,
    isSettingSection,
    setSection,
    updateCellValue,
    setIsBlack,
    style
  } = props;

  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(number);

  const numberOnly = new RegExp('^[0-9-]$');

  return (
    <div
      className={`cell ${isBlack ? 'is-black' : ''}`}
      style={style}
      onClick={() => {

        if (isSettingSection) {

          setSection({x: x, y: y});
        } else {

          setEditing(true);
        }
      }}
    >
      {isYellow &&
        <div className='immutable'>
          *
        </div>
      }
      {editing ?
        <input
          type='text'
          value={editingValue}
          autoFocus={editing}
          onBlur={() => {
            setEditing(false);
            if (editingValue === '-') {

              setIsBlack({x: x, y: y});
            } else {

              updateCellValue({x: x, y: y}, editingValue);
            }
          }}
          onChange={(e) => {

            if (e.target.value !== '' && !numberOnly.test(e.target.value)) return;

            setEditingValue(e.target.value);
          }}
        />
        :
        <span>{number}</span>
      }
    </div>
  )
}