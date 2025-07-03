import {useState} from 'react';
import './Cell.css';

export const Cell = (props) => {

    const {
        mode,
        x = 0,
        y = 0,
        isFixed = false,
        isBlack = false,
        number,
        possibleValues,
        onClick,
        onUpdateValue,
        style,
        className
    } = props;

    const [editing, setEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(number);

    const numberOnly = new RegExp('^[0-9-]$');

    return (
        <div
            title={`[${possibleValues.toString()}]`}
            className={`cell ${isBlack ? 'is-black' : ''} ${className}`}
            style={style}
            onClick={() => {

                if (mode === 'SETUP') {
                    onClick({x: x, y: y});
                } else if (mode === 'SOLVE') {
                    setEditing(true);
                }
            }}
        >
            {isFixed &&
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
                        onUpdateValue({x: x, y: y}, editingValue);
                        //TODO: Validation on blur. If new value is not in list of possible values, prevent blur
                        //this is just for manual editing
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