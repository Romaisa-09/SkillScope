from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('jobs/', views.jobs_list, name='jobs'),
    path('jobs/<int:job_id>/', views.job_detail, name='job_detail'),
    path('analytics/', views.analytics, name='analytics'),
    path('companies/', views.companies_list, name='companies'),
]
