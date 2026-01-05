import requests
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib import messages
from django.urls import reverse
import random
from datetime import datetime, timedelta

# ============ ДЕМО ДАННЫЕ ДЛЯ ПРОЕКТА ============
DEMO_CATEGORIES = [
    {'id': 1, 'name': 'Ремонт техники', 'icon': 'fas fa-tools'},
    {'id': 2, 'name': 'Дизайн', 'icon': 'fas fa-paint-brush'},
    {'id': 3, 'name': 'Программирование', 'icon': 'fas fa-code'},
    {'id': 4, 'name': 'Ремонт и строительство', 'icon': 'fas fa-hard-hat'},
    {'id': 5, 'name': 'Уборка', 'icon': 'fas fa-broom'},
    {'id': 6, 'name': 'Репетиторство', 'icon': 'fas fa-graduation-cap'},
    {'id': 7, 'name': 'Красота и здоровье', 'icon': 'fas fa-spa'},
    {'id': 8, 'name': 'Грузоперевозки', 'icon': 'fas fa-truck-moving'},
]

DEMO_USERS = {
    1: {
        'id': 1,
        'name': 'Иван Иванов',
        'email': 'ivan@example.com',
        'phone': '+7 (999) 123-45-67',
        'city': 'Москва',
        'telegram': '@ivan_ivanov',
        'role': 'customer',
        'balance': 15750,
        'avatar': None,
        'rating': 4.8,
        'orders_count': 12
    },
    2: {
        'id': 2,
        'name': 'Анна Петрова',
        'email': 'anna@example.com',
        'phone': '+7 (999) 876-54-32',
        'city': 'Санкт-Петербург',
        'telegram': '@anna_p',
        'role': 'executor',
        'balance': 8500,
        'avatar': None,
        'rating': 4.9,
        'orders_count': 28
    }
}

def generate_demo_orders(count=20):
    """Генерация демо-заказов"""
    titles = [
        'Ремонт ноутбука ASUS', 'Дизайн логотипа для кафе', 
        'Разработка сайта-визитки', 'Установка Windows на ПК',
        'Перевозка мебели', 'Уборка квартиры', 'Ремонт холодильника',
        'Обучение программированию Python', 'Маникюр на дому',
        'Монтаж гипсокартонной перегородки'
    ]
    
    descriptions = [
        'Требуется замена матрицы на ноутбуке. Диагностика и ремонт.',
        'Нужен современный логотип для кофейни в минималистичном стиле.',
        'Требуется разработка одностраничного сайта-визитки для компании.',
        'Установка Windows 10, настройка всех драйверов и программ.',
        'Перевезти диван и два кресла на новую квартиру.',
        'Генеральная уборка 3-комнатной квартиры.',
        'Не морозит холодильник, требуется диагностика и ремонт.',
        'Обучение основам Python для начинающих.',
        'Маникюр с покрытием гель-лаком на дому.',
        'Монтаж гипсокартонной перегородки 3 метра.'
    ]
    
    cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань']
    
    orders = []
    for i in range(1, count + 1):
        category = random.choice(DEMO_CATEGORIES)
        price = random.randint(1000, 50000) // 1000 * 1000  # Округление до тысяч
        
        # Генерация даты публикации (от 1 до 30 дней назад)
        days_ago = random.randint(1, 30)
        pub_date = datetime.now() - timedelta(days=days_ago)
        
        # Генерация дедлайна (от 1 до 14 дней вперед)
        deadline_days = random.randint(1, 14)
        deadline_date = datetime.now() + timedelta(days=deadline_days)
        
        order = {
            'id': i,
            'title': random.choice(titles),
            'description': random.choice(descriptions),
            'price': price,
            'category': category['name'],
            'category_id': category['id'],
            'location': f"{random.choice(cities)}, {random.choice(['Центр', 'Сев', 'Юг', 'Вост', 'Зап'])}",
            'status': random.choice(['active', 'active', 'active', 'completed']),
            'customer_id': 1,  # Все заказы от первого пользователя
            'created_at': pub_date.strftime('%d.%m.%Y, %H:%M'),
            'deadline': deadline_date.strftime('%d.%m.%Y'),
            'image_url': f'https://picsum.photos/400/300?random={i}',
            'responses_count': random.randint(0, 10),
            'featured': i <= 3,  # Первые 3 заказа - в топе
            'user': DEMO_USERS[1]
        }
        orders.append(order)
    
    return orders

