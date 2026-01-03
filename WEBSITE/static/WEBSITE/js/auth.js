// Скрипты для страницы входа

document.addEventListener('DOMContentLoaded', function() {
    // Переключение видимости пароля
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        const passwordInput = document.getElementById('loginPassword');
        togglePassword.addEventListener('click', function() {
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

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Валидация
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }
            
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            // Симуляция отправки данных на сервер
            console.log('Попытка входа:', { email, password });
            
            // Показать сообщение об успехе
            alert('Вход выполнен успешно! Перенаправляем в личный кабинет...');
            
            // Перенаправление на страницу личного кабинета
            setTimeout(() => {
                window.location.href = personalAccountUrl;
            }, 1500);
        });
    }

    // Проверка сохраненных данных при загрузке страницы
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        document.getElementById('loginEmail').value = savedEmail;
    }
});