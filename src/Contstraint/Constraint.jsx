import {FcCheckmark} from "react-icons/fc";
import {FcCancel} from "react-icons/fc";
import './Constraint.css';

export const Constraint = (props) => {

    const {
        mode,
        constraint,
        verifyRow
    } = props;

    return (
        <div
            className='constraint'
        >
            {mode === 'SET_SECTIONS' &&
                <div>
                    {constraint.name}
                    <button>Set Constraint</button>
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
        </div>
    );
}

const displayStatus = (status) => {

    return status ? <FcCheckmark/> : <FcCancel/>;
}