DEMO_ORDERS = generate_demo_orders()

# ============ СЕССИЯ И АВТОРИЗАЦИЯ ============
def get_session_user(request):
    """Получить текущего пользователя из сессии"""
    user_id = request.session.get('user_id', 1)  # По умолчанию первый пользователь
    return DEMO_USERS.get(user_id)

def login_user(request, user_id):
    """Авторизовать пользователя"""
    request.session['user_id'] = user_id
    request.session['is_authenticated'] = True
    request.session['user_name'] = DEMO_USERS[user_id]['name']
    request.session['user_email'] = DEMO_USERS[user_id]['email']
    return True

def logout_user(request):
    """Выйти из системы"""
    request.session.flush()
    return True

# ============ ГЛАВНАЯ СТРАНИЦА ============
def index(request):
    """Главная страница с активными заказами"""
    # Активные заказы
    active_orders = [o for o in DEMO_ORDERS if o['status'] == 'active'][:9]
    
    # Категории для фильтрации
    categories = DEMO_CATEGORIES
    
    # Текущий пользователь
    current_user = get_session_user(request)
    
    context = {
        'orders': active_orders,
        'categories': categories,
        'user': current_user,
        'featured_orders': [o for o in active_orders if o['featured']][:3],
        'stats': {
            'total_orders': len([o for o in DEMO_ORDERS if o['status'] == 'active']),
            'total_categories': len(DEMO_CATEGORIES),
            'average_price': sum(o['price'] for o in active_orders) // len(active_orders) if active_orders else 0
        }
    }
    
    return render(request, 'WEBSITE/index.html', context)

# ============ СТРАНИЦА ЗАКАЗА ============
def order_view(request, order_id):
    """Детальная страница заказа"""
    try:
        order = next((o for o in DEMO_ORDERS if o['id'] == int(order_id)), None)
        if not order:
            messages.error(request, 'Заказ не найден')
            return redirect('index')
        
        # Похожие заказы (той же категории)
        similar_orders = [
            o for o in DEMO_ORDERS 
            if o['category_id'] == order['category_id'] and o['id'] != order['id']
        ][:3]
        
        current_user = get_session_user(request)
        
        # Проверка, откликался ли пользователь на этот заказ
        user_responses = request.session.get('user_responses', [])
        has_responded = order_id in user_responses
        
        context = {
            'order': order,
            'similar_orders': similar_orders,
            'user': current_user,
            'has_responded': has_responded
        }
        
        return render(request, 'WEBSITE/order.html', context)
        
    except (ValueError, KeyError) as e:
        messages.error(request, 'Ошибка загрузки заказа')
        return redirect('index')

# ============ АВТОРИЗАЦИЯ ============
@csrf_exempt
def auth_view(request):
    """Страница авторизации"""
    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')
        
        # Демо авторизация
        if email and password:
            # Находим пользователя по email
            for user_id, user_data in DEMO_USERS.items():
                if user_data['email'] == email:
                    # В демо пароль не проверяем
                    login_user(request, user_id)
                    messages.success(request, f'Добро пожаловать, {user_data["name"]}!')
                    return redirect('personal_account_view')
        
        messages.error(request, 'Неверный email или пароль')
        return redirect('auth_view')
    
    # Если уже авторизован
    if request.session.get('is_authenticated'):
        return redirect('personal_account_view')
    
    return render(request, 'WEBSITE/auth.html')

