// Скрипты для страницы добавления заказа
// ВСЕ URL должны быть абсолютными путями

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
        if (deadlineInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            deadlineInput.min = tomorrow.toISOString().split('T')[0];
            
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
                    // Проверка размера файла
                    if (input.files[0].size > 5 * 1024 * 1024) {
                        alert('Файл слишком большой! Максимальный размер - 5MB.');
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
        
        const fileUploadArea = document.querySelector('.form-control-file');
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', function() {
                imageInput.click();
            });
        }
    }
    
    // Удаление изображения
    function setupRemoveImage() {
        const removeImageBtn = document.querySelector('.remove-image-btn');
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
                
                // Сбор данных
                const formData = new FormData();
                formData.append('title', document.getElementById('orderTitle').value);
                formData.append('category', document.getElementById('orderCategory').value);
                formData.append('description', document.getElementById('orderDescription').value);
                formData.append('budget', document.getElementById('orderBudget').value);
                formData.append('location', document.getElementById('orderLocation').value);
                formData.append('deadline', document.getElementById('orderDeadline').value);
                formData.append('phone', document.getElementById('orderPhone').value);
                
                // Добавляем CSRF токен
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                formData.append('csrfmiddlewaretoken', csrfToken);
                
                // Изображение
                if (imageInput.files[0]) {
                    formData.append('image', imageInput.files[0]);
                }
                
                // Валидация
                const title = formData.get('title');
                const description = formData.get('description');
                const budget = formData.get('budget');
                
                let errors = [];
                if (!title || title.length < 5) errors.push('Название должно быть не менее 5 символов');
                if (!description || description.length < 20) errors.push('Описание должно быть не менее 20 символов');
                if (!budget || parseInt(budget) < 100) errors.push('Бюджет должен быть не менее 100 рублей');
                
                if (errors.length > 0) {
                    alert('Ошибки:\n\n' + errors.join('\n'));
                    return;
                }
                
                // Показываем индикатор загрузки
                const submitBtn = orderForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Публикация...';
                submitBtn.disabled = true;
                
                // Отправка данных
                fetch('/add_order/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    // Проверяем, является ли ответ перенаправлением
                    if (response.redirected) {
                        // Если есть редирект, следуем ему
                        window.location.href = response.url;
                        return Promise.reject('redirected'); // Завершаем цепочку
                    }
                    
                    // Пробуем получить текст ответа
                    return response.text();
                })
                .then(text => {
                    // Пробуем распарсить как JSON
                    try {
                        const data = JSON.parse(text);
                        if (data && data.success) {
                            alert('✅ Заказ успешно опубликован!');
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1500);
                        } else if (data && data.errors) {
                            alert('Ошибки:\n\n' + data.errors.join('\n'));
                        }
                    } catch (e) {
                        // Если это не JSON, значит это HTML страница
                        // Это может быть страница с ошибками валидации или успешной отправкой
                        
                        // Проверяем, есть ли в ответе сообщения об ошибках (если сервер возвращает HTML с ошибками)
                        if (text.includes('alert-danger') || text.includes('error') || text.includes('Ошибка')) {
                            // Извлекаем сообщения об ошибках из HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = text;
                            
                            // Ищем элементы с ошибками
                            const errorElements = tempDiv.querySelectorAll('.alert-danger, .error, [class*="error"]');
                            let serverErrors = [];
                            
                            errorElements.forEach(el => {
                                if (el.textContent && el.textContent.trim()) {
                                    serverErrors.push(el.textContent.trim());
                                }
                            });
                            
                            if (serverErrors.length > 0) {
                                alert('Ошибки сервера:\n\n' + serverErrors.join('\n'));
                            } else {
                                alert('Произошла ошибка при отправке формы. Пожалуйста, проверьте введенные данные.');
                            }
                        } else if (text.includes('успех') || text.includes('Успешно') || text.includes('success')) {
                            // Если в HTML есть указание на успех
                            alert('✅ Заказ успешно опубликован!');
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1500);
                        } else {
                            // Если не можем определить, просто показываем общее сообщение
                            console.log('HTML ответ от сервера:', text.substring(0, 500));
                            alert('Заказ отправлен на обработку. Пожалуйста, подождите...');
                            // Обновляем страницу через 2 секунды
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        }
                    }
                })
                .catch(error => {
                    if (error !== 'redirected') {
                        console.error('Error:', error);
                        alert('Ошибка при публикации заказа. Проверьте подключение к интернету.');
                    }
                })
                .finally(() => {
                    // Восстанавливаем кнопку только если не было редиректа
                    if (submitBtn.disabled) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                });
            });
        }
    }
    
    // Кнопка "Отмена"
    if (closeOrderBtn) {
        closeOrderBtn.addEventListener('click', function() {
            if (confirm('Вы уверены? Все данные будут потеряны.')) {
                window.location.href = '/';
            }
        });
    }
    
    // Кнопка "Назад"
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Инициализация
    initializeDate();
    setupImagePreview();
    setupRemoveImage();
    setupFormSubmission();
});