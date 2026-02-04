from django.urls import path
from .views import pcos_form_view, pcos_diagnosis_api

urlpatterns = [
    path("", pcos_form_view, name="pcos_form"),
    path("api/", pcos_diagnosis_api, name="pcos_api"),
]
