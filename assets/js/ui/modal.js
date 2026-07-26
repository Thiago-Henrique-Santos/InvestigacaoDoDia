const modalRoot = document.getElementById('modal-root');

export const openModal = (content) => {
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card">${content}</div>
    </div>
  `;
};

export const closeModal = () => {
  if (!modalRoot) return;
  modalRoot.innerHTML = '';
};
