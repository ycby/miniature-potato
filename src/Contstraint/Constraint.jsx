import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";

export const Constraint = (props) => {

  const {
    constraint,
    verifyRow
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        height: '41px',
        justifyContent: 'end',
        alignItems: 'center'
      }}
    >
      {
        constraint.correct != null &&
        displayStatus(constraint.correct)
      }
      <div
        onClick={() => {
          verifyRow();
        }}
      >
        {constraint.name}
      </div>
    </div>
  );
}

const displayStatus = (status) => {

  return status ? <FcCheckmark /> : <FcCancel />;
}