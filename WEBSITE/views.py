import requests
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Create your views here.
def index(request):
    return render(request, 'WEBSITE/index.html')

def auth_view(request):
    return render(request, 'WEBSITE/auth.html')

def order_view(request):
    return render(request, 'WEBSITE/order.html')

def personal_account_view(request):
    return render(request, 'WEBSITE/personal_account.html')

def registr_view(request):
    return render(request, 'WEBSITE/registr.html')

def add_order_view(request):
    return render(request, 'WEBSITE/add_order.html')

# Новые представления
def privacy_view(request):
    return render(request, 'WEBSITE/privacy.html')

def personal_data_view(request):
    return render(request, 'WEBSITE/personal_data.html')

def offer_view(request):
    return render(request, 'WEBSITE/offer.html')