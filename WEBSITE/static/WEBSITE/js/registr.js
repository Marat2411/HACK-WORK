// Скрипты для страницы регистрации

document.addEventListener('DOMContentLoaded', function() {
    // Настройка переключателей видимости паролей
    function setupPasswordToggle(toggleId, inputId) {
        const toggleBtn = document.getElementById(toggleId);
        const passwordInput = document.getElementById(inputId);
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    }

    // Настройка обоих полей пароля
    setupPasswordToggle('togglePassword1', 'registerPassword');
    setupPasswordToggle('togglePassword2', 'registerConfirmPassword');

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных из формы
            const formData = {
                firstName: document.getElementById('registerFirstName').value.trim(),
                lastName: document.getElementById('registerLastName').value.trim(),
                email: document.getElementById('registerEmail').value.trim(),
                phone: document.getElementById('registerPhone').value.trim(),
                password: document.getElementById('registerPassword').value,
                confirmPassword: document.getElementById('registerConfirmPassword').value,
                city: document.getElementById('registerCity').value.trim(),
                agreement: document.getElementById('registerAgreement').checked
            };
            
            // Валидация
            let errors = [];
            
            if (!formData.firstName || !formData.lastName) {
                errors.push('Введите имя и фамилию');
            }
            
            if (!formData.email || !formData.email.includes('@')) {
                errors.push('Введите корректный email');
            }
            
            if (!formData.phone || formData.phone.length < 10) {
                errors.push('Введите корректный номер телефона');
            }
            
            if (!formData.password || formData.password.length < 6) {
                errors.push('Пароль должен содержать минимум 6 символов');
            }
            
            if (formData.password !== formData.confirmPassword) {
                errors.push('Пароли не совпадают');
            }
            
            if (!formData.city) {
                errors.push('Введите ваш город');
            }
            
            if (!formData.agreement) {
                errors.push('Необходимо согласиться с условиями использования');
            }
            
            // Если есть ошибки, показываем их
            if (errors.length > 0) {
                alert('Ошибки при заполнении формы:\n\n' + errors.join('\n'));
                return;
            }
            
            // Симуляция отправки данных на сервер
            console.log('Регистрация пользователя:', {
                ...formData,
                password: '***' // Не логируем реальный пароль
            });
            
            // Показать сообщение об успехе
            alert('Регистрация успешно завершена!\n\nНа вашу почту отправлено письмо с подтверждением.\n\nПеренаправляем в личный кабинет...');
            
            // Сохраняем данные в localStorage для демонстрации
            localStorage.setItem('userFirstName', formData.firstName);
            localStorage.setItem('userLastName', formData.lastName);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userCity', formData.city);
            
            // Перенаправление на страницу личного кабинета
            setTimeout(() => {
                window.location.href = personalAccountUrl;
            }, 2000);
        });
    }

    // Автозаполнение города
    const savedCity = localStorage.getItem('userCity');
    if (savedCity) {
        document.getElementById('registerCity').value = savedCity;
    }
});