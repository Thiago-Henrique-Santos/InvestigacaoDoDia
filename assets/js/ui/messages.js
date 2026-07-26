const messageRoot = document.getElementById('message-root');

export const showMessage = (text, type = 'info') => {
  if (!messageRoot) return;

  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.innerHTML = `<span>${text}</span>`;
  messageRoot.innerHTML = '';
  messageRoot.appendChild(message);

  setTimeout(() => {
    messageRoot.innerHTML = '';
  }, 3600);
};
