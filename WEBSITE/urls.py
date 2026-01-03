from django.urls import path
from . import views
from django.shortcuts import render

urlpatterns = [
    path('', views.index, name='index'),
    path('auth/', views.auth_view, name='auth_view'),
    path('order/', views.order_view, name='order_view'),
    path('personal_account/', views.personal_account_view, name='personal_account_view'),
    path('registr/', views.registr_view, name='registr_view'),
    path('add_order/', views.add_order_view, name='add_order_view'),
]