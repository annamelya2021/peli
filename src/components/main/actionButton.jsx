import "./actionButton.css";
import { PropTypes } from "prop-types";

const ActionButton = ({ label, onClick, className }) => (
  <button className={`action-button ${className}`} onClick={onClick}>
    {label}
  </button>
);

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};
export default ActionButton;
