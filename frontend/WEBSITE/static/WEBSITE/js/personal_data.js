
// Скрипты для страницы обработки персональных данных

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
    
    // Взаимодействие с элементами сетки целей
    const purposeItems = document.querySelectorAll('.purpose-item');
    
    purposeItems.forEach(item => {
        item.addEventListener('click', function() {
            purposeItems.forEach(i => i.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.02)';
        });
    });
    
    // Копирование реквизитов
    const contactInfo = document.querySelector('.legal-footer');
    
    if (contactInfo) {
        contactInfo.addEventListener('click', function(e) {
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
        contactInfo.style.cursor = 'pointer';
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
            
            .purpose-grid {
                display: block !important;
            }
            
            .purpose-item {
                page-break-inside: avoid !important;
                margin-bottom: 20px !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
});