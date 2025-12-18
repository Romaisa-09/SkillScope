from django.core.management.base import BaseCommand
from jobs.models import Company, Location, Skill, Job, JobSource
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Create demo scraped jobs for presentation'
    
    def handle(self, *args, **options):
        self.stdout.write('Creating demo scraped jobs...')
        
        # Get or create source
        source, _ = JobSource.objects.get_or_create(
            name='Demo Scraper',
            defaults={
                'base_url': 'https://example.com',
                'is_active': True,
                'scraping_frequency': 24
            }
        )
        
        # Demo job data
        demo_jobs = [
            {
                'title': 'Senior Python Developer',
                'company': 'Google',
                'location': 'Remote - USA',
                'description': 'We are seeking an experienced Python developer to join our cloud infrastructure team. You will work on large-scale distributed systems.',
                'skills': ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
                'salary_min': 120000,
                'salary_max': 180000,
            },
            {
                'title': 'Full Stack JavaScript Developer',
                'company': 'Meta',
                'location': 'Remote - Worldwide',
                'description': 'Join our frontend team working on React and Node.js applications. Build scalable web applications used by millions.',
                'skills': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
                'salary_min': 110000,
                'salary_max': 170000,
            },
            {
                'title': 'DevOps Engineer',
                'company': 'Amazon',
                'location': 'Remote - USA',
                'description': 'Help us build and maintain our cloud infrastructure. Experience with Kubernetes and AWS required.',
                'skills': ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Python'],
                'salary_min': 130000,
                'salary_max': 190000,
            },
            {
                'title': 'Data Scientist',
                'company': 'Netflix',
                'location': 'Remote - Worldwide',
                'description': 'Work on recommendation systems and data analysis. Strong Python and ML skills required.',
                'skills': ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Science'],
                'salary_min': 140000,
                'salary_max': 200000,
            },
            {
                'title': 'React Frontend Developer',
                'company': 'Shopify',
                'location': 'Remote - Canada',
                'description': 'Build beautiful, responsive UIs for our e-commerce platform using React and modern web technologies.',
                'skills': ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
                'salary_min': 90000,
                'salary_max': 140000,
            },
            {
                'title': 'Backend Engineer - Node.js',
                'company': 'Stripe',
                'location': 'Remote - USA',
                'description': 'Design and implement scalable APIs for payment processing. Experience with microservices required.',
                'skills': ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
                'salary_min': 120000,
                'salary_max': 180000,
            },
            {
                'title': 'Machine Learning Engineer',
                'company': 'OpenAI',
                'location': 'Remote - Worldwide',
                'description': 'Work on cutting-edge AI models. Strong background in deep learning and Python required.',
                'skills': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'AI'],
                'salary_min': 150000,
                'salary_max': 250000,
            },
            {
                'title': 'Cloud Solutions Architect',
                'company': 'Microsoft',
                'location': 'Remote - USA',
                'description': 'Design cloud solutions for enterprise clients. Azure certification preferred.',
                'skills': ['Azure', 'AWS', 'Cloud', 'Kubernetes', 'DevOps'],
                'salary_min': 140000,
                'salary_max': 200000,
            },
            {
                'title': 'Senior Django Developer',
                'company': 'Instagram',
                'location': 'Remote - Worldwide',
                'description': 'Build backend services for our social media platform. Django and PostgreSQL experience required.',
                'skills': ['Python', 'Django', 'PostgreSQL', 'Redis', 'REST API'],
                'salary_min': 130000,
                'salary_max': 190000,
            },
            {
                'title': 'Mobile App Developer - React Native',
                'company': 'Airbnb',
                'location': 'Remote - USA',
                'description': 'Develop cross-platform mobile applications using React Native.',
                'skills': ['React', 'React Native', 'JavaScript', 'Mobile', 'TypeScript'],
                'salary_min': 110000,
                'salary_max': 170000,
            },
        ]
        
        jobs_created = 0
        
        for job_data in demo_jobs:
            # Create company
            company, _ = Company.objects.get_or_create(
                name=job_data['company'],
                defaults={'description': f'{job_data["company"]} is a leading technology company.'}
            )
            
            # Create location
            location, _ = Location.objects.get_or_create(
                city='Remote',
                country=job_data['location'].split(' - ')[1],
                is_remote=True
            )
            
            # Check if exists
            if Job.objects.filter(
                title=job_data['title'],
                company=company
            ).exists():
                continue
            
            # Create job
            job = Job.objects.create(
                title=job_data['title'],
                company=company,
                location=location,
                description=job_data['description'],
                job_type='full_time',
                experience_level=random.choice(['mid', 'senior']),
                salary_min=job_data['salary_min'],
                salary_max=job_data['salary_max'],
                salary_currency='USD',
                source=source,
                external_url=f'https://example.com/job/{jobs_created}',
                status='pending',
                posted_date=timezone.now().date()
            )
            
            # Add skills
            for skill_name in job_data['skills']:
                skill, _ = Skill.objects.get_or_create(name=skill_name)
                job.skills.add(skill)
            
            jobs_created += 1
            self.stdout.write(f'Created: {job_data["title"]} at {job_data["company"]}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {jobs_created} demo jobs!')
        )