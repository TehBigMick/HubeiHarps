document.addEventListener('DOMContentLoaded', () => {
  const buttons = [...document.querySelectorAll('.photo-open')];
  const dialog = document.querySelector('.photo-dialog');
  if (!buttons.length || !dialog) return;
  const image = dialog.querySelector('.photo-full');
  let current = 0;
  let opener;
  function show(index) {
    current = (index + buttons.length) % buttons.length;
    const source = buttons[current].querySelector('img');
    image.src = source.dataset.full;
    image.alt = source.alt;
    dialog.querySelector('.photo-count').textContent = `${current + 1} / ${buttons.length}`;
    dialog.querySelector('.photo-caption').textContent = buttons[current].closest('figure').querySelector('figcaption').textContent.trim();
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    opener = button;
    show(index);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.photo-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
});
