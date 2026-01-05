// Скрипты для страницы деталей заказа

document.addEventListener('DOMContentLoaded', function() {
    // Элементы страницы
    const respondBtn = document.getElementById('respondBtn');
    const copyContactsBtn = document.getElementById('copyContactsBtn');
    const backBtn = document.querySelector('.btn-back');
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Обработка отклика на заказ
    if (respondBtn) {
        respondBtn.addEventListener('click', function() {
            // Запрашиваем данные у исполнителя
            const userName = prompt('Введите ваше имя:', '');
            if (!userName) {
                alert('Отмена: необходимо указать имя для отклика');
                return;
            }
            
            const userPhone = prompt('Введите ваш телефон для связи:', '');
            if (!userPhone) {
                alert('Отмена: необходимо указать телефон для связи');
                return;
            }
            
            // Симуляция отправки отклика
            alert(`Отлично, ${userName}! Ваш отклик отправлен заказчику.\n\nЗаказчик получит ваши контакты:\nТелефон: ${userPhone}\n\nОжидайте связи в ближайшее время.`);
            
            // Визуальная обратная связь
            this.innerHTML = '<i class="fas fa-check"></i> Отклик отправлен';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
            this.style.color = '#FFFFFF';
            this.disabled = true;
            
            console.log('Отклик на заказ отправлен', { userName, userPhone });
            
            // Сохраняем в localStorage для истории
            saveOrderResponse(userName, userPhone);
        });
    }
    
    // Копирование контактов
    if (copyContactsBtn) {
        copyContactsBtn.addEventListener('click', function() {
            const phone = '+7 (999) 123-45-67';
            const telegram = '@ivan_ivanov';
            const name = 'Иван Иванов';
            
            const contactsText = `Контакты заказчика:\nТелефон: ${phone}\nTelegram: ${telegram}\nИмя: ${name}`;
            
            // Используем Clipboard API
            navigator.clipboard.writeText(contactsText)
                .then(() => {
                    showCopySuccess(this);
                })
                .catch(err => {
                    console.error('Ошибка копирования: ', err);
                    // Fallback для старых браузеров
                    copyToClipboardFallback(contactsText, this);
                });
        });
    }
    
    // Быстрые действия по контактам
    if (contactItems.length > 0) {
        contactItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.tagName === 'A') return; // Если это ссылка, не перехватываем
                
                const text = this.querySelector('span').textContent;
                const icon = this.querySelector('i').className;
                
                if (icon.includes('fa-phone')) {
                    window.location.href = `tel:${text.replace(/\D/g, '')}`;
                } else if (icon.includes('fa-envelope')) {
                    window.location.href = `mailto:${text}`;
                } else if (icon.includes('fa-telegram')) {
                    window.open(`https://t.me/${text.replace('@', '')}`, '_blank');
                }
            });
        });
    }
    
    // Кнопка "Назад"
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Загрузка данных заказа
    function loadOrderData() {
        // В реальном приложении здесь бы загружались данные заказа по ID из URL
        const orderData = JSON.parse(localStorage.getItem('currentOrder')) || {
            title: 'Ремонт ноутбука ASUS',
            price: '3 500 ₽',
            category: 'Ремонт техники',
            location: 'Москва, Центральный район',
            deadline: 'До 20 декабря 2023',
            date: 'Сегодня, 10:30'
        };
        
        // Обновляем данные на странице
        const elements = {
            '.order-title-large': orderData.title,
            '.order-price-large': orderData.price,
            '.meta-content p:nth-child(1)': orderData.category,
            '.meta-content p:nth-child(2)': orderData.location,
            '.meta-content p:nth-child(3)': orderData.deadline,
            '.meta-content p:nth-child(4)': orderData.date
        };
        
        Object.keys(elements).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = elements[selector];
            }
        });
        
        // Проверяем, был ли уже отклик на этот заказ
        checkIfAlreadyResponded();
    }
    
    // Сохранение отклика в localStorage
    function saveOrderResponse(userName, userPhone) {
        const responses = JSON.parse(localStorage.getItem('orderResponses')) || [];
        const currentOrderId = 'repair-laptop-asus-001';
        
        responses.push({
            orderId: currentOrderId,
            orderTitle: 'Ремонт ноутбука ASUS',
            userName: userName,
            userPhone: userPhone,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('orderResponses', JSON.stringify(responses));
    }
    
    // Проверка, был ли уже отклик
    function checkIfAlreadyResponded() {
        const responses = JSON.parse(localStorage.getItem('orderResponses')) || [];
        const currentOrderId = 'repair-laptop-asus-001';
        const hasResponded = responses.some(response => response.orderId === currentOrderId);
        
        if (hasResponded && respondBtn) {
            respondBtn.innerHTML = '<i class="fas fa-check"></i> Вы уже откликнулись';
            respondBtn.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
            respondBtn.style.color = '#FFFFFF';
            respondBtn.disabled = true;
        }
    }
    
    // Показать успешное копирование
    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Контакты скопированы';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
        button.style.color = '#FFFFFF';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
        
        console.log('Контакты скопированы в буфер обмена');
    }
    
    // Fallback для копирования в буфер обмена
    function copyToClipboardFallback(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Контакты скопированы в буфер обмена!');
        
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Контакты скопированы';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }
    
    // Инициализация страницы
    loadOrderData();
});