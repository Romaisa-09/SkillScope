from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Avg, Q
from jobs.models import Job, Company, Skill, Location, JobView
from django.utils import timezone
from datetime import timedelta
import json

def home(request):
    """Home page with overview"""
    # Get statistics
    total_jobs = Job.objects.filter(is_active=True, status='approved').count()
    total_companies = Company.objects.count()
    total_skills = Skill.objects.count()
    total_locations = Location.objects.count()
    
    # Recent jobs (last 10)
    recent_jobs = Job.objects.filter(
        is_active=True, 
        status='approved'
    ).select_related('company', 'location').prefetch_related('skills')[:10]
    
    # Top 8 demanded skills
    top_skills = Skill.objects.annotate(
        job_count=Count('jobs', filter=Q(jobs__is_active=True, jobs__status='approved'))
    ).order_by('-job_count')[:8]
    
    # Prepare chart data
    top_skills_labels = json.dumps([skill.name for skill in top_skills])
    top_skills_data = json.dumps([skill.job_count for skill in top_skills])
    
    context = {
        'total_jobs': total_jobs,
        'total_companies': total_companies,
        'total_skills': total_skills,
        'total_locations': total_locations,
        'recent_jobs': recent_jobs,
        'top_skills_labels': top_skills_labels,
        'top_skills_data': top_skills_data,
    }
    
    return render(request, 'home.html', context)


def jobs_list(request):
    """Browse all jobs with filters"""
    jobs = Job.objects.filter(is_active=True, status='approved').select_related(
        'company', 'location'
    ).prefetch_related('skills')
    
    # Search filter
    search = request.GET.get('search', '')
    if search:
        jobs = jobs.filter(
            Q(title__icontains=search) | 
            Q(description__icontains=search) |
            Q(company__name__icontains=search) |
            Q(tags__icontains=search)
        )
    
    # Location filter
    location = request.GET.get('location', '')
    if location:
        jobs = jobs.filter(
            Q(location__city__icontains=location) |
            Q(location__country__icontains=location)
        )
    
    # Job type filter
    job_type = request.GET.get('job_type', '')
    if job_type:
        jobs = jobs.filter(job_type=job_type)
    
    # Experience level filter
    experience = request.GET.get('experience', '')
    if experience:
        jobs = jobs.filter(experience_level=experience)
    
    # Skill filter
    skill = request.GET.get('skill', '')
    if skill:
        jobs = jobs.filter(skills__name__icontains=skill)
    
    # Get all skills and locations for filters
    all_skills = Skill.objects.all().order_by('name')
    all_locations = Location.objects.all().order_by('country', 'city')
    
    context = {
        'jobs': jobs[:50],  # Limit to 50 for performance
        'all_skills': all_skills,
        'all_locations': all_locations,
        'search': search,
        'location': location,
        'job_type': job_type,
        'experience': experience,
        'skill': skill,
    }
    
    return render(request, 'jobs.html', context)


def job_detail(request, job_id):
    """Job detail page"""
    job = get_object_or_404(
        Job.objects.select_related('company', 'location', 'source').prefetch_related('skills'),
        id=job_id,
        is_active=True,
        status='approved'
    )
    
    # Track view
    job.views += 1
    job.save(update_fields=['views'])
    
    # Log view
    JobView.objects.create(
        job=job,
        ip_address=get_client_ip(request)
    )
    
    # Similar jobs
    similar_jobs = Job.objects.filter(
        is_active=True,
        status='approved'
    ).filter(
        Q(company=job.company) |
        Q(skills__in=job.skills.all())
    ).exclude(id=job.id).distinct()[:4]
    
    context = {
        'job': job,
        'similar_jobs': similar_jobs,
    }
    
    return render(request, 'job_detail.html', context)


def analytics(request):
    """Analytics dashboard"""
    # Jobs by type
    jobs_by_type = Job.objects.filter(
        is_active=True, status='approved'
    ).values('job_type').annotate(count=Count('id')).order_by('-count')
    
    # Jobs by experience level
    jobs_by_experience = Job.objects.filter(
        is_active=True, status='approved'
    ).values('experience_level').annotate(count=Count('id')).order_by('-count')
    
    # Top 10 skills
    top_skills = Skill.objects.annotate(
        job_count=Count('jobs', filter=Q(jobs__is_active=True, jobs__status='approved'))
    ).order_by('-job_count')[:10]
    
    # Top 10 companies
    top_companies = Company.objects.annotate(
        job_count=Count('jobs', filter=Q(jobs__is_active=True, jobs__status='approved'))
    ).order_by('-job_count')[:10]
    
    # Top 10 locations
    top_locations = Location.objects.annotate(
        job_count=Count('jobs', filter=Q(jobs__is_active=True, jobs__status='approved'))
    ).order_by('-job_count')[:10]
    
    # Average salary
    avg_salary = Job.objects.filter(
        is_active=True, 
        status='approved',
        salary_min__isnull=False
    ).aggregate(Avg('salary_min'))['salary_min__avg']
    
    # Jobs posted over time (last 30 days)
    thirty_days_ago = timezone.now().date() - timedelta(days=30)
    jobs_over_time = Job.objects.filter(
        is_active=True,
        status='approved',
        posted_date__gte=thirty_days_ago
    ).extra(select={'day': 'date(posted_date)'}).values('day').annotate(
        count=Count('id')
    ).order_by('day')
    
    # Prepare chart data
    job_type_labels = json.dumps([item['job_type'] for item in jobs_by_type])
    job_type_data = json.dumps([item['count'] for item in jobs_by_type])
    
    experience_labels = json.dumps([item['experience_level'] for item in jobs_by_experience])
    experience_data = json.dumps([item['count'] for item in jobs_by_experience])
    
    skills_labels = json.dumps([skill.name for skill in top_skills])
    skills_data = json.dumps([skill.job_count for skill in top_skills])
    
    companies_labels = json.dumps([company.name for company in top_companies])
    companies_data = json.dumps([company.job_count for company in top_companies])
    
    locations_labels = json.dumps([str(loc) for loc in top_locations])
    locations_data = json.dumps([loc.job_count for loc in top_locations])
    
    timeline_labels = json.dumps([str(item['day']) for item in jobs_over_time])
    timeline_data = json.dumps([item['count'] for item in jobs_over_time])
    
    context = {
        'job_type_labels': job_type_labels,
        'job_type_data': job_type_data,
        'experience_labels': experience_labels,
        'experience_data': experience_data,
        'skills_labels': skills_labels,
        'skills_data': skills_data,
        'companies_labels': companies_labels,
        'companies_data': companies_data,
        'locations_labels': locations_labels,
        'locations_data': locations_data,
        'timeline_labels': timeline_labels,
        'timeline_data': timeline_data,
        'avg_salary': round(avg_salary, 2) if avg_salary else 0,
        'total_jobs': Job.objects.filter(is_active=True, status='approved').count(),
    }
    
    return render(request, 'analytics.html', context)


def companies_list(request):
    """List all companies"""
    companies = Company.objects.annotate(
        job_count=Count('jobs', filter=Q(jobs__is_active=True, jobs__status='approved'))
    ).filter(job_count__gt=0).order_by('-job_count')
    
    context = {
        'companies': companies,
    }
    
    return render(request, 'companies.html', context)


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip