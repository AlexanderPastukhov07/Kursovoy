document.addEventListener('DOMContentLoaded', async function() {
  const shoeCard = document.querySelector('.shoe-card');
  if (!shoeCard) return;

  // Получаем название модели из заголовка
  const modelName = document.querySelector('.shoe-card__info h2').textContent;

  try {
    // Загружаем XML файл
    const response = await fetch('data/catalog.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Находим нужную модель в XML
    const items = xmlDoc.getElementsByTagName('item');
    let currentModel = null;
    
    for (let item of items) {
      const name = item.getElementsByTagName('name')[0].textContent;
      if (name === modelName) {
        currentModel = item;
        break;
      }
    }

    if (!currentModel) {
      console.error('Модель не найдена в каталоге');
      return;
    }

    // Получаем доступные размеры из XML
    const availableSizes = currentModel.getElementsByTagName('sizes')[0].textContent.split(',').map(size => parseInt(size));
    
    // Обновляем атрибут data-sizes
    shoeCard.dataset.sizes = availableSizes.join(',');

    // Обновляем состояние кнопок размеров
    const sizeButtons = document.querySelectorAll('.size-btn');
    const orderBtn = document.querySelector('.order-btn');
    const modal = document.getElementById('order-modal');
    const closeModal = document.getElementById('close-modal');

    // Сначала делаем все кнопки неактивными
    sizeButtons.forEach(button => {
      button.classList.add('disabled');
      button.disabled = true;
    });

    // Затем активируем только доступные размеры
    sizeButtons.forEach(button => {
      const size = parseInt(button.textContent);
      if (availableSizes.includes(size)) {
        button.classList.remove('disabled');
        button.disabled = false;
        
        button.addEventListener('click', function() {
          // Убираем активный класс у всех кнопок
          sizeButtons.forEach(btn => btn.classList.remove('active'));
          // Добавляем активный класс нажатой кнопке
          this.classList.add('active');
          // Активируем кнопку заказа
          orderBtn.disabled = false;
          // Сохраняем выбранный размер
          document.getElementById('order-size').value = size;
        });
      }
    });

    // Обработка формы заказа
    const orderForm = document.getElementById('order-form');

    orderBtn.addEventListener('click', function() {
      modal.classList.add('active');
    });

    closeModal.addEventListener('click', function() {
      modal.classList.remove('active');
    });

    // Закрытие модального окна при клике вне его
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Здесь можно добавить логику отправки заказа
      alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
      modal.classList.remove('active');
      orderForm.reset();
      sizeButtons.forEach(btn => btn.classList.remove('active'));
      orderBtn.disabled = true;
    });

  } catch (error) {
    console.error('Ошибка при загрузке каталога:', error);
  }
}); 