import PropTypes from "prop-types";
import "./ToastNotification.css";

const ToastNotification = ({ message, visible }) => {
  return visible && <div className="toast-notification">{message}</div>;
};

ToastNotification.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};
export default ToastNotification;
