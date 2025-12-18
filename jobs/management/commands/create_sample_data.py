from django.core.management.base import BaseCommand
from jobs.models import Company, Location, Skill, Job, JobSource
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Create sample data for testing'
    
    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create Job Source
        source, _ = JobSource.objects.get_or_create(
            name='Sample Data',
            defaults={
                'base_url': 'https://example.com',
                'is_active': True,
                'scraping_frequency': 24
            }
        )
        
        # Create Skills
        skills_data = [
            ('Python', 'Programming'),
            ('JavaScript', 'Programming'),
            ('React', 'Frontend'),
            ('Node.js', 'Backend'),
            ('Django', 'Backend'),
            ('SQL', 'Database'),
            ('AWS', 'Cloud'),
            ('Docker', 'DevOps'),
            ('Git', 'DevOps'),
            ('Machine Learning', 'Data Science'),
        ]
        
        skills = []
        for name, category in skills_data:
            skill, _ = Skill.objects.get_or_create(
                name=name,
                defaults={'category': category}
            )
            skills.append(skill)
        
        # Create Companies
        companies_data = [
            'TechCorp', 'InnovateLabs', 'DataDrive', 'CloudNine',
            'DevMasters', 'CodeCraft', 'AIVentures', 'WebWizards',
            'SoftSolutions', 'DigitalDreams'
        ]
        
        companies = []
        for name in companies_data:
            company, _ = Company.objects.get_or_create(
                name=name,
                defaults={'description': f'{name} is a leading technology company.'}
            )
            companies.append(company)
        
        # Create Locations
        locations_data = [
            ('San Francisco', 'USA', False),
            ('New York', 'USA', False),
            ('London', 'UK', False),
            ('Berlin', 'Germany', False),
            ('Remote', 'Worldwide', True),
        ]
        
        locations = []
        for city, country, is_remote in locations_data:
            location, _ = Location.objects.get_or_create(
                city=city,
                country=country,
                is_remote=is_remote
            )
            locations.append(location)
        
        # Create Jobs
        job_titles = [
            'Senior Python Developer',
            'Full Stack JavaScript Developer',
            'React Frontend Engineer',
            'Backend Node.js Developer',
            'DevOps Engineer',
            'Data Scientist',
            'Machine Learning Engineer',
            'Cloud Solutions Architect',
            'Senior Django Developer',
            'Software Engineer',
        ]
        
        job_types = ['full_time', 'part_time', 'contract']
        experience_levels = ['entry', 'mid', 'senior', 'lead']
        
        for i, title in enumerate(job_titles):
            for _ in range(3):  # Create 3 jobs for each title
                job = Job.objects.create(
                    title=title,
                    company=random.choice(companies),
                    location=random.choice(locations),
                    description=f"Exciting opportunity for a {title}. We are looking for talented individuals to join our team.",
                    job_type=random.choice(job_types),
                    experience_level=random.choice(experience_levels),
                    salary_min=random.randint(60000, 120000),
                    salary_max=random.randint(120000, 200000),
                    salary_currency='USD',
                    source=source,
                    external_url='https://example.com/job',
                    status='approved',
                    posted_date=timezone.now().date() - timedelta(days=random.randint(0, 30)),
                    is_active=True
                )
                
                # Add random skills
                job.skills.set(random.sample(skills, random.randint(3, 6)))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created sample data!'))
        self.stdout.write(f'- Companies: {len(companies)}')
        self.stdout.write(f'- Locations: {len(locations)}')
        self.stdout.write(f'- Skills: {len(skills)}')
        self.stdout.write(f'- Jobs: {Job.objects.count()}')