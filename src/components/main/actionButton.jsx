import "./actionButton.css";
import { PropTypes } from "prop-types";

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const ActionButton = ({ label, onClick, className }) => (
  <button className={`action-button ${className}`} onClick={onClick}>
    {label}
  </button>
);

export default ActionButton;
