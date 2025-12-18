from django.db import models
from django.utils import timezone

# Represents a company that posts jobs
class Company(models.Model):
    name = models.CharField(max_length=200)  # Company name
    website = models.URLField(blank=True, null=True)  # Optional website link
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)  # Optional logo
    description = models.TextField(blank=True)  # Optional company description
    created_at = models.DateTimeField(auto_now_add=True)  # Auto timestamp when created

    class Meta:
        verbose_name_plural = "Companies"  # Correct label in Django admin
        ordering = ['name']  # Sort companies alphabetically
    
    def __str__(self):
        return self.name  # How company appears in admin panel


# Represents a skill like Python, React, AWS
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Unique skill name
    category = models.CharField(max_length=100, blank=True)  # Optional skill category
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp

    class Meta:
        ordering = ['name']  # Sort alphabetically
    
    def __str__(self):
        return self.name  # Display name


# Represents a location where job is based
class Location(models.Model):
    city = models.CharField(max_length=100)  # City name
    country = models.CharField(max_length=100)  # Country name
    is_remote = models.BooleanField(default=False)  # Is it remote job?

    class Meta:
        unique_together = ['city', 'country']  # Prevent duplicate locations
        ordering = ['country', 'city']  # Sort by country then city
    
    def __str__(self):
        if self.is_remote:
            return f"Remote - {self.country}"  # Show if remote
        return f"{self.city}, {self.country}"


# Represents the job scraping source (e.g., WeWorkRemotely)
class JobSource(models.Model):
    name = models.CharField(max_length=100)  # Name of source site
    base_url = models.URLField()  # Base domain
    is_active = models.BooleanField(default=True)  # Used for enabling/disabling scrapers
    scraping_frequency = models.IntegerField(default=24)  # Hours
    last_scraped = models.DateTimeField(null=True, blank=True)  # Timestamp of last run

    def __str__(self):
        return self.name


# Main Job model that stores job listings
class Job(models.Model):
    # Choices for dropdown in Django admin
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]
    
    EXPERIENCE_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('lead', 'Lead'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    title = models.CharField(max_length=200)  # Job title
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')  # Linked company
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name='jobs')  # Job location

    description = models.TextField()  # Job description text
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full_time')  # Type of job
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='mid')  # Experience level

    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Min salary
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Max salary
    salary_currency = models.CharField(max_length=5, null=True, blank=True)  # Currency code (USD, EUR...)

    skills = models.ManyToManyField(Skill, related_name='jobs', blank=True)  # Required skills
    tags = models.CharField(max_length=1500, blank=True)  # Raw tags scraped from website

    source = models.ForeignKey(JobSource, on_delete=models.SET_NULL, null=True, related_name='jobs')  # Job origin website
    external_url = models.URLField()  # Original job link

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Approval status

    posted_date = models.DateField()  # When job was originally posted
    scraped_at = models.DateTimeField(auto_now_add=True)  # When scraper added job
    updated_at = models.DateTimeField(auto_now=True)  # When job record last updated
    is_active = models.BooleanField(default=True)  # Hide/show job without deleting
    views = models.IntegerField(default=0)  # Track number of views

    class Meta:
        ordering = ['-posted_date', '-scraped_at']  # Newest jobs first
        indexes = [
            models.Index(fields=['title', 'company']),  # Speed up search
            models.Index(fields=['posted_date']),       # Sorting/filtering
            models.Index(fields=['status']),            # Moderation filtering
        ]

    def __str__(self):
        return f"{self.title} at {self.company.name}"  # Display format


# Tracks when a user views a job
class JobView(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_views')  # Which job was viewed
    viewed_at = models.DateTimeField(auto_now_add=True)  # Time of view
    ip_address = models.GenericIPAddressField(null=True, blank=True)  # User IP (optional)

    class Meta:
        ordering = ['-viewed_at']  # Latest views first
