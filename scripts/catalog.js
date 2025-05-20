document.addEventListener('DOMContentLoaded', function() {
  const rows = document.querySelectorAll('.shop-row');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Назначаем задержку анимации карточкам только при появлении ряда
        const cards = entry.target.querySelectorAll('.shop-card');
        cards.forEach((card, idx) => {
          const delay = idx * 0.2;
          card.style.setProperty('--delay', `${delay}s`);
          const badge = card.querySelector('.shop-badge');
          if (badge) {
            badge.style.setProperty('--badge-delay', `${delay + 0.2}s`);
          }
          // Добавляем класс visible для запуска анимации
          setTimeout(() => {
            card.classList.add('visible');
          }, delay * 1000);
        });
        // Отключаем наблюдение после того, как анимация запущена
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Запускаем анимацию, когда 20% ряда видно
    threshold: 0.2,
    // Добавляем отступ снизу, чтобы анимация начиналась чуть раньше
    rootMargin: '0px 0px -100px 0px'
  });

  // Начинаем наблюдение за каждым рядом
  rows.forEach(row => {
    observer.observe(row);
  });

  // --- Фильтрация по типу обуви ---
  const typeButtons = document.querySelectorAll('.type-btn');
  const allCards = document.querySelectorAll('.shop-card');

  const subtypeButtonsBlock = document.querySelector('.catalog-subtype-buttons');
  const subtypeOptions = {
    run: [
      { value: 'classic', label: 'Обычный бег' },
      { value: 'trail', label: 'Трейлраннинг' }
    ],
    trek: [
      { value: 'mid', label: 'Средний треккинг' },
      { value: 'light', label: 'Лёгкий треккинг' }
    ]
  };
  let currentSubtype = null;

  function renderSubtypeButtons(type) {
    subtypeButtonsBlock.innerHTML = '';
    if (subtypeOptions[type]) {
      subtypeButtonsBlock.style.display = 'flex';
      subtypeOptions[type].forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'subtype-btn' + (idx === 0 ? ' active' : '');
        btn.dataset.subtype = opt.value;
        btn.textContent = opt.label;
        btn.addEventListener('click', function() {
          document.querySelectorAll('.subtype-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSubtype = opt.value;
          filterCards();
        });
        subtypeButtonsBlock.appendChild(btn);
      });
      currentSubtype = subtypeOptions[type][0].value;
      // Анимация появления кнопок подтипов
      animateSubtypeButtons();
    } else {
      subtypeButtonsBlock.style.display = 'none';
      currentSubtype = null;
    }
  }

  function animateSubtypeButtons() {
    const buttons = document.querySelectorAll('.subtype-btn');
    buttons.forEach((btn, idx) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      setTimeout(() => {
        btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }, idx * 100);
    });
  }

  function filterCards() {
    const typeBtn = document.querySelector('.type-btn.active');
    const type = typeBtn ? typeBtn.dataset.type : 'all';
    
    // Сначала скрываем все карточки с анимацией
    allCards.forEach(card => {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
    });

    // После небольшой задержки показываем нужные карточки
    setTimeout(() => {
      allCards.forEach(card => {
        let show = true;
        if (type !== 'all' && card.dataset.type !== type) show = false;
        if (type !== 'all' && currentSubtype && card.dataset.subtype !== currentSubtype) show = false;
        
        if (show) {
          card.style.display = '';
          // Запускаем анимацию появления
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    }, 300);
  }

  // Модифицируем обработчик кнопок типа
  typeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      renderSubtypeButtons(type);
      filterCards();
    });
  });

  // Инициализация при загрузке
  renderSubtypeButtons('all');
  filterCards();

  // --- Открытие/закрытие фильтров ---
  const filtersToggle = document.querySelector('.filters-toggle');
  const filtersBlock = document.querySelector('.catalog-filters');
  
  if (filtersToggle && filtersBlock) {
    filtersToggle.addEventListener('click', () => {
      filtersBlock.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!filtersBlock.contains(e.target) && filtersBlock.classList.contains('open')) {
        filtersBlock.classList.remove('open');
      }
    });
  }

  // --- Фильтрация по параметрам ---
  const filtersForm = document.querySelector('.filters-dropdown');
  if (filtersForm) {
    filtersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const brand = filtersForm.brand.value;
      const size = filtersForm.size.value;
      const price = filtersForm.price.value;

      // Сначала скрываем все карточки с анимацией
      allCards.forEach(card => {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      });

      // После небольшой задержки показываем нужные карточки
      setTimeout(() => {
        allCards.forEach(card => {
          let show = true;
          const typeBtn = document.querySelector('.type-btn.active');
          const type = typeBtn ? typeBtn.dataset.type : 'all';
          
          if (type !== 'all' && card.dataset.type !== type) show = false;
          if (type !== 'all' && currentSubtype && card.dataset.subtype !== currentSubtype) show = false;
          if (brand && card.dataset.brand !== brand) show = false;
          if (size && !(card.dataset.sizes && card.dataset.sizes.split(',').includes(size))) show = false;
          if (price && Number(card.dataset.price) > Number(price)) show = false;
          
          if (show) {
            card.style.display = '';
            // Запускаем анимацию появления
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      }, 300);

      filtersBlock.classList.remove('open');
    });
  }

  // --- Анимация появления элементов управления ---
  function animateControls() {
    // Анимация кнопок типа
    document.querySelectorAll('.type-btn').forEach((btn, idx) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      setTimeout(() => {
        btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }, idx * 100);
    });

    // Анимация кнопки фильтров
    const filtersToggle = document.querySelector('.filters-toggle');
    if (filtersToggle) {
      filtersToggle.style.opacity = '0';
      filtersToggle.style.transform = 'translateY(20px)';
      setTimeout(() => {
        filtersToggle.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        filtersToggle.style.opacity = '1';
        filtersToggle.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  // Запускаем анимацию элементов управления
  animateControls();
}); 