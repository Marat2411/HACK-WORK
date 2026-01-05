document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопки "Добавить заказ"
    const addOrderBtn = document.getElementById('addOrderBtn');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', function() {
            window.location.href = '/add_order/'; // Используем прямой URL
        });
    }

    // Обработчики для кнопок "Подробнее" на карточках заказов
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            if (orderId) {
                window.location.href = '/order/' + orderId + '/';
            }
        });
    });
});