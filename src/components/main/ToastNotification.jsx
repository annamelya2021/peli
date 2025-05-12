import React from "react";
import "./ToastNotification.css";

const ToastNotification = ({ message, visible }) => {
  return visible && <div className="toast-notification">{message}</div>;
};

export default ToastNotification;
