// Скрипты для главной страницы

document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопки "Добавить заказ"
    const addOrderBtn = document.getElementById('addOrderBtn');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', function() {
            window.location.href = addOrderUrl; // URL будет задан в шаблоне
        });
    }

    // Обработчики для кнопок "Подробнее" на карточках заказов
    document.querySelectorAll('.order-button').forEach(button => {
        if (!button.id) { // Если это не кнопка "Добавить заказ"
            button.addEventListener('click', function() {
                window.location.href = orderDetailUrl; // URL будет задан в шаблоне
            });
        }
    });
});