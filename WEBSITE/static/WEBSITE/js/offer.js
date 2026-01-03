
// Скрипты для страницы договора оферты

document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка к якорям
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Получаем высоту фиксированной шапки
                    const headerHeight = document.getElementById('mainHeader').offsetHeight;
                    
                    // Прокручиваем к элементу с учетом высоты шапки
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Добавляем активный класс к нажатой ссылке
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Подсветка активного раздела при прокрутке
    const sections = document.querySelectorAll('.legal-section');
    
    function highlightCurrentSection() {
        const scrollPosition = window.scrollY + 100;
        const headerHeight = document.getElementById('mainHeader').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = '#' + section.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Инициализация при загрузке
    highlightCurrentSection();
    
    // Обработчик прокрутки
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Интерактивность для элементов определений
    const definitionItems = document.querySelectorAll('.definition-item');
    
    definitionItems.forEach(item => {
        item.addEventListener('click', function() {
            definitionItems.forEach(i => {
                i.style.transform = 'scale(1)';
                i.style.boxShadow = 'none';
            });
            
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Интерактивность для шагов процесса
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 8px 25px rgba(255, 169, 77, 0.3)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Подсветка строк таблицы
    const tableRows = document.querySelectorAll('.commission-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 169, 77, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // Клик по строке таблицы
        row.addEventListener('click', function() {
            const commission = this.cells[1].textContent;
            const amountRange = this.cells[0].textContent;
            
            showCommissionInfo(amountRange, commission);
        });
    });
    
    // Показать информацию о комиссии
    function showCommissionInfo(amountRange, commission) {
        const infoBox = document.createElement('div');
        infoBox.className = 'commission-info';
        infoBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #333;">Комиссия платформы</h4>
                <button class="close-btn" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #FF8C00;">×</button>
            </div>
            <p style="margin: 0 0 10px 0; color: #555;">Для заказов ${amountRange}</p>
            <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #FF8C00;">Комиссия: ${commission}</p>
        `;
        
        infoBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 300px;
            width: 90%;
        `;
        
        document.body.appendChild(infoBox);
        
        // Кнопка закрытия
        const closeBtn = infoBox.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(infoBox);
        });
        
        // Закрытие по клику вне окна
        infoBox.addEventListener('click', function(e) {
            if (e.target === infoBox) {
                document.body.removeChild(infoBox);
            }
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (document.body.contains(infoBox)) {
                document.body.removeChild(infoBox);
            }
        }, 5000);
    }
    
    // Копирование реквизитов компании
    const companyDetails = document.querySelector('.company-details');
    
    if (companyDetails) {
        companyDetails.addEventListener('click', function(e) {
            if (e.target.tagName === 'P') {
                const textToCopy = e.target.textContent.trim();
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showCopyNotification(e.target, 'Реквизиты скопированы!');
                    })
                    .catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
            }
        });
        
        // Добавляем курсор-указатель
        companyDetails.style.cursor = 'pointer';
    }
    
    // Показать уведомление о копировании
    function showCopyNotification(element, message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFD166, #FFA94D);
            color: #333333;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav-links a.active {
            color: #FF8C00 !important;
            background-color: rgba(255, 169, 77, 0.15) !important;
            border-left-color: #FFA94D !important;
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
    
    // Кнопка печати
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Распечатать';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #7ED957, #A8E6CF);
        color: #2E7D32;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    `;
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printBtn);
    
    // Стили для печати
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .legal-navigation,
            .header,
            .footer,
            .print-btn {
                display: none !important;
            }
            
            .legal-content {
                grid-template-columns: 1fr !important;
            }
            
            body {
                font-size: 12pt !important;
                line-height: 1.5 !important;
            }
            
            h1, h2, h3 {
                page-break-after: avoid !important;
            }
            
            .legal-section {
                page-break-inside: avoid !important;
            }
            
            .process-diagram {
                display: none !important;
            }
            
            .commission-table {
                font-size: 10pt !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
});