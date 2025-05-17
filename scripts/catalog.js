document.addEventListener('DOMContentLoaded', function() {
  const rows = document.querySelectorAll('.shop-row');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Назначаем задержку анимации карточкам только при появлении ряда
        const cards = entry.target.querySelectorAll('.shop-card');
        cards.forEach((card, idx) => {
          const delay = idx * 0.4;
          card.style.setProperty('--delay', `${delay}s`);
          const badge = card.querySelector('.shop-badge');
          if (badge) {
            badge.style.setProperty('--badge-delay', `${delay + 0.2}s`);
          }
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
      // --- Анимация для subtype-btn ---
      setTimeout(() => {
        document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
          btn.style.opacity = '0';
          btn.style.transform = 'translateY(30px)';
          btn.style.transition = '';
        });
        setTimeout(() => {
          document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
            setTimeout(() => {
              btn.style.transition = 'opacity 0.7s cubic-bezier(0.47,0,0.745,0.715), transform 0.7s cubic-bezier(0.47,0,0.745,0.715)';
              btn.style.opacity = '1';
              btn.style.transform = 'translateY(0)';
            }, idx * 120);
          });
        }, 100);
      }, 50);
    } else {
      subtypeButtonsBlock.style.display = 'none';
      currentSubtype = null;
    }
  }

  function filterCards() {
    const typeBtn = document.querySelector('.type-btn.active');
    const type = typeBtn ? typeBtn.dataset.type : 'all';
    allCards.forEach(card => {
      let show = true;
      if (type !== 'all' && card.dataset.type !== type) show = false;
      if (type !== 'all' && currentSubtype && card.dataset.subtype !== currentSubtype) show = false;
      if (show) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Модифицируем обработчик кнопок типа
  typeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      renderSubtypeButtons(type);
      filterCards();
      // --- Анимация для subtype-btn при смене типа ---
      setTimeout(() => {
        document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
          btn.style.opacity = '0';
          btn.style.transform = 'translateY(30px)';
          btn.style.transition = '';
        });
        setTimeout(() => {
          document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
            setTimeout(() => {
              btn.style.transition = 'opacity 0.7s cubic-bezier(0.47,0,0.745,0.715), transform 0.7s cubic-bezier(0.47,0,0.745,0.715)';
              btn.style.opacity = '1';
              btn.style.transform = 'translateY(0)';
            }, idx * 120);
          });
        }, 100);
      }, 50);
    });
  });

  // Инициализация при загрузке
  renderSubtypeButtons('all');
  filterCards();

  // --- Открытие/закрытие фильтров ---
  const filtersToggle = document.querySelector('.filters-toggle');
  const filtersBlock = document.querySelector('.catalog-filters');
  filtersToggle.addEventListener('click', () => {
    filtersBlock.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!filtersBlock.contains(e.target) && filtersBlock.classList.contains('open')) {
      filtersBlock.classList.remove('open');
    }
  });

  // --- Фильтрация по параметрам ---
  const filtersForm = document.querySelector('.filters-dropdown');
  filtersForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const brand = filtersForm.brand.value;
    const size = filtersForm.size.value;
    const price = filtersForm.price.value;
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
      } else {
        card.style.display = 'none';
      }
    });
    filtersBlock.classList.remove('open');
  });

  // --- Анимация появления кнопок выбора типа и фильтров ---
  function animateControls() {
    // type-btn
    document.querySelectorAll('.type-btn').forEach((btn, idx) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(30px)';
      btn.style.transition = '';
    });
    // filters-toggle
    const filtersToggle = document.querySelector('.filters-toggle');
    if (filtersToggle) {
      filtersToggle.style.opacity = '0';
      filtersToggle.style.transform = 'translateY(30px)';
      filtersToggle.style.transition = '';
    }
    // subtype-btn
    document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(30px)';
      btn.style.transition = '';
    });
    setTimeout(() => {
      // type-btn
      document.querySelectorAll('.type-btn').forEach((btn, idx) => {
        setTimeout(() => {
          btn.style.transition = 'opacity 0.7s cubic-bezier(0.47,0,0.745,0.715), transform 0.7s cubic-bezier(0.47,0,0.745,0.715)';
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
        }, idx * 120);
      });
      // filters-toggle
      if (filtersToggle) {
        setTimeout(() => {
          filtersToggle.style.transition = 'opacity 0.7s cubic-bezier(0.47,0,0.745,0.715), transform 0.7s cubic-bezier(0.47,0,0.745,0.715)';
          filtersToggle.style.opacity = '1';
          filtersToggle.style.transform = 'translateY(0)';
        }, 400);
      }
      // subtype-btn
      document.querySelectorAll('.subtype-btn').forEach((btn, idx) => {
        setTimeout(() => {
          btn.style.transition = 'opacity 0.7s cubic-bezier(0.47,0,0.745,0.715), transform 0.7s cubic-bezier(0.47,0,0.745,0.715)';
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
        }, 600 + idx * 120);
      });
    }, 100);
  }
  animateControls();
}); 