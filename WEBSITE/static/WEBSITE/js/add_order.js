// Скрипты для страницы добавления заказа

document.addEventListener('DOMContentLoaded', function() {
    // Элементы формы
    const orderForm = document.getElementById('orderForm');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const closeOrderBtn = document.getElementById('closeOrderBtn');
    const backBtn = document.querySelector('.btn-secondary');
    const deadlineInput = document.getElementById('orderDeadline');
    
    // Инициализация даты
    function initializeDate() {
        // Установка минимальной даты на завтра
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        
        if (deadlineInput) {
            deadlineInput.min = minDate;
            
            // Установка значения по умолчанию (через 3 дня)
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 3);
            deadlineInput.value = defaultDate.toISOString().split('T')[0];
        }
    }
    
    // Предпросмотр изображения
    function setupImagePreview() {
        if (imageInput) {
            imageInput.addEventListener('change', function(event) {
                const input = event.target;
                
                if (input.files && input.files[0]) {
                    // Проверка размера файла (макс. 5MB)
                    if (input.files[0].size > 5 * 1024 * 1024) {
                        alert('Файл слишком большой! Максимальный размер - 5MB.');
                        input.value = '';
                        return;
                    }
                    
                    // Проверка типа файла
                    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!validTypes.includes(input.files[0].type)) {
                        alert('Неподдерживаемый формат файла! Разрешены: JPG, PNG, GIF.');
                        input.value = '';
                        return;
                    }
                    
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                        imagePreview.style.display = 'block';
                    };
                    
                    reader.readAsDataURL(input.files[0]);
                }
            });
        }
    }
    
    // Удаление изображения
    function setupRemoveImage() {
        const removeImageBtn = document.querySelector('[onclick="removeImage()"]');
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', function() {
                imageInput.value = '';
                imagePreview.style.display = 'none';
                previewImage.src = '';
            });
        }
    }
    
    // Обработка формы
    function setupFormSubmission() {
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Сбор данных из формы
                const formData = {
                    title: document.getElementById('orderTitle').value,
                    category: document.getElementById('orderCategory').value,
                    description: document.getElementById('orderDescription').value,
                    budget: document.getElementById('orderBudget').value,
                    location: document.getElementById('orderLocation').value,
                    deadline: document.getElementById('orderDeadline').value,
                    phone: document.getElementById('orderPhone').value
                };
                
                // Валидация
                if (!formData.title || !formData.category || !formData.description || !formData.budget || !formData.location || !formData.deadline || !formData.phone) {
                    alert('Пожалуйста, заполните все обязательные поля!');
                    return;
                }
                
                if (formData.budget < 100) {
                    alert('Бюджет должен быть не менее 100 рублей');
                    return;
                }
                
                // Симуляция отправки данных
                console.log('Данные заказа:', formData);
                
                // Показать сообщение об успехе
                alert('✅ Заказ успешно опубликован!\n\nОн появится в списке после проверки модератором.');
                
                // Сохранение в localStorage для демонстрации
                saveOrderDraft(formData);
                
                // Перенаправление на главную
                setTimeout(() => {
                    window.location.href = "{% url 'index' %}";
                }, 1500);
            });
        }
    }
    
    // Закрытие заказа
    function setupCloseOrder() {
        if (closeOrderBtn) {
            closeOrderBtn.addEventListener('click', function() {
                const confirmed = confirm('Вы уверены, что хотите закрыть заказ? Это действие нельзя будет отменить.');
                
                if (confirmed) {
                    // Анимация нажатия
                    this.style.transform = 'scale(0.98)';
                    
                    // Симуляция закрытия заказа
                    console.log('Заказ закрыт');
                    
                    // Показать сообщение об успехе
                    setTimeout(() => {
                        alert('✅ Заказ успешно закрыт!');
                        
                        // Перенаправление на главную
                        setTimeout(() => {
                            window.location.href = "{% url 'index' %}";
                        }, 1000);
                    }, 500);
                    
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }
            });
        }
    }
    
    // Кнопка "Назад"
    function setupBackButton() {
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.back();
            });
        }
    }
    
    // Сохранение черновика
    function saveOrderDraft(formData) {
        const drafts = JSON.parse(localStorage.getItem('orderDrafts')) || [];
        
        drafts.push({
            ...formData,
            date: new Date().toISOString(),
            image: imageInput.files[0] ? previewImage.src : null
        });
        
        localStorage.setItem('orderDrafts', JSON.stringify(drafts));
    }
    
    // Загрузка черновика (если есть)
    function loadDraft() {
        const drafts = JSON.parse(localStorage.getItem('orderDrafts')) || [];
        if (drafts.length > 0) {
            const lastDraft = drafts[drafts.length - 1];
            
            if (confirm('У вас есть несохраненный черновик. Хотите загрузить его?')) {
                document.getElementById('orderTitle').value = lastDraft.title || '';
                document.getElementById('orderCategory').value = lastDraft.category || '';
                document.getElementById('orderDescription').value = lastDraft.description || '';
                document.getElementById('orderBudget').value = lastDraft.budget || '';
                document.getElementById('orderLocation').value = lastDraft.location || '';
                document.getElementById('orderDeadline').value = lastDraft.deadline || '';
                document.getElementById('orderPhone').value = lastDraft.phone || '';
                
                if (lastDraft.image) {
                    previewImage.src = lastDraft.image;
                    imagePreview.style.display = 'block';
                }
            }
        }
    }
    
    // Инициализация всех функций
    function init() {
        initializeDate();
        setupImagePreview();
        setupRemoveImage();
        setupFormSubmission();
        setupCloseOrder();
        setupBackButton();
        loadDraft();
        
        // Обработчик для клика по области загрузки файла
        const fileUploadArea = document.querySelector('.form-control-file');
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', function() {
                imageInput.click();
            });
        }
    }
    
    // Запуск инициализации
    init();
});