from rest_framework import serializers
from .models import Company, Skill, Location, Job, JobSource

class CompanySerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'website', 'logo', 'description', 'job_count', 'created_at']
    
    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True, status='approved').count()

class SkillSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'job_count']
    
    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True, status='approved').count()

class LocationSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Location
        fields = ['id', 'city', 'country', 'is_remote', 'job_count']
    
    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True, status='approved').count()

class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing jobs"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    location_display = serializers.SerializerMethodField()
    skills_list = serializers.StringRelatedField(source='skills', many=True, read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'location_display', 
            'job_type', 'experience_level', 'salary_min', 'salary_max',
            'salary_currency', 'skills_list', 'posted_date', 'views'
        ]
    
    def get_location_display(self, obj):
        return str(obj.location) if obj.location else "Not specified"

class JobDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single job view"""
    company = CompanySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    source_name = serializers.CharField(source='source.name', read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'

class JobSourceSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobSource
        fields = ['id', 'name', 'base_url', 'is_active', 'scraping_frequency', 
                  'last_scraped', 'job_count']
    
    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True).count()