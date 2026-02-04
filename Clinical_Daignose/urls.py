from django.urls import path
from .views import pcos_form_view

urlpatterns = [
    path("", pcos_form_view, name="pcos_form"),
]
