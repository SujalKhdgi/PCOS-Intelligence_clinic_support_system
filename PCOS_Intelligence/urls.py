from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def home(request):
    return redirect("pcos_form")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home),              # 👈 root redirect
    path("pcos/", include("Clinical_Daignose.urls")),
]
