// Скрипты для страницы поиска

document.addEventListener('DOMContentLoaded', function() {
    // Основные функции уже встроены в шаблон
    console.log('Страница поиска загружена');
    
    // Дополнительная функциональность
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Автоматическое применение фильтров при изменении
            if (window.applyFilters) {
                window.applyFilters();
            }
        });
    });
});