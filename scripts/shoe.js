document.addEventListener('DOMContentLoaded', () => {
  // Анимация изображения и информации при загрузке страницы
  const imgBox = document.querySelector('.shoe-card__imgbox');
  const infoBox = document.querySelector('.shoe-card__info');
  
  setTimeout(() => {
    imgBox.classList.add('visible');
  }, 100);
  
  setTimeout(() => {
    infoBox.classList.add('visible');
  }, 100);

  // Анимация описания при появлении в области видимости
  const descBox = document.querySelector('.shoe-card__desc');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  observer.observe(descBox);
}); 