import {FcCheckmark} from "react-icons/fc";
import {FcCancel} from "react-icons/fc";
import './Constraint.css';
import {useState} from "react";
import {CELL_SIZE} from "../App.jsx";

export const Constraint = (props) => {

    const {
        index,
        mode,
        setConstraint,
        editWindowSize,
        constraint,
        verifyRow
    } = props;

    const [isEditingConstraint, setIsEditingConstraint] = useState(false);
    const [editedName, setEditedName] = useState(constraint.name);
    const [editedChecker, setEditedChecker] = useState(constraint.checker.toString());

    return (
        <div
            className='constraint' style={{height: `${CELL_SIZE}px`}}
        >
            {mode === 'SETUP' &&
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{width: '200px', textOverflow: 'ellipsis', display: 'inline-block', overflow: 'hidden', whiteSpace:'nowrap', textAlign: 'end'}}>{constraint.name}</span>
                    <button onClick={() => setIsEditingConstraint(true)}>Set</button>
                </div>
            }
            {mode === 'SOLVE' &&
                <>
                    {
                        constraint.correct != null &&
                        displayStatus(constraint.correct)
                    }
                    <div onClick={() => verifyRow()}>
                        {constraint.name}
                    </div>
                </>
            }
            {isEditingConstraint &&
                <div
                    className='edit-constraint-container'
                    style={{
                        width: `${editWindowSize}px`,
                        height: `${editWindowSize}px`,
                        top: `${(-index * CELL_SIZE).toString()}px`
                    }}
                >
                    <span style={{alignSelf: 'flex-start'}}>Name</span>
                    <input
                        type='text'
                        value={editedName}
                        onChange={(e) => {
                            setEditedName(e.target.value);
                        }}
                    />
                    <span style={{alignSelf: 'flex-start'}}>Checker Function</span>
                    <textarea
                        rows='10'
                        onChange={(e) => {
                            setEditedChecker(e.target.value);
                        }}
                        defaultValue={editedChecker}
                    />
                    <button
                        onClick={() => {
                            setConstraint({ ...constraint, name: editedName, checker: eval(editedChecker) });
                            setIsEditingConstraint(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            }
        </div>
    );
}

const displayStatus = (status) => {

    return status ? <FcCheckmark/> : <FcCancel/>;
}