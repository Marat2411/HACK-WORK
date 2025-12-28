from django.urls import path
from . import views
from django.shortcuts import render

urlpatterns = [
    path('', views.index, name='home'),
    path('auth/', views.auth_view, name='auth'),
    path('order/', views.order_view, name='order'),
    path('personal_account/', views.personal_account_view, name='personal_account'),
    path('registr/', views.registr_view, name='registr'),
    path('add_order/', views.add_order_view, name='add_order'),
]