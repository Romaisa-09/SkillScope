from django.contrib import admin
from django.utils.html import format_html
from .models import Company, Skill, Location, Job, JobSource, JobView

# ------------------------ COMPANY ADMIN ------------------------
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    # Columns shown in the admin list page
    list_display = ['name', 'website', 'job_count', 'created_at']
    # Enable search bar for these fields
    search_fields = ['name', 'description']
    # Sidebar filters
    list_filter = ['created_at']
    
    # Custom column: count number of jobs for each company
    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = 'Total Jobs'


# ------------------------ SKILL ADMIN ------------------------
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'job_count', 'created_at']
    search_fields = ['name', 'category']
    list_filter = ['category', 'created_at']
    
    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = 'Jobs Requiring This Skill'


# ------------------------ LOCATION ADMIN ------------------------
@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['city', 'country', 'is_remote', 'job_count']
    search_fields = ['city', 'country']
    list_filter = ['is_remote', 'country']
    
    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = 'Jobs in This Location'


# ------------------------ JOB SOURCE ADMIN ------------------------
@admin.register(JobSource)
class JobSourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'base_url', 'is_active', 'scraping_frequency', 'last_scraped', 'job_count']
    list_filter = ['is_active', 'last_scraped']
    search_fields = ['name', 'base_url']
    
    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = 'Total Jobs'


# ------------------------ JOB ADMIN ------------------------
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    # Columns in job list
    list_display = ['title', 'company', 'location', 'job_type', 'experience_level',
                    'status_badge', 'posted_date', 'views']
    # Sidebar filters
    list_filter = ['status', 'job_type', 'experience_level', 'posted_date', 'is_active']
    # Search options
    search_fields = ['title', 'description', 'company__name', 'tags']
    # Better UI for selecting skills (ManyToMany)
    filter_horizontal = ['skills']
    # Date navigation bar at top
    date_hierarchy = 'posted_date'
    # Bulk actions
    actions = ['approve_jobs', 'reject_jobs']
    
    # Organize form fields into sections
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'company', 'location', 'description')
        }),
        ('Job Details', {
            'fields': ('job_type', 'experience_level', 'skills', 'tags')
        }),
        ('Salary Information', {
            'fields': ('salary_min', 'salary_max', 'salary_currency')
        }),
        ('Source & Status', {
            'fields': ('source', 'external_url', 'status', 'is_active')
        }),
        ('Metadata', {
            'fields': ('posted_date', 'views'),
            'classes': ('collapse',)  # hides this section by default
        }),
    )
    
    # Colored badges for job status
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'approved': '#28A745',
            'rejected': '#DC3545'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, '#6C757D'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    # Bulk approve jobs
    def approve_jobs(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} jobs approved successfully.')
    approve_jobs.short_description = 'Approve selected jobs'
    
    # Bulk reject jobs
    def reject_jobs(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} jobs rejected.')
    reject_jobs.short_description = 'Reject selected jobs'


# ------------------------ JOB VIEW ADMIN ------------------------
@admin.register(JobView)
class JobViewAdmin(admin.ModelAdmin):
    list_display = ['job', 'viewed_at', 'ip_address']
    list_filter = ['viewed_at']
    search_fields = ['job__title', 'ip_address']
    date_hierarchy = 'viewed_at'


# ------------------------ ADMIN SITE BRANDING ------------------------
admin.site.site_header = "SkillScope Administration"
admin.site.site_title = "SkillScope Admin"
admin.site.index_title = "Welcome to SkillScope Dashboard"
