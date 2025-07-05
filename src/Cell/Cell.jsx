import {useState} from 'react';
import './Cell.css';

export const Cell = (props) => {

    const {
        mode,
        cell,
        onClick,
        onUpdateValue,
        style,
        className
    } = props;

    const [editing, setEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(cell.number);

    const numberOnly = new RegExp('^[0-9-]$');

    return (
        <div
            title={`[${cell.possibleValues.toString()}]
Overflow: ${cell.availableOverflow}`}
            className={`cell ${cell.isBlack ? 'is-black' : ''} ${className}`}
            style={style}
            onClick={() => {

                if (mode === 'SETUP') {
                    onClick({x: cell.x, y: cell.y});
                } else if (mode === 'SOLVE') {
                    setEditing(true);
                }
            }}
        >
            {cell.isFixed &&
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
                        onUpdateValue({x: cell.x, y: cell.y}, editingValue);
                        //TODO: Validation on blur. If new value is not in list of possible values, prevent blur
                        //this is just for manual editing
                    }}
                    onChange={(e) => {

                        if (e.target.value !== '' && !numberOnly.test(e.target.value)) return;

                        setEditingValue(e.target.value);
                    }}
                />
                :
                <span>{cell.number}</span>
            }
        </div>
    )
}