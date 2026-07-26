export const renderCard = (title, content, footer = '') => `
  <article class="card">
    <h3 class="screen-title">${title}</h3>
    <p class="screen-copy">${content}</p>
    ${footer ? `<div class="separator"></div><p class="screen-copy">${footer}</p>` : ''}
  </article>
`;
