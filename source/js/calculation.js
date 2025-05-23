document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.custom-range__track');
  const progress = document.querySelector('.custom-range__progress');
  const thumb = document.querySelector('.custom-range__thumb');
  const monthSpans = document.querySelectorAll('.calculation-section__months span');

  const resultSpan = document.getElementById('result');

  const steps = 8;
  const stepValues = [3, 6, 9, 12, 15, 18, 21, 24];  // Месяцы
  const populationData = {
    '500000': 218000,
    '1000000': 264000,
    '1000001': 311000
  };

  let selectedPopulation = '1000001'; // Значение по умолчанию: от 1 млн жителей
  let currentStep = stepValues.indexOf(15); // Значение по умолчанию: 15 месяцев

  // ==== ФУНКЦИИ ====
  function updateThumbPosition(stepIndex) {
    const percent = (stepIndex / (steps - 1)) * 100;
    progress.style.width = `${percent}%`;
    thumb.style.left = `${percent}%`;
  }

  function setActiveMonth(index) {
    monthSpans.forEach((span, i) => {
      span.classList.toggle('active', i === index);
    });
  }

  function calculateResult() {
    if (selectedPopulation && currentStep >= 0) {
      const baseValue = populationData[selectedPopulation];
      const months = stepValues[currentStep];
      const result = baseValue * months;
      resultSpan.textContent = result.toLocaleString();
    }
  }

  // ==== ОБРАБОТЧИКИ ДЛЯ КАРТОЧЕК ====
  const populationCards = document.querySelectorAll('.calculation-section__card');

  populationCards.forEach(card => {
    card.addEventListener('click', () => {
      // Получаем значение населения из атрибута data-value
      selectedPopulation = card.getAttribute('data-value');
      populationCards.forEach(card => card.classList.remove('active-card')); // Убираем активный класс у других карточек
      card.classList.add('active-card'); // Добавляем активный класс для выбранной карточки
      calculateResult(); // Пересчитываем результат
    });
  });

  // ==== ПЕРЕМЕЩЕНИЕ БЕГУНКА И ПОДСВЕТКА МЕСЯЦЕВ ====
  monthSpans.forEach((span, index) => {
    span.addEventListener('click', () => {
      currentStep = index;
      updateThumbPosition(index);
      setActiveMonth(index);
      calculateResult();
    });
  });

  // ==== ПЕРЕТАСКИВАНИЕ БЕГУНКА ====
  let isDragging = false;

  thumb.addEventListener('mousedown', () => {
    isDragging = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const trackRect = track.getBoundingClientRect();
      let position = e.clientX - trackRect.left;
      position = Math.max(0, Math.min(position, trackRect.width));

      const percent = (position / trackRect.width) * 100;

      const closestStep = stepValues.reduce((prev, _, index) => {
        const stepPercent = (index / (steps - 1)) * 100;
        return Math.abs(stepPercent - percent) < Math.abs((prev / (steps - 1)) * 100 - percent)
          ? index
          : prev;
      }, 0);

      currentStep = closestStep;
      updateThumbPosition(closestStep);
      setActiveMonth(closestStep);
      calculateResult();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });

  track.addEventListener('click', (e) => {
    const trackRect = track.getBoundingClientRect();
    let position = e.clientX - trackRect.left;
    position = Math.max(0, Math.min(position, trackRect.width));

    const percent = (position / trackRect.width) * 100;

    const closestStep = stepValues.reduce((prev, _, index) => {
      const stepPercent = (index / (steps - 1)) * 100;
      return Math.abs(stepPercent - percent) < Math.abs((prev / (steps - 1)) * 100 - percent)
        ? index
        : prev;
    }, 0);

    currentStep = closestStep;
    updateThumbPosition(closestStep);
    setActiveMonth(closestStep);
    calculateResult();
  });

  // ==== УСТАНОВКА ЗНАЧЕНИЙ ПО УМОЛЧАНИЮ ====
  function setDefaults() {
    const defaultCard = populationCards[2]; // По умолчанию выбираем карточку с от 1 млн жителей
    selectedPopulation = defaultCard.getAttribute('data-value');
    defaultCard.classList.add('active'); // Добавляем активный класс на карточку

    currentStep = stepValues.indexOf(15); // Начальное значение: 15 месяцев
    updateThumbPosition(currentStep);
    setActiveMonth(currentStep);

    calculateResult();
  }

  setDefaults();
});