# ============ ЛИЧНЫЙ КАБИНЕТ ============
def personal_account_view(request):
    """Личный кабинет пользователя"""
    current_user = get_session_user(request)
    
    if not current_user:
        messages.error(request, 'Необходимо авторизоваться')
        return redirect('auth_view')
    
    # Заказы текущего пользователя
    user_orders = [o for o in DEMO_ORDERS if o['customer_id'] == current_user['id']]
    
    # Активные и завершенные заказы
    active_orders = [o for o in user_orders if o['status'] == 'active']
    completed_orders = [o for o in user_orders if o['status'] == 'completed']
    
    # Ответы на заказы пользователя (если он исполнитель)
    if current_user['role'] == 'executor':
        responses = request.session.get('executor_responses', [])
    else:
        responses = []
    
    context = {
        'user': current_user,
        'active_orders': active_orders,
        'completed_orders': completed_orders,
        'responses': responses,
        'balance_history': [
            {'date': '15.12.2023', 'amount': 5000, 'type': 'пополнение'},
            {'date': '10.12.2023', 'amount': -3500, 'type': 'оплата заказа'},
            {'date': '05.12.2023', 'amount': 10000, 'type': 'пополнение'}
        ]
    }
    
    return render(request, 'WEBSITE/personal_account.html', context)

# ============ РЕГИСТРАЦИЯ ============
@csrf_exempt
def registr_view(request):
    """Страница регистрации"""
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        password = request.POST.get('password', '').strip()
        city = request.POST.get('city', '').strip()
        
        # Валидация
        errors = []
        if not name: errors.append('Введите имя')
        if not email or '@' not in email: errors.append('Введите корректный email')
        if not phone or len(phone) < 10: errors.append('Введите корректный телефон')
        if not password or len(password) < 6: errors.append('Пароль должен быть не менее 6 символов')
        if not city: errors.append('Введите город')
        
        if errors:
            messages.error(request, '<br>'.join(errors))
            return render(request, 'WEBSITE/registr.html')
        
        # Создаем нового пользователя (в демо просто выбираем существующего)
        new_user_id = max(DEMO_USERS.keys()) + 1
        DEMO_USERS[new_user_id] = {
            'id': new_user_id,
            'name': name,
            'email': email,
            'phone': phone,
            'city': city,
            'telegram': '',
            'role': 'customer',
            'balance': 0,
            'avatar': None,
            'rating': 0.0,
            'orders_count': 0
        }
        
        # Авторизуем пользователя
        login_user(request, new_user_id)
        messages.success(request, f'Регистрация успешна! Добро пожаловать, {name}!')
        return redirect('personal_account_view')
    
    return render(request, 'WEBSITE/registr.html')

