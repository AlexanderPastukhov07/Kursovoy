document.addEventListener('DOMContentLoaded', function() {
  const sorryImage = document.querySelector('.sorry-image');
  const sorryMessage = document.querySelector('.sorry-message');
  const fadeEls = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  // Начинаем наблюдение за изображением и текстом
  observer.observe(sorryImage);
  observer.observe(sorryMessage);
  fadeEls.forEach(el => observer.observe(el));
}); 