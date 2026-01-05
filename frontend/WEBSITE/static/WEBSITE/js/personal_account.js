// Скрипты для личного кабинета

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    const avatarInput = document.getElementById('avatarInput');
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    const profileForm = document.getElementById('profileForm');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const profileMenuItems = document.querySelectorAll('.profile-menu-item');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const balanceOptionBtns = document.querySelectorAll('.balance-option-btn');
    const customAmountInput = document.getElementById('customAmount');
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    const addOrderSidebarBtn = document.getElementById('addOrderSidebarBtn');
    
    // === Управление загрузкой аватара ===
    if (avatarUploadBtn) {
        avatarUploadBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
    
    function handleAvatarUpload(event) {
        const input = event.target;
        const previewImage = document.getElementById('previewImage');
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Обновляем превью
                if (previewImage) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                
                // Обновляем аватар в сайдбаре
                if (sidebarAvatar) {
                    sidebarAvatar.innerHTML = '';
                    const sidebarImg = document.createElement('img');
                    sidebarImg.src = e.target.result;
                    sidebarImg.alt = 'Аватар';
                    sidebarImg.style.width = '100%';
                    sidebarImg.style.height = '100%';
                    sidebarImg.style.borderRadius = '50%';
                    sidebarImg.style.objectFit = 'cover';
                    sidebarAvatar.appendChild(sidebarImg);
                }
                
                // Сохраняем в localStorage для демонстрации
                localStorage.setItem('profileAvatar', e.target.result);
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    // Загрузка аватара из localStorage при загрузке страницы
    function loadSavedAvatar() {
        const savedAvatar = localStorage.getItem('profileAvatar');
        const previewImage = document.getElementById('previewImage');
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        
        if (savedAvatar) {
            if (previewImage) {
                previewImage.src = savedAvatar;
                previewImage.style.display = 'block';
            }
            
            if (sidebarAvatar) {
                sidebarAvatar.innerHTML = '';
                const sidebarImg = document.createElement('img');
                sidebarImg.src = savedAvatar;
                sidebarImg.alt = 'Аватар';
                sidebarImg.style.width = '100%';
                sidebarImg.style.height = '100%';
                sidebarImg.style.borderRadius = '50%';
                sidebarImg.style.objectFit = 'cover';
                sidebarAvatar.appendChild(sidebarImg);
            }
        }
    }
    
    // === Управление навигацией по меню ===
    if (profileMenuItems.length > 0) {
        profileMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Удаляем активный класс у всех пунктов
                profileMenuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Добавляем активный класс нажатому пункту
                this.classList.add('active');
                
                // Получаем целевой раздел
                const targetId = this.getAttribute('href').substring(1);
                
                // Скрываем все разделы
                document.querySelectorAll('.profile-section').forEach(section => {
                    section.classList.remove('active-section');
                    section.style.display = 'none';
                });
                
                // Показываем целевой раздел
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active-section');
                    targetSection.style.display = 'block';
                    
                    // Для раздела "Мои заказы" показываем активные заказы по умолчанию
                    if (targetId === 'orders') {
                        showTab('active');
                    }
                }
            });
        });
    }
    
    // === Управление табами в разделе "Мои заказы" ===
    function showTab(tabName) {
        // Удаляем активный класс у всех кнопок
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс нажатой кнопке
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Скрываем все списки заказов
        const orderLists = ['active-orders', 'completed-orders', 'draft-orders'];
        orderLists.forEach(listId => {
            const list = document.getElementById(listId);
            if (list) {
                list.style.display = 'none';
            }
        });
        
        // Показываем выбранный список
        const selectedList = document.getElementById(`${tabName}-orders`);
        if (selectedList) {
            selectedList.style.display = 'flex';
        }
        
        // Для черновиков, если их нет, показываем сообщение
        if (tabName === 'draft') {
            const emptyDraft = document.getElementById('empty-draft');
            if (emptyDraft) {
                const draftOrders = document.querySelectorAll('#draft-orders .order-item').length;
                if (draftOrders === 0) {
                    emptyDraft.style.display = 'block';
                } else {
                    emptyDraft.style.display = 'none';
                }
            }
        }
    }
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                showTab(tabName);
            });
        });
    }
    
    // === Управление формой профиля ===
    if (profileForm) {
        // Загрузка сохраненных данных профиля
        function loadProfileData() {
            const savedName = localStorage.getItem('profileName') || 'Иван Иванов';
            const savedTelegram = localStorage.getItem('profileTelegram') || '@ivan_ivanov';
            
            document.getElementById('profileName').value = savedName;
            document.getElementById('profileTelegram').value = savedTelegram;
            document.getElementById('sidebarName').textContent = savedName;
            document.getElementById('sidebarTelegram').innerHTML = `<i class="fab fa-telegram"></i><span>${savedTelegram}</span>`;
        }
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных из формы
            const formData = {
                name: document.getElementById('profileName').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                city: document.getElementById('profileCity').value,
                telegram: document.getElementById('profileTelegram').value
            };
            
            // Валидация
            if (!formData.name || !formData.email || !formData.phone || !formData.city) {
                alert('Пожалуйста, заполните все обязательные поля!');
                return;
            }
            
            // Валидация Telegram
            if (formData.telegram && !formData.telegram.startsWith('@')) {
                formData.telegram = '@' + formData.telegram;
                document.getElementById('profileTelegram').value = formData.telegram;
            }
            
            // Симуляция сохранения данных
            console.log('Сохраненные данные профиля:', formData);
            
            // Сохраняем в localStorage для демонстрации
            localStorage.setItem('profileName', formData.name);
            localStorage.setItem('profileTelegram', formData.telegram);
            
            // Обновляем данные в сайдбаре
            document.getElementById('sidebarName').textContent = formData.name;
            document.getElementById('sidebarTelegram').innerHTML = `<i class="fab fa-telegram"></i><span>${formData.telegram}</span>`;
            
            // Показать сообщение об успехе
            alert('Профиль успешно обновлен!');
        });
    }
    
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            document.getElementById('profileForm').reset();
            loadProfileData();
        });
    }
    
    // === Управление выбором суммы для пополнения баланса ===
    if (balanceOptionBtns.length > 0) {
        balanceOptionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = this.getAttribute('data-amount');
                customAmountInput.value = amount;
                
                // Визуальная обратная связь
                balanceOptionBtns.forEach(b => {
                    b.style.opacity = '0.7';
                    b.style.transform = 'scale(1)';
                });
                this.style.opacity = '1';
                this.style.transform = 'scale(0.98)';
            });
        });
    }
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            // Сбрасываем выделение кнопок при вводе своей суммы
            balanceOptionBtns.forEach(b => {
                b.style.opacity = '0.7';
                b.style.transform = 'scale(1)';
            });
        });
    }
    
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', function() {
            const customAmount = document.getElementById('customAmount').value;
            const amount = customAmount ? parseInt(customAmount) : 0;
            
            if (amount < 100) {
                alert('Минимальная сумма пополнения - 100 рублей');
                return;
            }
            
            console.log('Пополнение баланса на сумму:', amount);
            alert(`Перенаправление на страницу оплаты ${amount} рублей...\n\nВ реальном приложении здесь будет подключение к платежной системе.`);
            
            // Сброс поля
            document.getElementById('customAmount').value = '';
            balanceOptionBtns.forEach(b => {
                b.style.opacity = '0.7';
                b.style.transform = 'scale(1)';
            });
        });
    }
    
    // === Инициализация при загрузке страницы ===
    function initPage() {
        // Загружаем сохраненные данные
        loadSavedAvatar();
        if (profileForm) {
            loadProfileData();
        }
        
        // Показываем раздел профиля по умолчанию
        document.getElementById('profile').style.display = 'block';
        document.getElementById('profile').classList.add('active-section');
        
        // Скрываем другие разделы
        document.getElementById('orders').style.display = 'none';
        document.getElementById('balance').style.display = 'none';
    }
    
    // Запускаем инициализацию
    initPage();
});