# ============ ДОБАВЛЕНИЕ ЗАКАЗА ============
@csrf_exempt
def add_order_view(request):
    """Страница добавления заказа"""
    current_user = get_session_user(request)
    
    if not current_user:
        messages.error(request, 'Необходимо авторизоваться')
        return redirect('auth_view')
    
    if request.method == 'POST':
        # Валидация данных
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        category_id = request.POST.get('category', '').strip()
        budget = request.POST.get('budget', '0').strip()
        location = request.POST.get('location', '').strip()
        deadline = request.POST.get('deadline', '').strip()
        phone = request.POST.get('phone', '').strip()
        
        errors = []
        
        if not title or len(title) < 5:
            errors.append('Название должно быть не менее 5 символов')
        
        if not description or len(description) < 20:
            errors.append('Описание должно быть не менее 20 символов')
        
        if not category_id:
            errors.append('Выберите категорию')
        
        try:
            budget_int = int(budget)
            if budget_int < 100:
                errors.append('Бюджет должен быть не менее 100 рублей')
        except ValueError:
            errors.append('Некорректный бюджет')
        
        if not location or len(location) < 3:
            errors.append('Укажите местоположение')
        
        if not deadline:
            errors.append('Укажите срок выполнения')
        
        if not phone or len(phone) < 10:
            errors.append('Укажите корректный телефон')
        
        if errors:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': errors})
            else:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'WEBSITE/add_order.html', {
                    'categories': DEMO_CATEGORIES,
                    'user': current_user
                })
        
        # Создание нового заказа
        new_order_id = max([o['id'] for o in DEMO_ORDERS]) + 1
        category = next((c for c in DEMO_CATEGORIES if str(c['id']) == category_id), DEMO_CATEGORIES[0])
        
        new_order = {
            'id': new_order_id,
            'title': title,
            'description': description,
            'price': int(budget),
            'category': category['name'],
            'category_id': category['id'],
            'location': location,
            'status': 'active',
            'customer_id': current_user['id'],
            'created_at': datetime.now().strftime('%d.%m.%Y, %H:%M'),
            'deadline': deadline,
            'image_url': f'https://picsum.photos/400/300?random={new_order_id}',
            'responses_count': 0,
            'featured': len([o for o in DEMO_ORDERS if o['featured']]) < 3,
            'user': current_user
        }
        
        DEMO_ORDERS.insert(0, new_order)
        current_user['orders_count'] += 1
        
        messages.success(request, 'Заказ успешно создан!')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Заказ успешно опубликован',
                'order_id': new_order_id
            })
        else:
            return redirect('order_view', order_id=new_order_id)
    
    # GET запрос
    return render(request, 'WEBSITE/add_order.html', {
        'categories': DEMO_CATEGORIES,
        'user': current_user
    })

# ============ ОТКЛИК НА ЗАКАЗ ============
@csrf_exempt
def respond_to_order(request, order_id):
    """Обработка отклика на заказ"""
    if not request.session.get('is_authenticated'):
        return JsonResponse({'success': False, 'message': 'Необходимо авторизоваться'})
    
    current_user = get_session_user(request)
    
    # Проверяем, существует ли заказ
    order = next((o for o in DEMO_ORDERS if o['id'] == int(order_id)), None)
    if not order:
        return JsonResponse({'success': False, 'message': 'Заказ не найден'})
    
    # Проверяем, не откликался ли уже пользователь
    user_responses = request.session.get('user_responses', [])
    if order_id in user_responses:
        return JsonResponse({'success': False, 'message': 'Вы уже откликались на этот заказ'})
    
    # Проверяем, не свой ли это заказ
    if order['customer_id'] == current_user['id']:
        return JsonResponse({'success': False, 'message': 'Нельзя откликаться на свой заказ'})
    
    # Добавляем отклик
    user_responses.append(order_id)
    request.session['user_responses'] = user_responses
    
    # Увеличиваем счетчик откликов в заказе
    order['responses_count'] += 1
    
    # Сохраняем отклик для исполнителя
    if current_user['role'] == 'executor':
        executor_responses = request.session.get('executor_responses', [])
        executor_responses.append({
            'order_id': order_id,
            'order_title': order['title'],
            'date': datetime.now().strftime('%d.%m.%Y %H:%M'),
            'status': 'pending'
        })
        request.session['executor_responses'] = executor_responses
    
    return JsonResponse({
        'success': True, 
        'message': 'Отклик успешно отправлен!',
        'responses_count': order['responses_count']
    })

# ============ ВЫХОД ============
def logout_view(request):
    """Выход из системы"""
    logout_user(request)
    messages.success(request, 'Вы успешно вышли из системы')
    return redirect('index')

