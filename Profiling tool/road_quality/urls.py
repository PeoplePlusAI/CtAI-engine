from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_image, name='home'),
    path("response/<id>", views.get_previous_response, name ="response"),
    path("visualization/", views.get_all_response, name ="response"),
]