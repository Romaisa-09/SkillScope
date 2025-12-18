from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta

from .models import Company, Skill, Location, Job, JobSource, JobView
from .serializers import (
    CompanySerializer, SkillSerializer, LocationSerializer,
    JobListSerializer, JobDetailSerializer, JobSourceSerializer
)


# ----------------------- COMPANY API -----------------------
class CompanyViewSet(viewsets.ModelViewSet):
    # Return all companies
    queryset = Company.objects.all()

    # Convert model to JSON
    serializer_class = CompanySerializer

    # Enable ?search= and ?ordering=
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    # Allow searching by name or description
    search_fields = ['name', 'description']

    # Allow sorting by name or created date
    ordering_fields = ['name', 'created_at']


# ----------------------- SKILL API -----------------------
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['name']
    
    # Custom endpoint: /skills/top_demanded/
    @action(detail=False, methods=['get'])
    def top_demanded(self, request):
        """Return top 10 most demanded skills based on job count."""
        
        skills = Skill.objects.annotate(
            job_count=Count(
                'jobs',
                filter=Q(jobs__is_active=True, jobs__status='approved')  # count only valid jobs
            )
        ).order_by('-job_count')[:10]  # top 10
        
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)


# ----------------------- LOCATION API -----------------------
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['city', 'country']
    ordering_fields = ['city', 'country']


# ----------------------- JOB API -----------------------
class JobViewSet(viewsets.ModelViewSet):
    # Only show approved & active jobs
    queryset = Job.objects.filter(is_active=True, status='approved')

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'company__name', 'tags']
    ordering_fields = ['posted_date', 'views', 'salary_min']
    
    # Use detailed serializer only when retrieving a single job
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobListSerializer
    
    # Override retrieve to track job views
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Count view
        instance.views += 1
        instance.save(update_fields=['views'])
        
        # Record the view with IP
        JobView.objects.create(
            job=instance,
            ip_address=self.get_client_ip(request)
        )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    # Helper method to extract client IP
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    # Custom API: /jobs/filter_by_skill/?skill=python
    @action(detail=False, methods=['get'])
    def filter_by_skill(self, request):
        """Filter jobs based on skill name."""
        skill_name = request.query_params.get('skill', None)
        if skill_name:
            jobs = self.queryset.filter(skills__name__icontains=skill_name)
            serializer = self.get_serializer(jobs, many=True)
            return Response(serializer.data)
        return Response({'error': 'Skill parameter required'}, status=400)
    
    # Custom API: /jobs/filter_by_location/
    @action(detail=False, methods=['get'])
    def filter_by_location(self, request):
        """Filter jobs based on city or country."""
        city = request.query_params.get('city', None)
        country = request.query_params.get('country', None)
        
        jobs = self.queryset
        if city:
            jobs = jobs.filter(location__city__icontains=city)
        if country:
            jobs = jobs.filter(location__country__icontains=country)
        
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
    
    # Custom API: /jobs/recent_jobs/
    @action(detail=False, methods=['get'])
    def recent_jobs(self, request):
        """Return jobs posted in the last 7 days."""
        seven_days_ago = timezone.now().date() - timedelta(days=7)
        jobs = self.queryset.filter(posted_date__gte=seven_days_ago)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)


# ----------------------- JOB SOURCE API -----------------------
class JobSourceViewSet(viewsets.ModelViewSet):
    queryset = JobSource.objects.all()
    serializer_class = JobSourceSerializer
