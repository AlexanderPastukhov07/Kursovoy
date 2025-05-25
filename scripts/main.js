// Плавное появление секций при прокрутке
function revealOnScroll() {
  const reveals = document.querySelectorAll('.brands-list, .why-item');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Загрузка брендов из XML
async function loadBrands() {
  try {
    const response = await fetch('data/brands.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const brands = xml.querySelectorAll('brand');
    const brandsList = document.getElementById('brands-list');
    brands.forEach((brand, i) => {
      const logo = brand.querySelector('logo').textContent;
      const alt = brand.querySelector('alt').textContent;
      const div = document.createElement('div');
      div.className = 'brand-logo';
      div.style.opacity = 0;
      const img = document.createElement('img');
      img.src = logo;
      img.alt = alt;
      img.loading = 'lazy';
      div.appendChild(img);
      brandsList.appendChild(div);
      // Анимация появления логотипа
      setTimeout(() => {
        div.style.transition = 'opacity 0.7s cubic-bezier(.77,0,.18,1)';
        div.style.opacity = 1;
      }, 200 + i * 120);
    });
    // После загрузки делаем список видимым
    setTimeout(() => brandsList.classList.add('visible'), 400);
  } catch (e) {
    console.error('Ошибка загрузки брендов:', e);
  }
}
window.addEventListener('DOMContentLoaded', loadBrands);

// Анимация SVG-иконок why-us при наведении
const icons = document.querySelectorAll('.why-item .icon');
icons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transform = 'scale(1.15) rotate(-6deg)';
    icon.style.transition = 'transform 0.4s';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = '';
  });
});

// Анимация контактов: плавное появление email при клике на соц. иконку
const socials = document.querySelectorAll('.socials img');
socials.forEach(icon => {
  icon.addEventListener('click', () => {
    const email = document.querySelector('.contacts a[href^="mailto"]');
    if (email) {
      email.style.transition = 'color 0.5s, background 0.5s';
      email.style.color = '#1a2a4a';
      email.style.background = '#eaf1ff';
      setTimeout(() => {
        email.style.color = '';
        email.style.background = '';
      }, 1200);
    }
  });
});

// Загрузка каталога обуви из XML
async function loadCatalog() {
  const catalogList = document.getElementById('catalog-list');
  if (!catalogList) return;
  try {
    const response = await fetch('data/catalog.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const items = xml.querySelectorAll('item');
    items.forEach((item, i) => {
      const name = item.querySelector('name').textContent;
      const image = item.querySelector('image').textContent;
      const label = item.querySelector('label').textContent;
      const card = document.createElement('div');
      card.className = 'catalog-card';
      // Метка
      if (label) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'catalog-card__label';
        if (label === 'new') labelDiv.classList.add('catalog-card__label--new');
        if (label === 'hot') labelDiv.classList.add('catalog-card__label--hot');
        if (label === 'sale') labelDiv.classList.add('catalog-card__label--sale');
        labelDiv.textContent = label === 'new' ? 'NEW' : label === 'hot' ? 'HOT' : label === 'sale' ? '-30%' : label;
        card.appendChild(labelDiv);
      }
      // Картинка
      const img = document.createElement('img');
      img.src = image;
      img.alt = name;
      img.loading = 'lazy';
      card.appendChild(img);
      // Название
      const nameDiv = document.createElement('div');
      nameDiv.className = 'catalog-card__name';
      nameDiv.textContent = name;
      card.appendChild(nameDiv);
      // Переход на страницу пары обуви для модели №5
      if (name === 'Модель №5') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          window.location.href = 'shoe.html';
        });
      }
      // Анимация появления
      card.style.opacity = 0;
      setTimeout(() => {
        card.style.transition = 'opacity 0.7s cubic-bezier(.77,0,.18,1)';
        card.style.opacity = 1;
      }, 200 + i * 100);
      catalogList.appendChild(card);
    });
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
}
window.addEventListener('DOMContentLoaded', loadCatalog);

// --- Страница товара: выбор размера и заказ ---
window.addEventListener('DOMContentLoaded', () => {
  const sizeBtns = document.querySelectorAll('.size-btn');
  const orderBtn = document.querySelector('.order-btn');
  const modal = document.getElementById('order-modal');
  const closeModal = document.getElementById('close-modal');
  const orderForm = document.getElementById('order-form');
  const orderSize = document.getElementById('order-size');
  let selectedSize = null;

  if (sizeBtns.length && orderBtn) {
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSize = btn.textContent;
        orderBtn.disabled = false;
      });
    });
    orderBtn.addEventListener('click', () => {
      if (!selectedSize) return;
      orderSize.value = selectedSize;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Здесь можно добавить отправку формы на сервер или показать сообщение об успехе
      alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      orderForm.reset();
      sizeBtns.forEach(b => b.classList.remove('selected'));
      orderBtn.disabled = true;
      selectedSize = null;
    });
  }
});

// Активация анимации SVG при появлении в зоне видимости
function activateSvgOnScroll() {
  const svgs = document.querySelectorAll('.my-animated-svg');
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  svgs.forEach(svg => {
    const rect = svg.getBoundingClientRect();
    if (rect.top < windowHeight && rect.bottom > 0) {
      svg.classList.add('active');
    }
  });
}
window.addEventListener('scroll', activateSvgOnScroll);
window.addEventListener('DOMContentLoaded', activateSvgOnScroll);

document.addEventListener('DOMContentLoaded', function() {
  const fadeEls = Array.from(document.querySelectorAll('.fade-in'));
  console.log('Найдено элементов для анимации:', fadeEls.length);
  let appeared = 0;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Элемент появился в зоне видимости:', entry.target);
        const elIndex = fadeEls.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('fade-in--visible');
          console.log('Добавлен класс fade-in--visible к элементу:', entry.target);
        }, elIndex * 120);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  fadeEls.forEach(el => {
    console.log('Наблюдаем за элементом:', el);
    observer.observe(el);
  });
}); 