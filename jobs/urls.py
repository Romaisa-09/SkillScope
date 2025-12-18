from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'skills', views.SkillViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'jobs', views.JobViewSet)
router.register(r'sources', views.JobSourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]