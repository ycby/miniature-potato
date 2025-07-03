
import './Modal.css';

const Modal = (props) => {

    const {
        isOpen = false,
        onClose
    } = props;

    return (
        isOpen &&
        <div
            className='modal-background'
            onClick={() => onClose()}
        >
            <div
                className='modal'
                onClickCapture={(e) => e.stopPropagation()}
            >
                {props.children}
            </div>
        </div>
    );
}
export default Modal;