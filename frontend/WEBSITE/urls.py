from django.urls import path
from . import views

urlpatterns = [
    # Основные страницы
    path('', views.index, name='index'),
    path('auth/', views.auth_view, name='auth_view'),
    path('logout/', views.logout_view, name='logout_view'),
    path('order/<int:order_id>/', views.order_view, name='order_view'),
    path('personal_account/', views.personal_account_view, name='personal_account_view'),
    path('registr/', views.registr_view, name='registr_view'),
    path('add_order/', views.add_order_view, name='add_order_view'),
    path('search/', views.search_orders, name='search_orders'),
    
    # Действия
    path('order/<int:order_id>/respond/', views.respond_to_order, name='respond_to_order'),
    path('balance/topup/', views.topup_balance, name='topup_balance'),
    
    # API эндпоинты
    path('api/orders/', views.api_orders, name='api_orders'),
    path('api/categories/', views.api_categories, name='api_categories'),
    path('api/user/', views.api_user, name='api_user'),
    
    # Юридические страницы
    path('privacy/', views.privacy_view, name='privacy_view'),
    path('personal_data/', views.personal_data_view, name='personal_data_view'),
    path('offer/', views.offer_view, name='offer_view'),
]