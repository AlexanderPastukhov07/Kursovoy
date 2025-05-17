document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  
  // Добавляем класс для анимации сразу после загрузки страницы
  // с небольшой задержкой для более плавного эффекта
  setTimeout(() => {
    header.classList.add('header-visible');
    // Поочерёдная анимация пунктов меню
    const navItems = document.querySelectorAll('.nav-list li');
    navItems.forEach((item, idx) => {
      item.style.setProperty('--nav-delay', `${0.5 + idx * 0.25}s`);
    });
  }, 100);
}); 