# ============ ПОИСК ЗАКАЗОВ ============
def search_orders(request):
    """Поиск заказов"""
    query = request.GET.get('q', '').strip()
    category = request.GET.get('category', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    city = request.GET.get('city', '')
    
    # Фильтруем заказы
    filtered_orders = DEMO_ORDERS.copy()
    
    if query:
        filtered_orders = [
            o for o in filtered_orders 
            if query.lower() in o['title'].lower() or query.lower() in o['description'].lower()
        ]
    
    if category:
        filtered_orders = [o for o in filtered_orders if str(o['category_id']) == category]
    
    if min_price:
        filtered_orders = [o for o in filtered_orders if o['price'] >= int(min_price)]
    
    if max_price:
        filtered_orders = [o for o in filtered_orders if o['price'] <= int(max_price)]
    
    if city:
        filtered_orders = [o for o in filtered_orders if city.lower() in o['location'].lower()]
    
    current_user = get_session_user(request)
    
    context = {
        'orders': filtered_orders,
        'categories': DEMO_CATEGORIES,
        'user': current_user,
        'search_query': query,
        'filters': {
            'category': category,
            'min_price': min_price,
            'max_price': max_price,
            'city': city
        },
        'stats': {
            'found': len(filtered_orders),
            'total': len(DEMO_ORDERS)
        }
    }
    
    return render(request, 'WEBSITE/search.html', context)

# ============ ПОПОЛНЕНИЕ БАЛАНСА ============
@csrf_exempt
def topup_balance(request):
    """Пополнение баланса"""
    if not request.session.get('is_authenticated'):
        return JsonResponse({'success': False, 'message': 'Необходимо авторизоваться'})
    
    if request.method == 'POST':
        amount = int(request.POST.get('amount', 0))
        
        if amount < 100:
            return JsonResponse({'success': False, 'message': 'Минимальная сумма 100 рублей'})
        
        # В реальном проекте здесь была бы интеграция с платежной системой
        current_user = get_session_user(request)
        current_user['balance'] += amount
        
        # Сохраняем историю пополнений
        history = request.session.get('balance_history', [])
        history.append({
            'date': datetime.now().strftime('%d.%m.%Y %H:%M'),
            'amount': amount,
            'type': 'пополнение'
        })
        request.session['balance_history'] = history
        
        return JsonResponse({
            'success': True,
            'message': f'Баланс пополнен на {amount} рублей',
            'new_balance': current_user['balance']
        })
    
    return JsonResponse({'success': False, 'message': 'Неверный метод запроса'})

# ============ ЮРИДИЧЕСКИЕ СТРАНИЦЫ ============
def privacy_view(request):
    """Политика конфиденциальности"""
    return render(request, 'WEBSITE/privacy.html', {'user': get_session_user(request)})

def personal_data_view(request):
    """Обработка персональных данных"""
    return render(request, 'WEBSITE/personal_data.html', {'user': get_session_user(request)})

def offer_view(request):
    """Пользовательское соглашение"""
    return render(request, 'WEBSITE/offer.html', {'user': get_session_user(request)})

# ============ API ЭНДПОИНТЫ ============
@csrf_exempt
def api_orders(request):
    """API для получения заказов"""
    status = request.GET.get('status', '')
    user_id = request.GET.get('user_id', '')
    
    filtered_orders = DEMO_ORDERS.copy()
    
    if status:
        filtered_orders = [o for o in filtered_orders if o['status'] == status]
    
    if user_id:
        filtered_orders = [o for o in filtered_orders if o['customer_id'] == int(user_id)]
    
    return JsonResponse({
        'success': True,
        'orders': filtered_orders[:50],  # Ограничиваем количество
        'total': len(filtered_orders)
    })

@csrf_exempt
def api_categories(request):
    """API для получения категорий"""
    return JsonResponse({
        'success': True,
        'categories': DEMO_CATEGORIES
    })

@csrf_exempt
def api_user(request):
    """API для получения данных пользователя"""
    current_user = get_session_user(request)
    if not current_user:
        return JsonResponse({'success': False, 'message': 'Не авторизован'})
    
    return JsonResponse({
        'success': True,
        'user': current_user
    })