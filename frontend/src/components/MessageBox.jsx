function MessageBox({ message }) {
  if (!message) {
    return null;
  }

  return <div className={`message-box ${message.type}`}>{message.text}</div>;
}

export default MessageBox;
